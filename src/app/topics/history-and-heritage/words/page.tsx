'use client';

import React, { useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Flashcard {
  id: number;
  word: string;
  translation: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function Flashcards() {
    const [currentCard, setCurrentCard] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [showKnownWordsModal, setShowKnownWordsModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow'>('normal');
  const [showProfile, setShowProfile] = useState(false);

  const flashcards: Flashcard[] = [
    { id: 0, word: 'Ancient', translation: 'עַתִיק', example: "The ancient ruins were fascinating to explore.", difficulty: 'easy' },
    { id: 1, word: 'Historical', translation: 'הִיסטוֹרִי', example: "The museum has a fascinating collection of historical artifacts.", difficulty: 'medium' },
    { id: 2, word: 'Monument', translation: 'אַנְדַּרְטָה', example: "The monument honors fallen soldiers.", difficulty: 'hard' },
    { id: 3, word: 'Preserve', translation: 'לְשַׁמֵּר', example: "We need to preserve our traditions.", difficulty: 'medium' },
    { id: 4, word: 'Tradition', translation: 'מָסוֹרֶת', example: "Family tradition is important.", difficulty: 'easy' }
  ];

  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(flashcards);

  const router = useRouter();

  const userProfile = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate",
  };

  const handleNext = () => {
    if (currentCard < filteredFlashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setShowTranslation(false);
    }
  };

  const markAsKnown = () => {
    const currentId = filteredFlashcards[currentCard]?.id;
    if (currentId !== undefined && !knownWords.includes(currentId)) {
      setKnownWords((prev) => [...prev, currentId]);
      setFilteredFlashcards((prev) => prev.filter((card) => card.id !== currentId));
      setShowTranslation(false);
    }
  };

  const unmarkAsKnown = (wordId: number) => {
    const wordToRemove = flashcards.find((card) => card.id === wordId);
    if (!wordToRemove) return;

    setKnownWords((prev) => prev.filter((id) => id !== wordId));
    setFilteredFlashcards((prev) => [...prev, wordToRemove].sort((a, b) => a.id - b.id));
  };

  const handlePlayPronunciation = () => {
    const word = filteredFlashcards[currentCard]?.word;
    if (!word) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = playbackSpeed === 'slow' ? 0.7 : 1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Add Google Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      ...
    </div>
  );
}
