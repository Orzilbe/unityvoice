/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@your-monorepo/ui', '@your-monorepo/shared'],
    // מספר אופציות נוספות
    images: {
      domains: [],
    },
    // אם יש צורך בשימוש ב-webpack מותאם אישית
    webpack: (config, { isServer }) => {
      // הגדרות webpack כאן (אם צריך)
      return config;
    },
  }
  
  module.exports = nextConfig