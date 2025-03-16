import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST() {
  try {
    const prompt = 
      "Generate 3 open-ended questions as a single string separated by '||'. " +
      "Topics should be universal, engaging, and suitable for anonymous social messaging. " +
      "Example: 'What hobby have you recently started?||Which historical figure would you dine with?||What simple thing makes you happy?'";

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Ensure proper formatting
    const formattedText = text.replace(/\n/g, '').replace(/"/g, '').trim();
    
    return NextResponse.json({ 
      messages: formattedText 
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { message: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}