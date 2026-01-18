import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: planId } = await params;

    const plan = await prisma.plan.findUnique({
      where: {
        id: planId
      },
      include: {
        claudeInteractions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Helper function to safely parse JSON strings
    const safeJsonParse = (jsonString: string | null) => {
      if (!jsonString) return null;
      try {
        return JSON.parse(jsonString);
      } catch {
        return null;
      }
    };

    // Parse String JSON fields back to objects for the client
    // businessContext and questionnaireResponses are Json type (already objects)
    // claudeAnalysis, generatedContent, planMetadata are String type (need parsing)
    const parsedPlan = {
      ...plan,
      claudeAnalysis: safeJsonParse(plan.claudeAnalysis),
      generatedContent: safeJsonParse(plan.generatedContent),
      planMetadata: safeJsonParse(plan.planMetadata),
    };

    return NextResponse.json(parsedPlan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id: planId } = await params;

    // Find the plan (no authentication required)
    const existingPlan = await prisma.plan.findUnique({
      where: {
        id: planId
      }
    });

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        businessContext: body.businessContext || existingPlan.businessContext,
        questionnaireResponses: body.questionnaireResponses || existingPlan.questionnaireResponses,
        claudeAnalysis: body.claudeAnalysis || existingPlan.claudeAnalysis,
        generatedContent: body.generatedContent || existingPlan.generatedContent,
        planMetadata: body.planMetadata || existingPlan.planMetadata,
        status: body.status || existingPlan.status,
        completionPercentage: body.completionPercentage || existingPlan.completionPercentage
      }
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.plan.delete({
      where: { id: planId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    );
  }
}