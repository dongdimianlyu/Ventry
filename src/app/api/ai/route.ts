import { NextResponse } from 'next/server';
import { generateAIResponse, AIRequestType } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, type } = body;

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and type' },
        { status: 400 }
      );
    }

    if (!['business-plan', 'consulting'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

    const response = await generateAIResponse(prompt, type as AIRequestType);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
} 