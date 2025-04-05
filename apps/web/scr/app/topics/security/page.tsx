'use client';

import Flashcards from '../tasks/flashcard/Flashcards';

export default function SecurityFlashcardsPage() {
  return (
    <Flashcards 
      topic="Iron Sword War" 
      pageTitle="Security Vocabulary" 
      initialDifficulty="beginner" 
    />
  );
}