import { motion } from 'framer-motion'

const features = [
  {
    icon: '🎬',
    title: 'Text to Video',
    description: 'Transform text into cinematic videos with advanced AI models',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: '🖼️',
    title: 'Image to Video',
    description: 'Animate static images with fluid motion and dynamic effects',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: '🎨',
    title: 'AI Image Generation',
    description: 'Create stunning visuals from text descriptions',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🎲',
    title: '3D Generation',
    description: 'Generate 3D models and scenes from images or text',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: '🤖',
    title: 'AI Agent',
    description: 'Intelligent automation for complex video workflows',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: '👁️',
    title: 'Vision Understanding',
    description: 'Advanced computer vision and image recognition',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Generate videos in seconds with optimized AI pipeline',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: '🎯',
    title: 'Precision Control',
    description: 'Fine-tune every aspect with advanced parameters',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: '🔊',
    title: 'AI Audio',
    description: 'Auto-generate synchronized sound effects and music',
    gradient: 'from-violet-500 to-purple-500',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 glass rounded-full border border-cyan-500/20"
          >
            <span className="text-sm font-medium text-cyan-400">Powerful Features</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Everything You Need to
            <br />
            <span className="text-gradient">Create Amazing Videos</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Professional AI tools powered by cutting-edge technology
          </p>
        </motion.div>

        {/* 功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative"
            >
              <div className="relative glass glass-hover rounded-2xl p-6 h-full border border-white/5 hover:border-cyan-500/30 transition-all duration-300 card-hover">
                {/* 图标 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-4xl`}>
                    {feature.icon}
                  </div>
                  <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${feature.gradient} opacity-50`} />
                </div>
                
                {/* 内容 */}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                
                {/* 悬浮效果 */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <a
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-4 btn-primary rounded-xl font-semibold hover:scale-105 transition-all duration-300 glow-cyan"
          >
            Try All Features Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

