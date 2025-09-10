import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessContext, questionnaireResponses } = body;

    // Create the plan without user authentication
    const plan = await prisma.plan.create({
      data: {
        userId: null, // No user required
        businessContext: JSON.stringify(businessContext || {}),
        questionnaireResponses: JSON.stringify(questionnaireResponses || {}),
        status: 'in_progress',
        completionPercentage: 0
      }
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}