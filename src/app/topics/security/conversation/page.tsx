'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ConversationMessage {
  type: 'user' | 'ai';
  content: string;
  feedback?: string;
}

const scenarios = [
  {
    id: 'journalists',
    title: 'Press Conference',
    description: 'Answer simple questions from reporters',
    icon: '🎤',
    questions: [
      "Can you tell us what you did during your training today?",
      "How long have you been in the military?",
      "What do you like about being a soldier?",
      "How do you help protect your fellow soldiers?",
      "What's your daily routine like?"
    ]
  },
  {
    id: 'diplomatic',
    title: 'Friendly Chat',
    description: 'Have a casual conversation about military life',
    icon: '🤝',
    questions: [
      "What equipment do you use in your job?",
      "Tell me about your team members",
      "What made you want to join the military?",
      "What's the most interesting part of your job?",
      "How do you work together with your unit?"
    ]
  },
  {
    id: 'campus',
    title: 'School Visit',
    description: 'Talk to students about military service',
    icon: '🎓',
    questions: [
      "What kind of vehicles do you work with?",
      "How do soldiers communicate with each other?",
      "What do you do to stay safe?",
      "How do you help people in your job?",
      "What's your favorite part of being a soldier?"
    ]
  },
  {
    id: 'training',
    title: 'Training Practice',
    description: 'Practice basic military vocabulary',
    icon: '📝',
    questions: [
      "Can you describe your uniform?",
      "What kind of training do you do?",
      "How do you prepare for a mission?",
      "Tell me about your base",
      "What did you learn in basic training?"
    ]
  }
];

const wordPrompts = {
  Tank: "vehicles, equipment",
  Commander: "leaders, officers",
  Enemy: "challenges, difficulties",
  Tactics: "plans, methods",
  Battlefield: "training area, field",
  Victory: "success, achievement",
  Shield: "protection, safety"
};

const Page = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const userProfile = {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    birthDate: '1990-01-01',
    englishLevel: 'Intermediate',
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = async (event: any) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript;
          handleUserResponse(transcript);
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      stopConversation();
    };
  }, []);

  const handleUserResponse = async (transcript: string) => {
    setMessages(prev => [...prev, { type: 'user', content: transcript }]);

    try {
      const response = await analyzeResponse(transcript);
      speakText(response.feedback);
      setMessages(prev => [...prev, { type: 'ai', content: response.text, feedback: response.feedback }]);
      setTimeout(askNextQuestion, 10000);
    } catch (error) {
      console.error('Error processing response:', error);
    }
  };

  const analyzeResponse = async (userInput: string) => {
    try {
      const response = await fetch('/api/analyze-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: userInput,
          requiredWords: Object.keys(wordPrompts)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze response');
      }

      const data = await response.json();
      return {
        text: data.text,
        feedback: data.feedback,
        usedWords: data.usedWords
      };
    } catch (error) {
      console.error('Analysis error:', error);
      return {
        text: userInput,
        feedback: "I heard you! Keep practicing.",
        usedWords: []
      };
    }
  };
  const startConversation = () => {
    if (!selectedScenario) return;
    
    setIsActive(true);
    setMessages([]);
    setCurrentQuestionIndex(0);
    
    // הודעת פתיחה
    const welcomeMessage = `Welcome to ${selectedScenario.title}! Let's practice English together.`;
    setMessages([{ type: 'ai', content: welcomeMessage }]);
    speakText(welcomeMessage);
    
    // התחלת הקלטה ושאלה ראשונה
    setTimeout(() => {
      recognitionRef.current?.start();
      askQuestion(selectedScenario.questions[0]);
    }, 2000);
  };

  const stopConversation = () => {
    setIsActive(false);
    recognitionRef.current?.stop();
    synthRef.current?.cancel();
    setSelectedScenario(null);
  };

  const askQuestion = (question: string) => {
    speakText(question);
    setMessages(prev => [...prev, { type: 'ai', content: question }]);
  };

  const askNextQuestion = () => {
    if (!selectedScenario) return;
    
    const questions = selectedScenario.questions;
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    askQuestion(questions[nextIndex]);
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // מבטל הקראה קודמת אם יש
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      synthRef.current.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Home Link */}
      <div className="absolute top-4 left-4">
        <Link
          href="/topics"
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span className="text-2xl">🏠</span>
        </Link>
      </div>

      {/* Profile Button */}
      <div className="absolute top-4 right-4">
        <button
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => setShowProfile(!showProfile)}
        >
          👤
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="absolute top-20 right-4 bg-white p-6 shadow-2xl rounded-2xl w-80 z-50 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Profile</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">{userProfile.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{userProfile.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{userProfile.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">English Level:</span>
              <span className="font-medium text-orange-600">{userProfile.englishLevel}</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>
            <button
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300"
              onClick={() => setShowProfile(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Practice Speaking English
        </h1>

        {/* Scenario Selection */}
        {!selectedScenario && !isActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
              >
                <div className="text-4xl mb-4">{scenario.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{scenario.title}</h3>
                <p className="text-gray-600">{scenario.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Start/Stop Button */}
        {selectedScenario && !isActive && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedScenario.title}</h2>
            <p className="text-gray-600 mb-6">{selectedScenario.description}</p>
            <button
              onClick={startConversation}
              className="px-8 py-4 bg-orange-500 text-white text-xl font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg"
            >
              Start Conversation
            </button>
          </div>
        )}

        {/* Active Conversation */}
        {isActive && (
          <div>
            <button
              onClick={stopConversation}
              className="px-8 py-4 bg-red-500 text-white text-xl font-bold rounded-full hover:bg-red-600 transition-colors shadow-lg mb-8 mx-auto block"
            >
              End Conversation
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {selectedScenario?.icon}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedScenario?.title}</h2>
                  <p className="text-gray-500 text-sm">
                    {isActive ? "Listening... Speak clearly in English" : "Click Start to begin"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-orange-100 ml-12'
                        : 'bg-gray-100 mr-12'
                    }`}
                  >
                    <p className="text-gray-800">{message.content}</p>
                    {message.feedback && (
                      <p className="mt-2 text-sm text-orange-600 italic">
                        {message.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Recording Indicator */}
              {isActive && (
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span>Recording... Speak clearly in English</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;