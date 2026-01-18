import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.error('Request Body:', body);
    const { businessContext, questionnaireResponses } = body;

    // Create the plan without user authentication
    console.log('Creating plan with UUID:', uuid);
    console.log('businessContext', businessContext);
    console.log('questionnaireResponses', questionnaireResponses);
    const plan = await prisma.plan.create({
      data: {
        id: uuidv4(),
        userId: uuidv4(), // No user required
        businessContext: businessContext || {},
        questionnaireResponses: questionnaireResponses || {},
        status: 'in_progress',
        completionPercentage: 0
      }
    });

     console.error('prisma Body:', plan);

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}