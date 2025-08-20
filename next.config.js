/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  // Optimize for Netlify deployment
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig