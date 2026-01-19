import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { emailService } from '@/lib/email/emailService';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: planId } = await params;
    const body = await request.json();
    const { action, recipientEmail, message, senderEmail } = body;

    // Find the plan
    const plan = await prisma.plan.findUnique({
      where: {
        id: planId
      }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (!plan.generatedContent || plan.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Plan not ready for email. Please ensure the plan generation is completed.' 
      }, { status: 400 });
    }

    // Create download URL (this should be your actual domain in production)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/plan/${plan.id}`;

    // Get user email from request body or use default
    const userEmail = senderEmail || recipientEmail || 'guest@marketingplan.com';

    // Prepare email data
    const emailData = {
      businessName: undefined,
      userEmail: userEmail,
      planId: plan.id,
      generatedContent: plan.generatedContent as any,
      businessContext: plan.businessContext as any,
      createdAt: plan.createdAt.toISOString(),
      downloadUrl: downloadUrl
    };

    let success = false;
    let emailType = '';

    switch (action) {
      case 'send_completion':
        // Send completion email to the specified email
        if (!recipientEmail) {
          return NextResponse.json({
            error: 'Recipient email is required'
          }, { status: 400 });
        }
        emailData.userEmail = recipientEmail;
        success = await emailService.sendPlanCompletionEmail(emailData);
        emailType = 'completion';
        break;

      case 'share':
        // Share plan with another email address
        if (!recipientEmail) {
          return NextResponse.json({
            error: 'Recipient email is required for sharing'
          }, { status: 400 });
        }

        const senderName = senderEmail ? senderEmail.split('@')[0] : 'A colleague';
        success = await emailService.sendPlanShareEmail(
          emailData,
          recipientEmail,
          senderName,
          message
        );
        emailType = 'share';
        break;

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use "send_completion" or "share"' 
        }, { status: 400 });
    }

    // Log the email action
    await prisma.claudeInteraction.create({
      data: {
        planId: plan.id,
        interactionType: `email_${emailType}`,
        promptData: {
          action,
          recipientEmail: recipientEmail,
          success,
          message: message || null
        },
        claudeResponse: {
          success,
          sentAt: new Date().toISOString(),
          emailType
        }
      }
    });

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Email ${emailType === 'completion' ? 'sent' : 'shared'} successfully` 
      });
    } else {
      return NextResponse.json({ 
        error: `Failed to send ${emailType} email` 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log the error
    try {
      await prisma.claudeInteraction.create({
        data: {
          planId: planId,
          interactionType: 'email_error',
          promptData: {
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          claudeResponse: {
            success: false,
            errorAt: new Date().toISOString()
          }
        }
      });
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}