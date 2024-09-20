/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      appDir: true,
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
    images: {
      domains: ['g-zqsf0lqo2y5.vusercontent.net'],
    },
    output: 'export',
  };
  
  export default nextConfig;