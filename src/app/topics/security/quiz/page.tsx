'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaTrophy, FaStopwatch } from 'react-icons/fa';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const router = useRouter();

  const userProfile = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate",
  };

  const quizQuestions = [
    {
      id: 0,
      word: 'Tank',
      options: ['קָטָרוּם', 'מָגֵן', 'חָרֶב', 'טַנְק'],
      correctAnswer: 'טַנְק',
    },
    {
      id: 1,
      word: 'Battlefield',
      options: ['שְׂדֵה קְרָב', 'שׁוּק', 'חָזִית', 'חָרֶב'],
      correctAnswer: 'שְׂדֵה קְרָב',
    },
    {
      id: 2,
      word: 'Commander',
      options: ['שׁוֹפֵט', 'חוֹבֵל', 'מְפַקֵּד', 'רוֹפֵא'],
      correctAnswer: 'מְפַקֵּד',
    },
    {
      id: 3,
      word: 'Enemy',
      options: ['חָבֵר', 'אוֹיֵב', 'שׁוֹתֵף', 'קָטָרוּם'],
      correctAnswer: 'אוֹיֵב',
    },
    {
      id: 4,
      word: 'Victory',
      options: ['מִלְחָמָה', 'תַּבּוּסָה', 'נִצָּחוֹן', 'חָזִית'],
      correctAnswer: 'נִצָּחוֹן',
    },
    {
      id: 5,
      word: 'Shield',
      options: ['מָגֵן', 'חֶרֶב', 'טַנְק', 'חוֹמָה'],
      correctAnswer: 'מָגֵן',
    },
    {
      id: 6,
      word: 'Tactics',
      options: ['טַקְטִיקָה', 'אִסְטְרָטֶגִיָּה', 'עֵצָה', 'פָּרוּץ'],
      correctAnswer: 'טַקְטִיקָה',
    },
  ];

  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      setIsTimerActive(false);
      setShowResultModal(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setStreak(0);
    setTimer(0);
    setIsTimerActive(true);
    setShowResultModal(false);
  };

  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Profile Icon */}
      <div className="absolute top-4 right-4">
        <div 
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={toggleProfile}
        >
          <span className="text-2xl">👤</span>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="absolute top-20 right-4 bg-white p-6 shadow-2xl rounded-2xl w-80 z-50 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h2>
          <div className="space-y-3">
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Name:</strong> {userProfile.fullName}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Email:</strong> {userProfile.email}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Phone:</strong> {userProfile.phoneNumber}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Birth Date:</strong> {userProfile.birthDate}</p>
            <p className="flex items-center text-gray-700">
              <strong className="min-w-24">English Level:</strong>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm ml-2">
                {userProfile.englishLevel}
              </span>
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              className="w-full py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              onClick={() => alert('Logout Successful!')}
            >
              Logout
            </button>
            <button
              className="w-full py-2.5 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors"
              onClick={toggleProfile}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stats Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg mb-6 mt-16">
        <div className="flex justify-between items-center">
          <div className="text-center transform hover:scale-110 transition-all duration-300">
            <FaStar className="text-yellow-500 text-3xl mb-2" />
            <div className="text-3xl font-bold text-orange-500 mb-1">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center transform hover:scale-110 transition-all duration-300">
            <FaTrophy className="text-orange-500 text-3xl mb-2" />
            <div className="text-3xl font-bold text-orange-500 mb-1">{streak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
          <div className="text-center transform hover:scale-110 transition-all duration-300">
            <FaStopwatch className="text-blue-500 text-3xl mb-2" />
            <div className="text-3xl font-bold text-orange-500 mb-1">{formatTime(timer)}</div>
            <div className="text-sm text-gray-600">Time</div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Choose the correct translation for: <span className="font-bold text-2xl text-orange-600">{quizQuestions[currentQuestion].word}</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`p-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                selectedAnswer === option 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white transform scale-105' 
                : 'bg-white text-gray-700 border-2 border-orange-200 hover:border-orange-400 hover:scale-105'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-semibold
                   hover:from-orange-600 hover:to-red-600 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          Submit Answer
        </button>
      </main>

      {/* Results Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              Quiz Results! 🎉
            </h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-8">
              <p className="text-2xl text-gray-800 font-semibold">
                Your Score: <span className="text-orange-600">{score}</span> out of {quizQuestions.length}
              </p>
              <p className="text-gray-600 mt-2">Time taken: {formatTime(timer)}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={restartQuiz}
                className="w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
              >
                Try Again 🔄
              </button>
              <button
                onClick={() => router.push('/topics/security/post')}
                className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
              >
                Next Challenge 🎯
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute top-4 left-4">
        <Link 
          href="/" 
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span className="text-2xl">🏠</span>
        </Link>
      </div>
    </div>
  );
}