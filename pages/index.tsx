import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'

export default function Home() {
  return (
    <>
      <SEO 
        title="Seedance AI - 领先的AI视频生成平台 | 文生视频 图生视频 AI创作工具"
        description="Seedance AI是专业的人工智能视频生成平台，支持文生视频、图生视频、AI绘画、3D生成。采用最先进的大语言模型和视觉理解技术，为创作者提供强大的AI Agent工具。立即体验AI视频制作、智能配音、自动剪辑等功能。"
        canonical="https://seedance.ai"
      />
      
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

