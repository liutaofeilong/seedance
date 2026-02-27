import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 高端背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 主光源 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-purple-600 to-pink-500 rounded-full blur-[150px]"
        />
        
        {/* 动态粒子效果 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* 标签 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 glass rounded-full border border-cyan-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-sm font-medium text-cyan-400">AI-Powered Video Generation</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-none"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="block text-white">Create Stunning</span>
            <span className="block text-gradient text-glow mt-2">AI Videos</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Transform your ideas into professional videos with advanced AI.
            <br className="hidden md:block" />
            <span className="text-cyan-400">Text to Video</span> · <span className="text-blue-400">Image to Video</span> · <span className="text-purple-400">3D Generation</span>
          </motion.p>

          {/* CTA 按钮 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <Link 
              href="/generate"
              className="group relative px-8 py-4 btn-primary rounded-xl font-semibold text-base hover:scale-105 transition-all duration-300 glow-cyan"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Creating
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="#features"
              className="px-8 py-4 glass glass-hover rounded-xl font-semibold text-base transition-all duration-300 border border-white/10"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* 数据展示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { number: '100K+', label: 'Videos Generated', icon: '🎬' },
              { number: '50+', label: 'AI Models', icon: '🤖' },
              { number: '4K', label: 'Ultra HD', icon: '✨' },
              { number: '<30s', label: 'Fast Generation', icon: '⚡' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 card-hover"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                <div className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 滚动指示器 */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-cyan-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}

