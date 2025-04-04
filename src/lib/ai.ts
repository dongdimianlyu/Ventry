import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export type AIRequestType = 'business-plan' | 'consulting';

export async function generateAIResponse(prompt: string, type: AIRequestType) {
  try {
    const systemPrompt = type === 'business-plan' 
      ? 'You are an expert business plan generator. Create detailed, actionable business plans based on user input.'
      : 'You are an expert business consultant. Provide strategic advice and insights based on user input.';

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
} 