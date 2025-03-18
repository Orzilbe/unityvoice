// app/api/generate-words/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { topic, count = 5 } = await request.json();

    const prompt = `Generate ${count} military and warfare related words (like weapons, ranks, combat terms) in English with their Hebrew translations and example sentences. For each word provide:
    1. English word
    2. Hebrew translation with nikud
    3. Example sentence in English
    Format as JSON array with fields: word, translation, example`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '[]');
    const words = result.map((item, index) => ({
      ...item,
      id: index,
      difficulty: 'easy'
    }));

    return NextResponse.json(words);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Failed to generate words' }, { status: 500 });
  }
}