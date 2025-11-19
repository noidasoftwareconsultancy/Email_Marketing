import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { testSMTPConnection } from '@/lib/smtp-mailer';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();
    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Test the SMTP connection
    const isValid = await testSMTPConnection(email, password);
    
    if (!isValid) {
      return NextResponse.json({ 
        error: 'Failed to connect to Gmail',
        hint: 'Make sure you are using an App Password if 2-Step Verification is enabled. Generate one at: https://myaccount.google.com/apppasswords'
      }, { status: 400 });
    }

    // Store credentials (in production, encrypt the password!)
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email: email,
        googleTokens: {
          type: 'smtp',
          email: email,
          password: password, // TODO: Encrypt in production
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Gmail connected successfully via SMTP',
      email: email 
    });
  } catch (error: any) {
    console.error('Connect SMTP error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect Gmail',
      details: error.message 
    }, { status: 500 });
  }
}
