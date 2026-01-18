import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { claudeService } from '@/lib/claude';
import { BusinessContext, QuestionnaireResponses } from '@/types';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: planId } = await params;

    // Find the plan (no authentication required)
    const plan = await prisma.plan.findUnique({
      where: {
        id: planId
      }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (plan.status === 'completed') {
      return NextResponse.json({ message: 'Plan already generated', plan });
    }

    // Update plan status to analyzing
    await prisma.plan.update({
      where: { id: planId },
      data: { 
        status: 'analyzing',
        completionPercentage: 20
      }
    });

    const startTime = Date.now();

    // Step 1: Analyze business responses with Claude
    console.log('Starting Claude analysis...');
    const analysis = await claudeService.analyzeBusinessResponses(
      plan.businessContext as BusinessContext,
      plan.questionnaireResponses as QuestionnaireResponses
    );

    // Log Claude interaction
    await prisma.claudeInteraction.create({
      data: {
        planId: plan.id,
        interactionType: 'analysis',
        promptData: JSON.stringify({
          businessContext: plan.businessContext,
          responses: plan.questionnaireResponses
        }),
        claudeResponse: JSON.stringify(analysis),
        processingTimeMs: Date.now() - startTime
      }
    });

    // Update plan with analysis
    await prisma.plan.update({
      where: { id: planId },
      data: {
        claudeAnalysis: JSON.stringify(analysis),
        status: 'generating',
        completionPercentage: 50
      }
    });

    // Step 2: Generate marketing plan content
    console.log('Generating marketing plan...');
    const generationStartTime = Date.now();
    const generatedContent = await claudeService.generateMarketingPlan(
      plan.businessContext as BusinessContext,
      plan.questionnaireResponses as QuestionnaireResponses,
      analysis
    );

    // Log Claude interaction
    await prisma.claudeInteraction.create({
      data: {
        planId: plan.id,
        interactionType: 'generation',
        promptData: JSON.stringify({
          businessContext: plan.businessContext,
          responses: plan.questionnaireResponses,
          analysis: analysis
        }),
        claudeResponse: JSON.stringify(generatedContent),
        processingTimeMs: Date.now() - generationStartTime
      }
    });

    // Update plan with generated content
    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        generatedContent: JSON.stringify(generatedContent),
        claudeAnalysis: JSON.stringify(analysis),
        status: 'completed',
        completionPercentage: 100,
        completedAt: new Date(),
        planMetadata: JSON.stringify({
          totalProcessingTime: Date.now() - startTime,
          generatedAt: new Date().toISOString(),
          version: '1.0'
        })
      }
    });

    console.log('Plan generation completed successfully');

    // No email sending since there's no user authentication

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
      processingTime: Date.now() - startTime
    });

  } catch (error) {
    console.error('Error generating plan:', error);

    // Update plan status to failed
    try {
      const { id: planId } = await params;
      await prisma.plan.update({
        where: { id: planId },
        data: { 
          status: 'failed',
          planMetadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString()
          })
        }
      });
    } catch (updateError) {
      console.error('Error updating plan status:', updateError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}