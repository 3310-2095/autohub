/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crmapi.conscor.com',
        pathname: '/uploads/**', // Optional: Restrict to specific paths
      },
    ],
  },
};

export default nextConfig;