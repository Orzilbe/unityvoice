import { Flashcard, FlashcardResponse } from '../../../../types/flashcard';

export async function generateFlashcards(
  topic: string, 
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  count: number = 7
): Promise<Flashcard[]> {
  try {
    const response = await fetch('/api/generate-flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        difficulty,
        count,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch flashcards');
    }

    const data: FlashcardResponse = await response.json();
    
    if (!data.words || !Array.isArray(data.words)) {
      throw new Error('Invalid response format');
    }

    return data.words;
  } catch (error) {
    console.error('Error in flashcard service:', error);
    throw error;
  }
}

// Fallback function for testing or when API is unavailable
export function getDefaultFlashcards(
  topic: string, 
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): Flashcard[] {
  // Mapping of topics to default flashcards
  const defaultSets: Record<string, Flashcard[]> = {
    'security': [
      { id: 1, word: 'Password', translation: 'סיסמה', example: 'Make sure to use a strong password for all your accounts.', difficulty: 'beginner' },
      // Add more security-related words
    ],
    // Add more topic-specific default sets
    'general': [
      { id: 1, word: 'Example', translation: 'דוגמה', example: 'This is an example word.', difficulty: 'beginner' },
      // Add more general words
    ]
  };

  // Return topic-specific flashcards or fall back to general ones
  return defaultSets[topic] || defaultSets['general'];
}