/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crmapi.conscor.com',
      },
      {
        protocol: 'https',
        hostname: 'noapi.hanaplatform.com',
      },
      {
        protocol: 'https',
        hostname: 'hel1.your-objectstorage.com',
      },
    ],
  },
};

export default nextConfig;