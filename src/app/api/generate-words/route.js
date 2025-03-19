// app/api/generate-words/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json().catch(() => ({}));
    
    const topic = body.topic;
    const count = body.count || 5;
    
    // Validate required parameters
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      );
    }
    
    // Ensure count is a reasonable number
    const wordCount = Math.min(Math.max(1, count), 20);
    
    const prompt = `Generate ${wordCount} ${topic} in English with their Hebrew translations and example sentences. For each word provide:
    1. English word
    2. Hebrew translation with nikud
    3. Example sentence in English
    Format as JSON array with fields: word, translation, example`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" } // Ensure JSON response
    });

    // Safe JSON parsing with better error handling
    let result = [];
    try {
      const content = completion.choices[0]?.message?.content || '{"words":[]}';
      const parsedResponse = JSON.parse(content);
      result = Array.isArray(parsedResponse) ? parsedResponse : (parsedResponse.words || []);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse generated content' }, 
        { status: 500 }
      );
    }

    // Map the results to include ID and difficulty
    const words = result.map((item, index) => ({
      ...item,
      id: index,
      difficulty: 'easy'
    }));

    return NextResponse.json(words);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate words', message: error.message }, 
      { status: 500 }
    );
  }
}