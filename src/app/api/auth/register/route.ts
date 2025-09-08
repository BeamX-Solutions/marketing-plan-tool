import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, businessName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // Create new user (in demo mode, we're storing password as-is - in production, hash it!)
    const user = await prisma.user.create({
      data: {
        email,
        businessName: businessName || null,
        marketingConsent: true,
        profileData: JSON.stringify({
          registrationDate: new Date().toISOString(),
          source: 'web_signup'
        })
      }
    });

    // In a real app, you'd hash the password and store it, or use NextAuth's built-in providers
    console.log(`Demo: User registered - ${email} with business: ${businessName || 'None'}`);

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}