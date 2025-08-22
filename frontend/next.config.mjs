/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.dropbox.com',
        port: '',
        pathname: '/scl/**',
      },
    ],
  },
};

export default nextConfig;
