'use client';

import Header from '../../components/Header';
import UserProfile from '../../components/UserProfile';
import TopicCard from '../../components/TopicCard';
import NavigationButton from '../../components/NavigationButton';

export default function Topics() {
  const topics = [{ id: 1, en: 'History and Heritage', he: 'הסטוריה ומורשת', link: '/topics/history-and-heritage/words', icon: '🏛️' },
    { id: 2, en: 'Diplomacy and International Relations', he: 'דיפלומטיה ויחסים בינלאומיים', link: '/topics/diplomacy/words', icon: '🤝' },
    { id: 3, en: 'Haravot Barzel War', he: 'מלחמת חרבות ברזל', link: '/topics/security/words', icon: '⚔️' },
    { id: 4, en: 'Innovation and Technology', he: 'חדשנות וטכנולוגיה', link: '/topics/innovation/words', icon: '💡' },
    { id: 5, en: 'Society and Multiculturalism', he: 'חברה ורב תרבותיות', link: '/topics/society/words', icon: '🌍' },
    { id: 6, en: 'Religion and Holiness', he: 'דת וקדושה', link: '/topics/religion/words', icon: '✡️' },
    { id: 7, en: 'Environment and Sustainability', he: 'סביבה וקיימות', link: '/topics/environment/words', icon: '🌱' },
    { id: 8, en: 'Economy and Entrepreneurship', he: 'כלכלה ויזמות', link: '/topics/economy/words', icon: '💰' },];
  const userProfile = { fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate", };

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
        <Header title="Choose Your Topic" subtitle="" />
        
        <div className="absolute top-4 right-4">
          <UserProfile user={userProfile} />
        </div>
  
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
  
        <div className="absolute top-4 left-4">
          <NavigationButton href="/" icon="🏠" />
        </div>
      </div>
    );
  }