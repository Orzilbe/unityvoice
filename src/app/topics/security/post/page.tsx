'use client';

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import Image from 'next/image';

interface Message {
  id: number;
  role: string;
  content: string;
}

const Page: NextPage = () => {
  const [post, setPost] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(0); // השארנו את זה כי זה בשימוש בתצוגה
  const [metrics, setMetrics] = useState({ likes: 500, shares: 25 });
  const [isLiked, setIsLiked] = useState(false);

  const requiredWords = ['Commander', 'Shield', 'Enemy', 'Tactics', 'Battlefield'];

  const fetchDynamicPost = async () => {
    try {
      const response = await fetch('/api/create-post/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requiredWords }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPost(data.text || 'Failed to load post. Please refresh to try again.');
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
  }, [fetchDynamicPost]); // הוספנו את fetchDynamicPost למערך התלויות

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setMetrics((prev) => ({ ...prev, likes: prev.likes + (isLiked ? -1 : 1) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Home Link */}
      <div className="absolute top-4 left-4">
        <Link href="/topics">
          <span className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-2xl">🏠</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="prose text-gray-800 md:w-3/5">{post || 'Loading post...'}</div>
            <div className="md:w-2/5">
              {imageUrl && (
                <Image src={imageUrl} alt="Post Image" width={400} height={300} className="rounded-lg object-cover" />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-12 text-gray-600">
            <button onClick={handleLikeClick} className="flex items-center space-x-2 hover:text-red-500 transition-colors">
              <FaHeart className={isLiked ? 'text-red-500' : ''} />
              <span>{metrics.likes}</span>
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
      </div>
    </div>
  );
};

export default Page;