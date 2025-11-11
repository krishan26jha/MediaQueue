import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }
    
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // System prompt to guide Swasthi's behavior
    const systemPrompt = `You are Swasthi, a helpful and knowledgeable medical assistant chatbot for MediQueue, a hospital queue management system. You should:

1. Answer medical questions with accurate, general information while emphasizing that you're not a replacement for professional medical consultation
2. Help users navigate the MediQueue website and its features
3. Provide information about booking appointments, checking wait times, and using the patient portal
4. Be empathetic, professional, and supportive
5. Always recommend consulting with healthcare professionals for specific medical concerns
6. Keep responses concise but informative
7. Be friendly and use a warm, caring tone

MediQueue System Features:
- Online appointment booking
- Real-time wait time predictions using AI
- Patient portal with medical history
- Emergency services
- Staff dashboard for queue management
- Admin analytics and reporting
- Multiple departments (Emergency, Cardiology, Orthopedics, etc.)
- Prescription management
- Patient notifications

If asked about specific medical conditions, provide general information but always recommend consulting with a healthcare professional for personalized advice.`;

    const prompt = `${systemPrompt}\n\nUser question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ 
      error: 'Sorry, I encountered an error. Please try again later.' 
    }, { status: 500 });
  }
}
