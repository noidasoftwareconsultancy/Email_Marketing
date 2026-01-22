import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const email = userInfo.data.email;
    const name = userInfo.data.name;
    const avatar = userInfo.data.picture;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Check if user exists to preserve refresh token
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let finalTokens = tokens;
    if (existingUser?.googleTokens) {
      const oldTokens = existingUser.googleTokens as any;
      if (!tokens.refresh_token && oldTokens.refresh_token) {
        finalTokens = {
          ...tokens,
          refresh_token: oldTokens.refresh_token,
        };
      }
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        avatar: avatar || undefined,
        googleTokens: finalTokens as any,
      },
      create: {
        email,
        name: name || undefined,
        avatar: avatar || undefined,
        googleTokens: finalTokens as any,
      },
    });

    // In production, you'd set a session cookie here
    // For now, redirect to dashboard with user ID
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('connected', 'true');
    redirectUrl.searchParams.set('userId', user.id);

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent('Failed to connect Gmail')}`, request.url)
    );
  }
}
