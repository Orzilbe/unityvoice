/*Post*/
'use client';

import React from 'react';
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHeart, FaComment, FaShare, FaInfoCircle } from 'react-icons/fa';
import NewsUpdates from '@/components/NewsUpdates';

interface Message {
  id: number;
  role: string;
  content: string;
}

const Page: NextPage = () => {
  const router = useRouter();
  const [post, setPost] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [metrics, setMetrics] = useState({
    likes: 500,
    shares: 25,
  });
  const [isLiked, setIsLiked] = useState(false);

  const userProfile = {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    birthDate: '1990-01-01',
    englishLevel: 'Intermediate',
  };

  const requiredWords = ['Commander', 'Shield', 'Enemy', 'Tactics', 'Battlefield'];

  const contextChecks = [
    {
      word: 'Commander',
      patterns: ['commander.*(?:leads|directs|strategy|army|forces)']
    },
    {
      word: 'Shield',
      patterns: ['(?:defensive|protective).*shield', 'shield.*(?:protects|defends|guards)']
    },
    {
      word: 'Enemy',
      patterns: ['enemy.*(?:forces|position|movement|strategy)', '(?:defeat|counter).*enemy']
    },
    {
      word: 'Tactics',
      patterns: ['tactical.*(?:approach|strategy|plan)', 'tactics.*(?:involve|include|require)']
    },
    {
      word: 'Battlefield',
      patterns: ['battlefield.*(?:control|position|advantage)', '(?:on|across).*battlefield']
    }
  ];

  const fetchDynamicPost = async () => {
    try {
      const response = await fetch('/api/create-post/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requiredWords: requiredWords
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.text) {
        setPost(data.text);
      } else {
        throw new Error('No text in response');
      }
    } catch (error) {
      console.error('Error:', error);
      setPost('Failed to load post. Please refresh to try again.');
    }
  };

  useEffect(() => {
    fetchDynamicPost();
    setImageUrl('https://www.economist.com/cdn-cgi/image/width=834,quality=80,format=auto/content-assets/images/20231021_FBP501.jpg');
    setMetrics({
      likes: Math.floor(Math.random() * 1000 + 100),
      shares: Math.floor(Math.random() * 50 + 5),
    });
  }, []);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let score = 0;
    const feedback = [];

    // Length check (20%)
    const wordCount = input.split(/\s+/).length;
    let lengthScore = 0;
    if (wordCount >= 50) lengthScore = 1;
    else if (wordCount >= 30) lengthScore = 0.8;
    else if (wordCount >= 20) lengthScore = 0.6;
    else if (wordCount >= 10) lengthScore = 0.4;
    else lengthScore = 0.2;
    
    score += lengthScore * 20;
    feedback.push(`📝 Length: ${wordCount} words (${(lengthScore * 20).toFixed(1)}/20)\n${
      wordCount < 20 ? "Consider writing a bit more to express your thoughts fully." :
      wordCount >= 50 ? "Excellent length! Your response is well-developed." :
      "Good length. You're expressing your thoughts clearly."
    }`);

    // Sentence structure (20%)
    const sentences = input.split(/[.!?]+/).filter(s => s.trim());
    let structureScore = 0;
    const averageLength = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length;
    
    if (averageLength >= 8) structureScore = 1;
    else if (averageLength >= 6) structureScore = 0.8;
    else if (averageLength >= 4) structureScore = 0.6;
    else structureScore = 0.4;

    score += structureScore * 20;
    feedback.push(`📖 Sentence Structure: (${(structureScore * 20).toFixed(1)}/20)\n${
      averageLength >= 8 ? "Excellent sentence structure with complex thoughts!" :
      averageLength >= 6 ? "Good sentence structure. You're expressing ideas clearly." :
      "Try building slightly longer sentences to develop your ideas more fully."
    }`);

    // Word usage (30%)
    let wordScore = 0;
    const usedWords = [];
    requiredWords.forEach((word) => {
      const wordRegex = new RegExp(word, 'i');
      if (input.match(wordRegex)) {
        const contextCheck = contextChecks.find(check => check.word === word);
        const hasGoodContext = contextCheck?.patterns.some(pattern => 
          new RegExp(pattern, 'i').test(input)
        );
        
        if (hasGoodContext) {
          wordScore += 6;
          usedWords.push(`✨ "${word}": Excellent usage in military context!`);
        } else {
          wordScore += 4;
          usedWords.push(`✓ "${word}": Used, but could be more specific to military context`);
        }
      }
    });
    
    score += wordScore;
    feedback.push(`🎯 Military Terms (${wordScore.toFixed(1)}/30)\n${usedWords.join('\n')}`);

    // Relevance and content (30%)
    const keyThemes = {
      conflict: ['war', 'battle', 'fight', 'combat', 'operation'],
      location: ['gaza', 'israel', 'border', 'south', 'north'],
      military: ['idf', 'soldier', 'troop', 'force', 'unit'],
      specific: ['october 7th', 'hamas', 'iron swords']
    };

    let relevanceScore = 0;
    const contentFeedback = [];
    
    Object.entries(keyThemes).forEach(([theme, terms]) => {
      const matches = terms.filter(term => 
        input.toLowerCase().includes(term.toLowerCase())
      ).length;
      const themeScore = (matches / terms.length) * 7.5;
      relevanceScore += themeScore;
      
      contentFeedback.push(
        `${matches > 0 ? '✓' : '•'} ${theme.charAt(0).toUpperCase() + theme.slice(1)}: ${
          themeScore.toFixed(1)}/7.5`
      );
    });

    score += relevanceScore;
    feedback.push(`📊 Content Relevance (${relevanceScore.toFixed(1)}/30)\n${contentFeedback.join('\n')}`);

    // Calculate final score and stars
    const finalScore = Math.min(100, Math.round(score * 10) / 10);
    const fullStars = Math.floor(finalScore / 20);
    const halfStar = (finalScore % 20) >= 10 ? 1 : 0;
    const starRating = '⭐'.repeat(fullStars) + (halfStar ? '½' : '');

    setMessages(prev => [
      ...prev,
      { 
        id: prev.length + 1, 
        role: 'user', 
        content: input 
      },
      {
        id: prev.length + 2,
        role: 'assistant',
        content: `Score: ${finalScore}/100 (${starRating})\n\n${feedback.join('\n\n')}\n\n${
          finalScore >= 90 ? '🌟 Outstanding work! Your response shows excellent understanding and usage of military terminology!' :
          finalScore >= 80 ? '✨ Excellent work! You\'re using military terms effectively and showing good understanding!' :
          finalScore >= 70 ? '👏 Great effort! You\'re showing good progress with military terminology!' :
          finalScore >= 60 ? '💪 Good job! Keep practicing to improve your military vocabulary!' :
          '🎯 Nice try! Let\'s work on incorporating more military terms and context.'
        }`
      }
    ]);

    setCommentCount(prev => prev + 1);
    setInput('');
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setMetrics(prev => ({
      ...prev,
      likes: prev.likes + (isLiked ? -1 : 1)
    }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Profile Button */}
      <div className="absolute top-4 right-4">
        <button
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => setShowProfile(!showProfile)}
        >
          👤
        </button>
      </div>

      {/* Home Link */}
      <div className="absolute top-4 left-4">
        <Link
          href="/topics"
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span className="text-2xl">🏠</span>
        </Link>
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
      <div className="max-w-4xl mx-auto mt-16">
        {/* Post Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl">
              👤
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">IDF Expert</h2>
              <p className="text-gray-600 text-sm font-medium">2 hours ago • 🌍</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="prose text-gray-800 md:w-3/5">
              {post || 'Loading post...'}
            </div>
            <div className="md:w-2/5">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Heritage Post"
                  className="w-full rounded-lg object-cover h-full"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Jewish+Heritage';
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-12 text-gray-600">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-2 hover:text-red-500 transition-colors"
            >
              <FaHeart className={isLiked ? 'text-red-500' : ''} />
              <span>{metrics.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <div className="flex items-center space-x-2">
              <FaComment />
              <span>{commentCount}</span>
            </div>
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
              <FaShare />
              <span>{metrics.shares}</span>
            </button>
          </div>
        </div>

        {/* Required Words Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaInfoCircle className="text-orange-500 mr-3 text-xl" />
            <h3 className="text-xl font-bold text-gray-800">Required Words:</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {requiredWords.map(word => (
              <span key={word} className="px-6 py-3 bg-orange-500 text-white rounded-full text-base font-medium shadow-sm">
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleReplySubmit} className="mb-8">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your response about Jewish heritage using the required words..."
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-32 text-gray-900"
            />
            <button
              type="submit"
              className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Submit Response
            </button>
          </form>

          <div className="space-y-6">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-6 rounded-lg ${
                  message.role === 'user' ? 'bg-gray-50' : 'bg-orange-50'
                }`}
              >
                <p className="font-semibold text-gray-900 mb-3">
                  {message.role === 'user' ? 'Your Response:' : 'Feedback:'}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Challenge Button */}
        {messages.length > 0 && (
          <div className="mt-4 text-center">
            <Link href="/topics/security/conversation">
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Next Challenge →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;