'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Flashcards from '../../words/Refactored';

export default function SecurityFlashcardsPage() {
  const router = useRouter();

  // מילים קבועות (במקום API)
  const securityFlashcards = [
    { id: 0, word: 'Tank', translation: 'טַנְק', example: 'The tank rolled across the battlefield.', difficulty: 'easy' },
    { id: 1, word: 'Battlefield', translation: 'שְׂדֵה קְרָב', example: 'The battlefield was covered with smoke.', difficulty: 'easy' },
    { id: 2, word: 'Commander', translation: 'מְפַקֵּד', example: 'The commander gave clear instructions to the soldiers.', difficulty: 'easy' },
    { id: 3, word: 'Enemy', translation: 'אוֹיֵב', example: 'The enemy launched a surprise attack.', difficulty: 'easy' },
    { id: 4, word: 'Victory', translation: 'נִצָּחוֹן', example: 'The soldiers celebrated their victory with pride.', difficulty: 'easy' },
    { id: 5, word: 'Shield', translation: 'מָגֵן', example: 'The shield was strong enough to block the attack.', difficulty: 'easy' },
    { id: 6, word: 'Tactics', translation: 'טַקְטִיקָה', example: 'The commander used clever tactics to outsmart the enemy.', difficulty: 'easy' }
  ];

  // פרטי המשתמש
  const userProfile = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate",
  };

  // פונקציית השלמה
  const handleComplete = () => {
    router.push('/topics/security/quiz');
  };

  return (
    <Flashcards 
      flashcards={securityFlashcards}
      topic="Security" 
      userProfile={userProfile}
      onComplete={handleComplete}
      nextPageUrl="/topics/security/quiz"
    />
  );
}