'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Topics() {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);

  // User gamification data - will come from database later
  const [userData, setUserData] = useState({
    level: "Beginner",
    points: 0,
    totalScore: 0,
    completedTasks: 0,
    activeSince: "Today",
    nextLevel: "Intermediate",
    pointsToNextLevel: 100
  });

  // Fetch user data from the database
  useEffect(() => {
    // This function will run when the component mounts
    const fetchUserData = async () => {
      try {
        // When you have a database ready, uncomment and modify this code
        // const response = await fetch('/api/user-data');
        // const data = await response.json();
        // setUserData(data);
        
        // For now, we'll just use the default data
        console.log('Database not ready yet, using placeholder data');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once when component mounts

  const topics = [
    { id: 1, en: 'History and Heritage', he: 'הסטוריה ומורשת', link: '/topics/history', icon: '🏛️' },
    { id: 2, en: 'Diplomacy and International Relations', he: 'דיפלומטיה ויחסים בינלאומיים', link: '/topics/diplomacy', icon: '🤝' },
    { id: 3, en: 'Iron Swords War', he: 'מלחמת חרבות ברזל', link: '/topics/security', icon: '⚔️' },
    { id: 4, en: 'Innovation and Technology', he: 'חדשנות וטכנולוגיה', link: '/topics/innovation', icon: '💡' },
    { id: 5, en: 'Society and Multiculturalism', he: 'חברה ורב תרבותיות', link: '/topics/society', icon: '🌍' },
    { id: 6, en: 'Holocaust and Revival', he: 'שואה ותקומה', link: '/topics/holocaust', icon: '✡️' },
    { id: 7, en: 'Environment and Sustainability', he: 'סביבה וקיימות', link: '/topics/environment', icon: '🌱' },
    { id: 8, en: 'Economy and Entrepreneurship', he: 'כלכלה ויזמות', link: '/topics/economy', icon: '💰' },
  ];

  // User profile data - will come from database later
  const [userProfile, setUserProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate",
  });
  
  // Fetch user profile from the database
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // When you have a database ready, uncomment and modify this code
        // const response = await fetch('/api/user-profile');
        // const data = await response.json();
        // setUserProfile(data);
        
        // For now, we'll just use the default data
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

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

      {/* User Profile Icon */}
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
        <div className="absolute top-20 right-4 bg-white p-6 shadow-2xl rounded-2xl w-80 z-50 border border-gray-100 transform transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h2>
          <div className="space-y-3">
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Name:</strong> {userProfile.fullName}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Email:</strong> {userProfile.email}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Phone:</strong> {userProfile.phoneNumber}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Birth Date:</strong> {userProfile.birthDate}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">English Level:</strong> 
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm ml-2">
                {userProfile.englishLevel}
              </span>
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              className="w-full py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
              onClick={() => router.push('/edit-profile')}
            >
              Edit Profile
            </button>
            <button
              className="w-full py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              onClick={toggleProfile}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* User Level Card (Top Right) */}
      <div className="absolute top-20 right-4 bg-white p-4 rounded-2xl shadow-lg w-64">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Level</p>
            <h3 className="text-xl font-bold text-gray-800">{userData.level}</h3>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div 
            className="bg-orange-500 h-2 rounded-full" 
            style={{ width: `${(userData.points / userData.pointsToNextLevel) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{userData.points} points</span>
          <span>{userData.pointsToNextLevel - userData.points} to next level</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Choose Your Topic
        </h1>

        {/* Gamification Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">🎯</span>
            </div>
            <p className="text-sm text-gray-500">Total Score</p>
            <p className="text-2xl font-bold text-orange-600">{userData.totalScore}</p>
            <p className="text-xs text-gray-400">points</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">✅</span>
            </div>
            <p className="text-sm text-gray-500">Completed Tasks</p>
            <p className="text-2xl font-bold text-orange-600">{userData.completedTasks}</p>
            <p className="text-xs text-gray-400">activities</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">⏱️</span>
            </div>
            <p className="text-sm text-gray-500">Active Since</p>
            <p className="text-2xl font-bold text-orange-600">{userData.activeSince}</p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={topic.link}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center space-y-4">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {topic.icon}
                </span>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {topic.en}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {topic.he}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

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