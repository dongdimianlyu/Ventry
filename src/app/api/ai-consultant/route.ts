import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/firebaseConfig.js';
import { checkAndUpdateGenerationLimit } from '@/middleware/userLimits';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const user = auth.currentUser;
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if the user has remaining generations
    const limitCheck = await checkAndUpdateGenerationLimit(user.uid);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { 
          error: limitCheck.message,
          remainingGenerations: 0,
          limitReached: true 
        },
        { status: 403 }
      );
    }

    const { messages, businessContext, businessLocation } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Valid messages array is required' },
        { status: 400 }
      );
    }

    // Create system message based on business context and location
    const locationContext = businessLocation ? ` The business is located in ${businessLocation}.` : '';
    
    const systemMessage = {
      role: "system",
      content: `You are an expert business strategist with deep expertise in business operations, marketing, finance, and growth strategy. ${
        businessContext ? `Business context: ${businessContext}.` : ''
      }${locationContext} 
      
      Guidelines for your responses:
      1. Be concise and actionable - limit responses to 200 words maximum
      2. Prioritize practical advice over theory
      3. Provide specific, implementable action steps
      4. When appropriate, ask 1-2 clarifying questions to better understand the situation
      5. Consider the business context in all recommendations
      ${businessLocation ? `6. Reference relevant market conditions, regulations, or cultural factors specific to ${businessLocation}` : ''}
      
      Your goal is to provide high-value strategic advice that the business owner can implement immediately.`
    };

    // Format messages for OpenAI API
    const formattedMessages = [systemMessage, ...messages];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500, // Limit token count for more concise responses
    });

    // Return the AI response with remaining count info
    return NextResponse.json({
      message: completion.choices[0].message,
      remainingGenerations: limitCheck.remaining
    });
  } catch (error) {
    console.error('Error in AI consultant:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 