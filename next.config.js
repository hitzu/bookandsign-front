/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Aquí puedes habilitar características experimentales si es necesario
  },
  env: {
    // API URL configuration
    // Defaults to localhost:3000 for local development
    // Override with NEXT_PUBLIC_API_URL environment variable for production
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://bookandsign-api.onrender.com"
        : "http://localhost:3000"),
  },
};

module.exports = nextConfig;
