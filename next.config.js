/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Aquí puedes habilitar características experimentales si es necesario
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;