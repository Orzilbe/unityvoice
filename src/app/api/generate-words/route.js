// src/app/api/generate-words/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json().catch(() => ({}));
    
    const topic = body.topic;
    const count = body.count || 5;
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      );
    }
    
    // מגביל את מספר המילים בין 5 ל-8
    const wordCount = Math.min(Math.max(5, count), 8);
    
    const prompt = `Generate ${wordCount} different ${topic} vocabulary words in English with their Hebrew translations and example sentences. For each word provide:
    1. English word
    2. Hebrew translation with nikud (vowels)
    3. Example sentence in English using the word in context

    Use a variety of words related to ${topic} that would be useful for learning.
    
    Format your response as a valid JSON object with this EXACT structure:
    {
      "words": [
        {
          "word": "English word",
          "translation": "Hebrew translation with nikud",
          "example": "Example sentence in English."
        },
        ...more words...
      ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    let result = [];
    try {
      const content = completion.choices[0]?.message?.content || '{"words":[]}';
      console.log("OpenAI response:", content);
      
      const parsedResponse = JSON.parse(content);
      
      if (!parsedResponse.words || !Array.isArray(parsedResponse.words)) {
        throw new Error('Invalid response format from API');
      }
      
      result = parsedResponse.words;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse generated content' }, 
        { status: 500 }
      );
    }

    const words = result.map((item, index) => ({
      id: index,
      word: item.word,
      translation: item.translation,
      example: item.example,
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