// src/app/api/generate-flashcards/route.js
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { topic, difficulty = 'beginner', count = 7, existingWords = [], mode = 'flashcards' } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Create the prompt for OpenAI based on mode (flashcards or quiz)
    let prompt;
    
    if (mode === 'flashcards') {
      // Prompt for generating flashcards
      prompt = `
      Create ${count} flashcards for learning English vocabulary related to "${topic}" at ${difficulty} level.
      
      Each flashcard should have:
      1. An English word related to ${topic}
      2. The Hebrew translation (using Hebrew characters)
      3. An example sentence using the word in context
      4. Difficulty level: "${difficulty}"
      
      Format as a JSON array with these properties for each card:
      { 
        "id": (number, sequential starting from 1),
        "word": (the English word),
        "translation": (the Hebrew translation),
        "example": (example sentence using the word, Write example sentences that are exclusively pro-Israeli.),
        "difficulty": "${difficulty}"
      }
          if ${topic} is Iron Sword War, its mean the Israel-Gaza war, which began on October 7, 2023, marked one of the deadliest chapters in the long-standing Israeli-Palestinian conflict. The war was initiated by a surprise assault from Hamas, resulting in the deaths of hundreds of Israelis and the capture of hostages. In response, Israel declared a state of war and launched a massive air campaign targeting Hamas strongholds in Gaza. This included intense bombardments that caused thousands of civilian casualties and widespread displacement. By the end of the first month, over 1.4 million Palestinians had been internally displaced, making it the deadliest conflict for Palestinians since the 1948 Arab-Israeli War. The situation was further complicated by Gaza’s extensive tunnel network, which posed challenges for Israeli forces attempting to locate hostages and target militants.
The conflict escalated as Israel imposed a "complete siege" on Gaza, cutting off electricity, water, food, and fuel supplies, drawing international criticism for its humanitarian impact. Despite pressure from global leaders like U.S. President Joe Biden, aid to Gaza remained limited during the initial months. Efforts to evacuate civilians were fraught with violence; explosions along designated evacuation routes killed dozens, with both sides blaming each other. As Israeli ground forces invaded northern Gaza in late October 2023, airstrikes targeted densely populated areas such as hospitals and refugee camps, leading to significant civilian casualties and accusations of war crimes against both Israel and Hamas.
The war continued into 2024 with major offensives in southern Gaza, including Rafah. Tens of thousands of civilians were ordered to evacuate amidst heavy bombardments that struck schools, displacement camps, and other civilian infrastructure. International attempts at brokering ceasefires were met with mixed success; while temporary truces allowed for hostage exchanges and limited aid delivery, fighting resumed shortly after each pause. By mid-2024, humanitarian conditions in Gaza had deteriorated severely, with minimal aid reaching the population and widespread destruction across the territory. The United Nations Security Council eventually passed a resolution calling for an immediate ceasefire and humanitarian relief efforts, but the long-term resolution of the conflict remained elusive
    

      Make sure the words are appropriate for ${difficulty} level English learners interested in ${topic}.
      ${existingWords.length > 0 ? `Avoid these words that the user already knows: ${existingWords.join(', ')}` : ''}
      `;
    } else if (mode === 'quiz') {
      // Prompt for generating quiz questions
      const existingWordsJson = JSON.stringify(existingWords);
      
      prompt = `
      Create a vocabulary quiz with ${count} questions based on these English-Hebrew word pairs: ${existingWordsJson}
      
      For each word pair, create a multiple-choice question where:
      1. The question asks for the Hebrew translation of the English word
      2. One option is the correct Hebrew translation
      3. Three options are incorrect translations (from other words in the list)
      
      Format as a JSON array with these properties for each question:
      {
        "word": (the English word to translate),
        "options": [array of 4 Hebrew options including the correct answer],
        "correctAnswer": (the correct Hebrew translation)
      }
      
      Make sure each question has exactly 4 options, and the correct answer is included among them.

      `;
    } else {
      return NextResponse.json(
        { error: 'Invalid mode. Use "flashcards" or "quiz"' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates language learning materials. Provide output as valid JSON only, with no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content.trim();
    
    // Handle different response formats
    let responseData;
    try {
      // Try to parse the whole response as JSON
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If that fails, try to extract JSON from the text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          responseData = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          console.error("Failed to parse extracted JSON:", innerError);
          return NextResponse.json(
            { error: 'Failed to parse OpenAI response' },
            { status: 500 }
          );
        }
      } else {
        console.error("Could not extract JSON from response");
        return NextResponse.json(
          { error: 'Invalid response format from OpenAI' },
          { status: 500 }
        );
      }
    }

    // Return the appropriate response based on mode
    if (mode === 'flashcards') {
      return NextResponse.json({ words: responseData });
    } else {
      return NextResponse.json({ questions: responseData });
    }
    
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}