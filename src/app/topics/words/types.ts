// Define common types used across components

export interface Flashcard {
    id: number;
    word: string;
    translation: string;
    example: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  export interface UserProfileData {
    fullName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    englishLevel: string;
  }