import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import Head from 'next/head'

export default function Home() {
  // 结构化数据 - 提升 SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Seedance AI",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "50.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  }

  return (
    <>
      <SEO 
        title="Seedance AI - 领先的AI视频生成平台 | 文生视频 图生视频 AI创作工具"
        description="Seedance AI是专业的人工智能视频生成平台，支持文生视频、图生视频、AI绘画、3D生成。采用最先进的大语言模型和视觉理解技术，为创作者提供强大的AI Agent工具。立即体验AI视频制作、智能配音、自动剪辑等功能。"
        canonical="https://seedance.ai"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen smooth-scroll">
        <Navbar />
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </>
  )
}

