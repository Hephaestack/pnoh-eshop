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
      {
        protocol: 'https',
        hostname: 'f003.backblazeb2.com',
        port: '',
        pathname: '/file/PNOH-ESHOP/products/thumbnails/**',
      },
    ],
    qualities: [25, 50, 75, 90, 95,85, 100],
  },
};

export default nextConfig;
