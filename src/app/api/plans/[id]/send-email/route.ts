import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { pdfService } from '@/lib/pdf/pdfService';
import { Resend } from 'resend';

const prisma = new PrismaClient();

// Initialize Resend
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: planId } = await params;
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        error: 'Email address is required'
      }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({
        error: 'Email service not configured. Please set RESEND_API_KEY.'
      }, { status: 500 });
    }

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

    // Generate the PDF
    const pdfData = {
      generatedContent: plan.generatedContent as any,
      businessContext: plan.businessContext as any,
      user: {
        email: email,
        businessName: undefined
      },
      createdAt: plan.createdAt.toISOString()
    };

    console.log('Generating PDF for email...');
    const pdfBuffer = await pdfService.generateMarketingPlanPDF(pdfData);
    const filename = pdfService.getFileName(undefined, plan.createdAt.toISOString());

    // Create download URL for the email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/plan/${plan.id}`;

    // Send email with PDF attachment
    const result = await resend.emails.send({
      from: 'MarketingPlan.ai <noreply@marketingplan.beamxsolutions.com>',
      to: [email],
      subject: 'Your Marketing Plan is Ready!',
      html: generateEmailHTML(downloadUrl),
      text: generateEmailText(downloadUrl),
      attachments: [
        {
          filename: filename,
          content: pdfBuffer.toString('base64'),
        }
      ]
    });

    const success = !!result.data?.id;

    // Log the email action
    await prisma.claudeInteraction.create({
      data: {
        planId: plan.id,
        interactionType: 'email_send_with_pdf',
        promptData: {
          recipientEmail: email,
          success,
          pdfSize: pdfBuffer.length
        },
        claudeResponse: {
          success,
          emailId: result.data?.id,
          sentAt: new Date().toISOString()
        }
      }
    });

    if (success) {
      console.log('Email with PDF sent successfully:', result.data?.id);
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully with PDF attachment'
      });
    } else {
      return NextResponse.json({
        error: 'Failed to send email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending email:', error);

    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateEmailHTML(downloadUrl: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Marketing Plan is Ready!</title>
  </head>
  <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb, #9333ea); color: white; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">MarketingPlan.ai</h1>
              <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Powered by Claude AI</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px;">Your Marketing Plan is Ready!</h2>

              <p style="font-size: 16px; margin-bottom: 25px; color: #4b5563;">
                  Great news! Your comprehensive marketing plan is attached to this email as a PDF.
              </p>

              <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 6px;">
                  <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 18px;">What's Included:</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                      <li style="margin-bottom: 8px;">One-page visual marketing plan</li>
                      <li style="margin-bottom: 8px;">Comprehensive implementation guide</li>
                      <li style="margin-bottom: 8px;">Strategic insights and analysis</li>
                      <li style="margin-bottom: 8px;">Phased action plans (30/60/90 days)</li>
                      <li>KPIs and success metrics</li>
                  </ul>
              </div>

              <!-- View Online Button -->
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${downloadUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      View Plan Online
                  </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                  You can also download the PDF attached to this email.
              </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                  This plan was generated using Claude AI's advanced reasoning capabilities
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  &copy; 2025 MarketingPlan.ai by BeamX Solutions. All rights reserved.
              </p>
          </div>
      </div>
  </body>
  </html>
  `;
}

function generateEmailText(downloadUrl: string): string {
  return `
Your Marketing Plan is Ready!

Great news! Your comprehensive marketing plan is attached to this email as a PDF.

WHAT'S INCLUDED:
- One-page visual marketing plan
- Comprehensive implementation guide
- Strategic insights and analysis
- Phased action plans (30/60/90 days)
- KPIs and success metrics

View your plan online: ${downloadUrl}

This plan was generated using Claude AI's advanced reasoning capabilities.

© 2025 MarketingPlan.ai by BeamX Solutions
  `;
}
