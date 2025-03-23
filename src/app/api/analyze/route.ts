import { NextResponse } from 'next/server';

// Define the design analysis prompt for GPT-4o
const DESIGN_ANALYSIS_PROMPT = `
You are a UI/UX design expert tasked with analyzing design screenshots. Provide constructive feedback on the following aspects:

- Visual Hierarchy: Assess how well the design guides the user's attention
- Color Usage: Evaluate the color scheme, contrast, and accessibility
- Typography: Review font choices, readability, and hierarchy
- Layout & Spacing: Analyze the composition, alignment, and use of whitespace
- Usability & Accessibility: Identify potential usability issues or accessibility concerns
- Mobile Responsiveness: If applicable, assess how the design might work on smaller screens

Format your response as clear, actionable feedback points. Include both positive aspects and thoughtful suggestions for improvement.
`;

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // Get OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing in server configuration' },
        { status: 500 }
      );
    }
    
    // Create request for GPT-4o API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: DESIGN_ANALYSIS_PROMPT,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this design and provide constructive feedback.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Error calling OpenAI API', details: errorData },
        { status: openaiResponse.status }
      );
    }
    
    const data = await openaiResponse.json();
    const feedback = data.choices[0].message.content;
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error analyzing design:', error);
    return NextResponse.json(
      { error: 'Failed to analyze design' },
      { status: 500 }
    );
  }
}