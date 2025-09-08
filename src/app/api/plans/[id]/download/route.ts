import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { pdfService } from '@/lib/pdf/pdfService';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planId = params.id;

    // Find the plan with generated content
    const plan = await prisma.plan.findFirst({
      where: {
        id: planId,
        user: { email: session.user.email }
      },
      include: {
        user: true
      }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (!plan.generatedContent || plan.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Plan not ready for download. Please ensure the plan generation is completed.' 
      }, { status: 400 });
    }

    // Prepare data for PDF generation
    const pdfData = {
      generatedContent: plan.generatedContent as any,
      businessContext: plan.businessContext as any,
      user: {
        email: plan.user.email,
        businessName: plan.user.businessName || undefined
      },
      createdAt: plan.createdAt.toISOString()
    };

    // Generate PDF
    console.log('Generating PDF for plan:', planId);
    const pdfBuffer = await pdfService.generateMarketingPlanPDF(pdfData);

    // Prepare response headers
    const filename = pdfService.getFileName(plan.user.businessName || undefined, plan.createdAt.toISOString());
    const headers = new Headers();
    headers.set('Content-Type', pdfService.getMimeType());
    headers.set('Content-Disposition', pdfService.getContentDisposition(filename));
    headers.set('Content-Length', pdfBuffer.length.toString());
    headers.set('Cache-Control', 'private, max-age=0');

    // Log the download
    await prisma.claudeInteraction.create({
      data: {
        planId: plan.id,
        interactionType: 'pdf_download',
        promptData: { filename, fileSize: pdfBuffer.length },
        claudeResponse: { success: true, downloadedAt: new Date().toISOString() }
      }
    });

    console.log('PDF generated successfully for plan:', planId, 'Size:', pdfBuffer.length, 'bytes');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: headers
    });

  } catch (error) {
    console.error('Error generating/downloading PDF:', error);
    
    // Log the error
    try {
      await prisma.claudeInteraction.create({
        data: {
          planId: params.id,
          interactionType: 'pdf_download_error',
          promptData: { error: error instanceof Error ? error.message : 'Unknown error' },
          claudeResponse: { success: false, errorAt: new Date().toISOString() }
        }
      });
    } catch (logError) {
      console.error('Failed to log PDF error:', logError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}