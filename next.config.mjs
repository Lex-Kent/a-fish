/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/prototypes/a-fish' : '',
  // Completely disable the black circle / Next.js dev indicator
  devIndicators: false,
};

export default nextConfig;