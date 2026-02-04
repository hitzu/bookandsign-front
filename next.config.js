/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Aquí puedes habilitar características experimentales si es necesario
  },
  async redirects() {
    return [
      {
        source: "/pages/c/:token",
        destination: "/pages/reserva/:token",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.storage.supabase.co",
      },
    ],
    // Explicitly allow our current Supabase host as well.
    domains: ["uljzbxuxzknilubykrlw.storage.supabase.co"],
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
