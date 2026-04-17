/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Proxy /api/* to the Django backend so cookies + CSRF work easily in dev.
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
