import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'black'; // black, white, favicon-black, favicon-white
    
    // Map type to file name
    const fileMap: Record<string, string> = {
      'black': 'Logo Black.png',
      'white': 'Logo White.svg',
      'favicon-black': 'Fav Icon Black (1).png',
      'favicon-white': 'Fav Icon White.png',
    };
    
    const fileName = fileMap[type];
    if (!fileName) {
      return NextResponse.json({ error: 'Invalid logo type' }, { status: 400 });
    }
    
    // Read file from public directory
    const filePath = join(process.cwd(), 'public', fileName);
    const fileBuffer = await readFile(filePath);
    
    // Determine content type
    const contentType = fileName.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    
    // Return with proper headers for email clients
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Logo serving error:', error);
    return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
  }
}
