'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Flashcards from '../../words/Refactored';
import { Flashcard, UserProfileData } from '../../words/types';

export default function FlashcardsPage() {
  const router = useRouter();

  // This could come from a database or API
  const innovationFlashcards: Flashcard[] = [
    { id: 0, word: 'Startup', translation: 'סְטָארְט־אַפ', example: 'Israel is known as the startup nation.', difficulty: 'easy' },
    { id: 1, word: 'Innovation', translation: 'חִדּוּשׁ', example: 'Israeli innovation has transformed many industries.', difficulty: 'easy' },
    { id: 2, word: 'Cybersecurity', translation: 'סִייבֶּר', example: 'Israeli companies lead the world in cybersecurity solutions.', difficulty: 'easy' },
    { id: 3, word: 'Artificial Intelligence', translation: 'בִּינָה מְלָאכוּתִית', example: 'Artificial intelligence is revolutionizing healthcare in Israel.', difficulty: 'easy' },
    { id: 4, word: 'High-tech', translation: 'הַיי-טֶק', example: 'Many Israelis work in the high-tech industry.', difficulty: 'easy' },
    { id: 5, word: 'Autonomous', translation: 'אוטוֹנוֹמִי', example: 'Israeli startups develop autonomous vehicle technology.', difficulty: 'easy' }
];


  const handleComplete = () => {
    router.push('/topics/innovation/quiz');
  };

  const userProfile = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate",
  };

  return (
    <Flashcards 
      flashcards={innovationFlashcards}
      topic="innovation" 
      userProfile={userProfile}
      onComplete={handleComplete}
      nextPageUrl="/topics/innovation/quiz"
    />
  );
}