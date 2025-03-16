import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a content moderation assistant. Analyze the following message and respond with "Yes" if the message contains toxic or abusive content, otherwise respond with "No".\nMessage: "${content}"`;
    
    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    if (message !== 'Yes' && message !== 'No') {
      return NextResponse.json(
        { message: 'Invalid response from Gemini API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Failed to check message' },
      { status: 500 }
    );
  }
}