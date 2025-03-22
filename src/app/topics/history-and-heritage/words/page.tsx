'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Flashcards from '../../words/Refactored';
import { Flashcard, UserProfileData } from '../../words/types';

export default function FlashcardsPage() {
  const router = useRouter();

  // This could come from a database or API
  const flashcards: Flashcard[] = [
    { id: 0, word: 'Ancient', translation: 'עַתִיק', example: "The ancient ruins were fascinating to explore.", difficulty: 'easy' },
    { id: 1, word: 'Historical', translation: 'הִיסטוֹרִי', example: "The museum has a fascinating collection of historical artifacts.", difficulty: 'medium' },
    { id: 2, word: 'Monument', translation: 'אַנְדַּרְטָה', example: "The monument honors fallen soldiers.", difficulty: 'hard' },
    { id: 3, word: 'Preserve', translation: 'לְשַׁמֵּר', example: "We need to preserve our traditions.", difficulty: 'medium' },
    { id: 4, word: 'Tradition', translation: 'מָסוֹרֶת', example: "Family tradition is important.", difficulty: 'easy' }
  ];


  const handleComplete = () => {
    router.push('/topics/history-and-heritage/quiz');
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
      flashcards={flashcards}  // השתמש בשם המשתנה הנכון שהגדרת קודם
      topic="History and Heritage" 
      userProfile={userProfile}
      onComplete={handleComplete}
      nextPageUrl="/topics/history-and-heritage/quiz"
    />
  );
}