import { NextResponse, NextRequest } from 'next/server';  // Use NextRequest instead of NextApiRequest
import { GoogleGenerativeAI } from '@google/generative-ai';

// Specify runtime for serverless environments
export const runtime = 'edge';

const apiKey = process.env.GEMINI_API_KEY;

// Check if API key is available
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize models
const models = genAI.getGenerativeModel({ model: 'gemini-pro' });

// POST function to handle requests
export async function POST(req: NextRequest) {
  try {
    // Define the prompt
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Generate content using the correct method from the client instance
    const response = await models.generateContent(prompt);

    // Extract the output from the response
    const output = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      throw new Error('Failed to retrieve generated text from response.');
    }

    // Return the output in the response
    return NextResponse.json({ output });
  } catch (error) {
    if (error instanceof Error) {
      // Google Generative AI specific error handling
      const { message } = error;
      return NextResponse.json({ message }, { status: 500 });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
