import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/firebaseConfig';
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

    const { businessType, goals, timeframe, location, planType } = await request.json();

    // Validate input
    if (!businessType || !goals) {
      return NextResponse.json(
        { error: 'Business type and goals are required' },
        { status: 400 }
      );
    }

    // Create different prompts based on plan type
    const locationContext = location ? ` located in ${location}` : '';
    let prompt = '';
    
    if (planType === 'daily') {
      // Day-to-day focused prompt
      prompt = `Generate a detailed day-by-day action plan for a ${businessType} business${locationContext} with the following goals: ${goals}.

      Format the plan with a clear focus on daily implementation tasks for a ${timeframe || 'monthly'} period:
      
      # ${businessType.toUpperCase()} BUSINESS: DAILY ACTION PLAN
      
      ## EXECUTIVE SUMMARY
      (Keep this to 3-4 sentences maximum)
      - Brief Overview
      - Core Goals
      
      ## GOAL ANALYSIS
      - Rephrased Goal: [Provide a concise 1-2 sentence rephrasing of the business's core goal]
      - Difficulty Rating: [Rate the difficulty of achieving the goal on a scale of 1-10, where 1 is very easy and 10 is extremely challenging]
      - Estimated Timeline: [Provide an estimate in months of how long it will take to achieve the stated goals]
      - Success Factors: [2-3 key factors that will determine success]
      
      ## DAY-BY-DAY IMPLEMENTATION PLAN
      Present a comprehensive, detailed day-by-day implementation plan in the following structured JSON format embedded in markdown code blocks:
      
      \`\`\`json
      {
        "goalSummary": {
          "rephrased": "The concise rephrased business goal",
          "difficulty": 7,
          "timeEstimate": 6,
          "timeUnit": "months"
        },
        "dailyTasks": [
          {
            "day": 1,
            "title": "Specific task title",
            "description": "Detailed 1-2 sentence description with specific, personalized actions relevant to this specific ${businessType} business. Make this highly detailed, practical and immediately actionable.",
            "category": "Category (Marketing/Finance/Operations/Product)",
            "priority": "High/Medium/Low"
          },
          {
            "day": 2,
            "title": "Specific task title",
            "description": "Detailed 1-2 sentence description with specific, personalized actions relevant to this specific ${businessType} business. Make this highly detailed, practical and immediately actionable.",
            "category": "Category (Marketing/Finance/Operations/Product)",
            "priority": "High/Medium/Low"
          }
        ]
      }
      \`\`\`
      
      Make sure to include tasks for EVERY DAY in the ${timeframe || 'monthly'} period (30 days for monthly, 90 days for quarterly, etc.).
      
      ## WEEKLY THEMES
      ### Week 1: [Theme/Focus]
      - Weekly Objectives (2-3 bullet points)
      
      ### Week 2: [Theme/Focus]
      - Weekly Objectives (2-3 bullet points)
      
      ## RESOURCE REQUIREMENTS
      - Financial Resources (2-3 bullet points)
      - Human Resources (2-3 bullet points)
      
      ## METRICS & TRACKING
      - Key Performance Indicators (3-4 bullet points)
      
      The plan should be highly specific, actionable, and practical, with a clear emphasis on day-to-day tasks and implementation steps. EVERY day must have at least one task assigned, with a clear focus on practical implementation rather than high-level strategy.
      
      Task descriptions must be detailed (1-2 sentences), personalized to this specific ${businessType} business, and include concrete actions that are immediately implementable. Avoid generic descriptions and focus on specific, realistic actions tailored to the business type and goals.
      
      CRITICAL: You MUST include the DAY-BY-DAY IMPLEMENTATION PLAN section with properly formatted JSON containing tasks for every single day of the ${timeframe || 'monthly'} period, and include the goalSummary object with the rephrase, difficulty rating, and time estimate.`;
    } else {
      // Strategic high-level plan (default)
      prompt = `Generate a concise, professional-grade ${timeframe || 'monthly'} strategic business plan for a ${businessType} business${locationContext} with the following goals: ${goals}.

      Format the plan as a clear professional document with the following structure:
      
      # ${businessType.toUpperCase()} BUSINESS: STRATEGIC PLAN
      
      ## EXECUTIVE SUMMARY
      - Brief Organization Overview (1-2 sentences)
      - Mission Statement (1 sentence)
      - Key Strategic Goals (3-4 bullet points)
      
      ## GOAL ANALYSIS
      - Rephrased Goal: [Provide a concise 1-2 sentence rephrasing of the business's core goal]
      - Difficulty Rating: [Rate the difficulty of achieving the goal on a scale of 1-10, where 1 is very easy and 10 is extremely challenging]
      - Estimated Timeline: [Provide an estimate in months of how long it will take to achieve the stated goals]
      - Success Factors: [2-3 key factors that will determine success]
      
      ## MARKET ANALYSIS
      - Target Market (2-3 bullet points)
      - Competitive Analysis (2-3 bullet points)
      - SWOT Summary (2 points each)
      ${location ? `- Regional Market Considerations for ${location} (2-3 bullet points)` : ''}
      
      ## STRATEGIC OBJECTIVES
      - Short-term Objectives (3-4 bullet points)
      - Key Performance Indicators (3-4 bullet points)
      
      ## ACTION PLAN (WEEK BY WEEK)
      ### Week 1: [Theme/Focus]
      - Priority Tasks (3-4 bullet points)
      
      ### Week 2: [Theme/Focus]
      - Priority Tasks (3-4 bullet points)
      
      ### Week 3: [Theme/Focus]
      - Priority Tasks (3-4 bullet points)
      
      ### Week 4: [Theme/Focus]
      - Priority Tasks (3-4 bullet points)
      
      ## RESOURCE ALLOCATION
      - Financial Resources (2-3 bullet points)
      - Human Resources (2-3 bullet points)
      
      ## RISK MANAGEMENT
      - Identified Risks (2-3 bullet points)
      - Mitigation Strategies (2-3 bullet points)
      
      Format the entire plan in clean, professional markdown with appropriate headings, subheadings, and bullet points. The tone should be authoritative, strategic, and forward-thinking.
      
      For the timeline functionality, also include daily tasks in a hidden JSON format:
      
      \`\`\`json
      {
        "goalSummary": {
          "rephrased": "The concise rephrased business goal",
          "difficulty": 7,
          "timeEstimate": 6,
          "timeUnit": "months"
        },
        "dailyTasks": [
          {
            "day": 1,
            "title": "Strategic task for day 1",
            "description": "Detailed 1-2 sentence description with specific, personalized actions relevant to this specific ${businessType} business. Make this highly detailed, practical and immediately actionable.",
            "category": "Category (Marketing/Finance/Operations/Product)",
            "priority": "High/Medium/Low"
          }
        ]
      }
      \`\`\`
      
      Task descriptions must be detailed (1-2 sentences), personalized to this specific ${businessType} business, and include concrete actions that are immediately implementable. Avoid generic descriptions and focus on specific, realistic actions tailored to the business type and goals. Include the goalSummary object with the rephrased goal, difficulty rating, and time estimate.`;
    }

    // Determine system message based on plan type
    let systemMessage = "";
    if (planType === 'daily') {
      systemMessage = "You are an expert business operations manager and implementation specialist. Create concise daily action plans that are practical and immediately actionable. Focus on clear, specific tasks with measurable outcomes. Task descriptions should be personalized to the business, highly detailed (1-2 sentences), and include concrete actions that someone could implement immediately. Use simple language and formatting that is easy to read. Make honest assessments of goal difficulty and realistic timelines.";
    } else {
      systemMessage = "You are an expert business strategist. Create focused, concise strategic plans that provide clear direction without overwhelming detail. Task descriptions should be personalized to the business, highly detailed (1-2 sentences), and include concrete actions that someone could implement immediately. Use professional formatting with proper spacing between sections, clear font hierarchy, and minimal jargon. Make honest assessments of goal difficulty and realistic timelines.";
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Return the generated plan with remaining count info
    return NextResponse.json({
      plan: completion.choices[0].message.content,
      planType: planType,
      remainingGenerations: limitCheck.remaining
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
} 