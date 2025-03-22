'use client';

import React, { useState, useEffect } from 'react';
import UserProfile from '../../../components/UserProfile';
import NavigationButton from './NavigationButton';
import KnownWordsModal from './KnownWordsModal';
import FlashcardDisplay from './FlashcardDisplay';
import PronunciationControl from './PronunciationControl';
import CompletionCard from './CompletionCard';
import ActionButton from './ActionButton';
import HomeNavigation from '../HomeNavigation';
import { Flashcard, UserProfileData } from './types';

interface FlashcardsProps {
  flashcards: Flashcard[];
  topic: string;
  userProfile: UserProfileData;
  onComplete?: () => void;
  nextPageUrl?: string;
}

const Flashcards: React.FC<FlashcardsProps> = ({ 
  flashcards, 
  topic,
  userProfile,
  onComplete,
  nextPageUrl = '/topics/security/quiz'
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [showKnownWordsModal, setShowKnownWordsModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow'>('normal');
  const [showProfile, setShowProfile] = useState(false);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(flashcards);

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
      
      // Remove the current card from filtered cards
      const updatedCards = filteredFlashcards.filter((card) => card.id !== currentId);
      setFilteredFlashcards(updatedCards);
      
      // Reset translation view
      setShowTranslation(false);
      
      // Adjust currentCard if needed
      if (updatedCards.length === 0) {
        // No cards left, nothing to do (completion card will show)
      } else if (currentCard >= updatedCards.length) {
        // If we removed the last card, go to the new last card
        setCurrentCard(updatedCards.length - 1);
      }
      // Otherwise keep the same currentCard index
    }
  };

  const unmarkAsKnown = (wordId: number) => {
    const wordToRemove = flashcards.find((card) => card.id === wordId);
    if (!wordToRemove) return;

    setKnownWords((prev) => prev.filter((id) => id !== wordId));
    setFilteredFlashcards((prev) => [...prev, wordToRemove].sort((a, b) => a.id - b.id));
  };

  const toggleProfile = () => setShowProfile(!showProfile);

  const handleCompletionRedirect = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const toggleTranslation = () => setShowTranslation(!showTranslation);
  
  useEffect(() => {
    // Initialize filtered flashcards when flashcards prop changes
    setFilteredFlashcards(flashcards);
    setCurrentCard(0);
    setKnownWords([]);
  }, [flashcards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Add Google Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* User Profile Component */}
      <UserProfile 
        userProfile={userProfile} 
        showProfile={showProfile} 
        toggleProfile={toggleProfile} 
      />

      {/* Home Navigation */}
      <HomeNavigation href="/topics" />

      <main className="max-w-4xl mx-auto mt-16">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {topic} Flashcards
        </h1>
        
        {filteredFlashcards.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Flashcard Display */}
            {filteredFlashcards[currentCard] && (
              <FlashcardDisplay 
                flashcard={filteredFlashcards[currentCard]} 
                showTranslation={showTranslation} 
                onToggle={toggleTranslation} 
              />
            )}

            <div className="flex justify-between items-center gap-6 mb-8">
              {/* Navigation Buttons */}
              <NavigationButton 
                onClick={handlePrevious} 
                disabled={currentCard === 0} 
                label="Previous" 
              />
              
              {/* Pronunciation Control */}
              <PronunciationControl 
                word={filteredFlashcards[currentCard]?.word} 
                playbackSpeed={playbackSpeed} 
                onPlaybackSpeedChange={(speed) => setPlaybackSpeed(speed)} 
                onPlay={() => {}} 
              />
              
              <NavigationButton 
                onClick={handleNext} 
                disabled={currentCard === filteredFlashcards.length - 1} 
                label="Next" 
              />
            </div>

            <div className="flex justify-center gap-4">
              {/* Action Buttons */}
              <ActionButton 
                onClick={markAsKnown} 
                label="I Know This Word ✨" 
                primary={true} 
              />
              
              <ActionButton 
                onClick={() => setShowKnownWordsModal(true)} 
                label="View Known Words 📚" 
                primary={false} 
              />
            </div>
          </div>
        ) : (
          <CompletionCard 
            onNext={handleCompletionRedirect} 
            buttonText="Start Quiz 🎯" 
          />
        )}
      </main>

      {/* Known Words Modal */}
      <KnownWordsModal 
        isOpen={showKnownWordsModal} 
        onClose={() => setShowKnownWordsModal(false)} 
        knownWords={knownWords} 
        flashcards={flashcards} 
        onUnmarkWord={unmarkAsKnown} 
      />
    </div>
  );
};

export default Flashcards;