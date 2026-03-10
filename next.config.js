/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'seedance.ai', 
      'localhost',
      'olqcbssdcedbagxqitjo.supabase.co', // Supabase 存储
      'ark.cn-beijing.volces.com', // 豆包 API
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.volces.com',
      },
    ],
  },
  // 生产环境优化
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig






