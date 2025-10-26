/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.bannerbear.com', 'storage.googleapis.com', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  },
}

module.exports = nextConfig