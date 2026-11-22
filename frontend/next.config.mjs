/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:4000";

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    return [
      {
        source: "/cong-nghe-so",
        destination: "/cong-nghe",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
