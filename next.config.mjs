/** @type {import('next').NextConfig} */
const nextConfig = (phase) => ({
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});

export default nextConfig;
