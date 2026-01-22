import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    
    // Use upsert to create user if it doesn't exist
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: 'user@example.com', // Default email, will be updated when connecting SMTP
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: body.name,
        email: body.email,
        avatar: body.avatar,
        company: body.company,
        jobTitle: body.jobTitle,
        website: body.website,
      },
      create: {
        id: userId,
        name: body.name,
        email: body.email,
        avatar: body.avatar,
        company: body.company,
        jobTitle: body.jobTitle,
        website: body.website,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ 
      error: 'Failed to update user',
      details: error.message 
    }, { status: 500 });
  }
}
