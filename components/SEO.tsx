import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
}

export default function SEO({
  title = 'Seedance AI - 领先的AI视频生成平台 | 文生视频 图生视频 AI创作工具',
  description = 'Seedance AI是专业的人工智能视频生成平台，支持文生视频、图生视频、AI绘画、3D生成。采用最先进的大语言模型和视觉理解技术，为创作者提供强大的AI Agent工具。立即体验AI视频制作、智能配音、自动剪辑等功能。',
  keywords = [],
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical
}: SEOProps) {
  const defaultKeywords = [
    // AI核心关键词
    'AI', 'Artificial Intelligence', '人工智能', 'AI工具', 'AI平台',
    
    // 视频生成相关
    'AI视频生成', '文生视频', '图生视频', 'Text to Video', 'Image to Video',
    'AI视频制作', 'AI剪辑', '视频AI', '智能视频生成', 'AI短视频',
    'Sora', 'Runway', 'Pika', 'Gen-2', 'Stable Video',
    
    // 图像生成相关
    'AI绘画', 'AI作图', '文生图', 'Text to Image', 'AI画图',
    'Midjourney', 'Stable Diffusion', 'DALL-E', 'AI图片生成',
    
    // 大语言模型
    '大语言模型', 'LLM', 'Large Language Model', 'GPT', 'ChatGPT',
    'Claude', 'Gemini', '文心一言', '通义千问', 'Kimi',
    
    // 视觉理解
    '视觉理解', 'Computer Vision', '图像识别', 'OCR', '视觉AI',
    '多模态', 'Multimodal', '视觉语言模型', 'Vision Language Model',
    
    // 3D生成
    '3D生成', 'AI 3D', '3D建模', 'NeRF', '3D重建',
    'Text to 3D', 'Image to 3D', '三维生成',
    
    // AI Agent
    'AI Agent', '智能代理', 'AI助手', 'AI机器人', '自动化AI',
    'Agent工作流', 'AI自动化', 'Autonomous AI',
    
    // 创作工具
    'AI创作', 'AI内容生成', 'AIGC', 'AI设计', 'AI营销',
    '内容创作工具', '创意AI', 'AI辅助创作',
    
    // 技术相关
    'Diffusion Model', 'Transformer', 'Neural Network', '深度学习',
    'Machine Learning', '神经网络', 'GAN', 'VAE',
    
    // 应用场景
    'AI营销视频', 'AI广告', 'AI短视频制作', 'AI动画',
    'AI特效', 'AI配音', 'AI字幕', 'AI剪辑',
    
    // 品牌相关
    'Seedance', 'Doubao', '豆包', 'Seedance AI', '字节跳动AI',
    
    // 行业热词
    'AIGC工具', 'AI生产力', 'AI效率工具', 'AI创业',
    'AI商业化', 'AI变现', 'AI赋能',
    
    // 长尾关键词
    '如何用AI生成视频', 'AI视频生成器', '免费AI视频工具',
    '最好的AI视频生成平台', 'AI视频制作教程',
    '文字转视频AI', '图片转视频AI', 'AI自动生成视频',
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  return (
    <Head>
      {/* 基础SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Seedance AI" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Seedance AI" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* 语言和地区 */}
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* 移动端优化 */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* 主题颜色 */}
      <meta name="theme-color" content="#0A0E27" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* 结构化数据 - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Seedance AI',
            description: description,
            url: 'https://seedance.ai',
            logo: 'https://seedance.ai/logo.png',
            sameAs: [
              'https://twitter.com/seedance',
              'https://github.com/seedance',
            ],
          }),
        }}
      />
      
      {/* 结构化数据 - WebApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Seedance AI',
            applicationCategory: 'MultimediaApplication',
            offers: {
              '@type': 'Offer',
              price: '100',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1250',
            },
          }),
        }}
      />
    </Head>
  )
}

