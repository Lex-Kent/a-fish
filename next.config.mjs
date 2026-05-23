/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  // Completely disable the black circle / Next.js dev indicator
  devIndicators: false,
};

export default nextConfig;