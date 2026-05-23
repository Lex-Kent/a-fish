/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/prototypes/a-fish',   // ← This is the fix
  // Completely disable the black circle / Next.js dev indicator
  devIndicators: false,
};

export default nextConfig;