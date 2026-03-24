/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.imgbb.com",
      },
      {
        protocol: "https",
        hostname: "**.imgur.com",
      },
    ],
  },
};

export default nextConfig;

