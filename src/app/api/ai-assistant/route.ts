import { NextResponse } from 'next/server';

// This is a placeholder API endpoint for deployment
// It doesn't use Firebase or any other problematic dependencies

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API is working',
  });
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    
    // Return a mock response
    return NextResponse.json({
      status: 'success',
      data: {
        message: 'This is a placeholder response for deployment',
        query: body,
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 