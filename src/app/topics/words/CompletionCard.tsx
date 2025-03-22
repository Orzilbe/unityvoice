'use client';

import React from 'react';

interface CompletionCardProps {
  onNext: () => void;
  buttonText?: string;
}

const CompletionCard: React.FC<CompletionCardProps> = ({
  onNext,
  buttonText = 'Start Quiz 🎯'
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Fantastic Job! 🎉</h2>
      <p className="text-gray-700 text-lg mb-8">You've mastered all the flashcards!</p>
      <button
        onClick={onNext}
        className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg text-lg"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CompletionCard;