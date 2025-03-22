'use client';

import React, { useState } from 'react';

interface UserProfileProps {
  userProfile: {
    fullName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    englishLevel: string;
  };
  showProfile: boolean;
  toggleProfile: () => void;
  isEditingAllowed: boolean; // Add prop to determine if editing is allowed
}

const UserProfile: React.FC<UserProfileProps> = ({ userProfile, showProfile, toggleProfile, isEditingAllowed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Profile Saved:", editedProfile);
    }
    setIsEditing(!isEditing);
  };

  return (
    <>
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
            {/* Full Name */}
            <p className="flex items-center text-gray-700">
              <strong className="min-w-24">Name:</strong>
              {isEditing && isEditingAllowed ? (
                <input
                  type="text"
                  name="fullName"
                  value={editedProfile.fullName}
                  onChange={handleChange}
                  className="ml-2 p-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="ml-2">{userProfile.fullName}</span>
              )}
            </p>

            {/* Email */}
            <p className="flex items-center text-gray-700">
              <strong className="min-w-24">Email:</strong>
              {isEditing && isEditingAllowed ? (
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  className="ml-2 p-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="ml-2">{userProfile.email}</span>
              )}
            </p>

            {/* Phone Number */}
            <p className="flex items-center text-gray-700">
              <strong className="min-w-24">Phone:</strong>
              {isEditing && isEditingAllowed ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedProfile.phoneNumber}
                  onChange={handleChange}
                  className="ml-2 p-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="ml-2">{userProfile.phoneNumber}</span>
              )}
            </p>

            {/* Birth Date */}
            <p className="flex items-center text-gray-700">
              <strong className="min-w-24">Birth Date:</strong>
              {isEditing && isEditingAllowed ? (
                <input
                  type="date"
                  name="birthDate"
                  value={editedProfile.birthDate}
                  onChange={handleChange}
                  className="ml-2 p-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="ml-2">{userProfile.birthDate}</span>
              )}
            </p>

            {/* English Level */}
            <p className="flex items-center text-gray-700">
              <strong className="min-w-24">English Level:</strong>
              {isEditing && isEditingAllowed ? (
                <input
                  type="text"
                  name="englishLevel"
                  value={editedProfile.englishLevel}
                  onChange={handleChange}
                  className="ml-2 p-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="ml-2">{userProfile.englishLevel}</span>
              )}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <button
              className="w-full py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              onClick={handleEditToggle}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
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
    </>
  );
};

export default UserProfile;
