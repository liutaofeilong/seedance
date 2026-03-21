import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { supabase } from '@/lib/supabase'
import { checkRateLimit, getRemainingTime } from '@/lib/rateLimit'

// Hook to handle dropdown scroll and close on outside click
const useDropdownScroll = (
  menuRef: React.RefObject<HTMLDivElement>,
  triggerRef: React.RefObject<HTMLButtonElement>,
  isOpen: boolean,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isOpen) return

    const menuEl = menuRef.current
    const triggerEl = triggerRef.current
    if (!menuEl || !triggerEl) return

    // 点击外部关闭菜单（保留触发器点击，不会被误关）
    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (!menuEl.contains(target) && !triggerEl.contains(target)) {
        onClose()
      }
    }

    // 菜单内滚轮只滚菜单，不传递到页面
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      menuEl.scrollTop += e.deltaY
    }

    // 打开时锁定页面滚动，确保滚轮不带动整页
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    menuEl.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('mousedown', handlePointerDownOutside)
    document.addEventListener('touchstart', handlePointerDownOutside)

    return () => {
      menuEl.removeEventListener('wheel', handleWheel)
      document.removeEventListener('mousedown', handlePointerDownOutside)
      document.removeEventListener('touchstart', handlePointerDownOutside)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, menuRef, triggerRef, onClose])
}

const aspectRatios = [
  { label: '21:9', value: '21:9' },
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' },
]

const resolutions = [
  { label: '480p', value: '480p' },
  { label: '720p', value: '720p' },
  { label: '1080p', value: '1080p' },
]

// Simplified model categories - only Video Generation for now
const videoModels = [
  { id: 'doubao-seedance-1-5-pro', name: 'Seedance 1.5 Pro', badge: 'Recommended', description: 'Best quality with audio' },
  { id: 'doubao-seedance-2-0', name: 'Seedance 2.0', badge: 'Beta', description: 'Latest experimental model' },
  { id: 'doubao-seedance-1-0-pro', name: 'Seedance 1.0 Pro', description: 'Stable and reliable' },
  { id: 'doubao-seedance-1-0-pro-fast', name: 'Seedance 1.0 Fast', description: 'Quick generation' },
  { id: 'doubao-seedance-1-0-lite-i2v', name: 'Seedance Lite I2V', description: 'Image to video' },
  { id: 'doubao-seedance-1-0-lite-t2v', name: 'Seedance Lite T2V', description: 'Text to video' },
]

export default function Generate() {
  const [selectedModel, setSelectedModel] = useState('doubao-seedance-1-5-pro')
  const [mode, setMode] = useState<'text' | 'image'>('text')
  const [prompt, setPrompt] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [resolution, setResolution] = useState('720p')
  const [duration, setDuration] = useState(5)
  const [generateAudio, setGenerateAudio] = useState(true)
  const [watermark, setWatermark] = useState(false)
  const [cameraFixed, setCameraFixed] = useState(false)
  const [showRatioMenu, setShowRatioMenu] = useState(false)
  const [showResolutionMenu, setShowResolutionMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [needsSubscription, setNeedsSubscription] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string>('')

  const ratioMenuRef = useRef<HTMLDivElement>(null)
  const resolutionMenuRef = useRef<HTMLDivElement>(null)
  const ratioButtonRef = useRef<HTMLButtonElement>(null)
  const resolutionButtonRef = useRef<HTMLButtonElement>(null)

  useDropdownScroll(ratioMenuRef, ratioButtonRef, showRatioMenu, () => setShowRatioMenu(false))
  useDropdownScroll(resolutionMenuRef, resolutionButtonRef, showResolutionMenu, () => setShowResolutionMenu(false))

  const checkTaskStatus = async (taskId: string, token: string) => {
    try {
      const response = await fetch(`/api/check-task?taskId=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Check task failed:', response.status)
        return false // 继续轮询
      }

      const data = await response.json()
      
      if (data.success) {
        setTaskStatus(data.status)
        
        if (data.status === 'succeeded' && data.videoUrl) {
          setVideoUrl(data.videoUrl)
          setLoading(false)
          setTaskId(null)
          return true // 完成
        } else if (data.status === 'failed' || data.status === 'expired') {
          setError(`Video generation ${data.status}. Please try again.`)
          setLoading(false)
          setTaskId(null)
          return true // 结束
        }
      }
      return false // 继续轮询
    } catch (error: any) {
      console.error('Check task error:', error)
      // 网络错误不中断轮询
      return false
    }
  }

  const startPolling = async (taskId: string, token: string) => {
    setTaskId(taskId)
    setTaskStatus('queued')
    
    // 轮询检查任务状态，每5秒一次，最多轮询120次（10分钟）
    let attempts = 0
    const maxAttempts = 120
    
    const pollInterval = setInterval(async () => {
      attempts++
      
      // 更新进度提示
      const progress = Math.min(Math.floor((attempts / maxAttempts) * 100), 95)
      if (attempts % 6 === 0) { // 每30秒更新一次状态提示
        const messages = ['Processing...', 'Generating frames...', 'Adding effects...', 'Almost done...']
        const msgIndex = Math.floor(attempts / 24) % messages.length
        setTaskStatus(messages[msgIndex])
      }
      
      if (attempts > maxAttempts) {
        clearInterval(pollInterval)
        setError('Video generation timeout. Please try again.')
        setLoading(false)
        setTaskId(null)
        return
      }
      
      const isDone = await checkTaskStatus(taskId, token)
      if (isDone) {
        clearInterval(pollInterval)
      }
    }, 5000) // 每5秒检查一次
  }

  const handleGenerate = async () => {
    // 速率限制检查
    if (!checkRateLimit('video-generation', 5000)) {
      const remaining = getRemainingTime('video-generation', 5000)
      setError(`Please wait ${remaining} seconds before generating again`)
      return
    }

    setLoading(true)
    setError('')
    setVideoUrl(null)
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please sign in to generate videos')
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('mode', mode)
      formData.append('selectedModel', selectedModel)
      formData.append('aspectRatio', aspectRatio)
      formData.append('resolution', resolution)
      formData.append('duration', duration.toString())
      formData.append('generateAudio', generateAudio.toString())
      formData.append('watermark', watermark.toString())
      formData.append('cameraFixed', cameraFixed.toString())
      
      if (mode === 'text') {
        formData.append('prompt', prompt)
      } else if (imageFiles.length > 0) {
        // 添加所有图片
        imageFiles.forEach((file, index) => {
          formData.append(`image${index + 1}`, file)
        })
        formData.append('imageCount', imageFiles.length.toString())
        formData.append('prompt', prompt)
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        if (data.taskId) {
          // 异步任务，开始轮询
          await startPolling(data.taskId, session.access_token)
        } else if (data.videoUrl) {
          // 同步返回视频
          setVideoUrl(data.videoUrl)
          setLoading(false)
        }
      } else {
        console.error('Generation error:', data)
        
        // 检查是否需要订阅
        if (data.needsSubscription) {
          setError(data.message || 'Free generation limit reached. Please subscribe to continue.')
          setNeedsSubscription(true)
        } else {
          setError(data.message || data.error || 'Generation failed. Please check console for details.')
          setNeedsSubscription(false)
        }
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message || 'An error occurred during generation')
      setLoading(false)
    }
  }

  // 压缩图片函数 - 优化版
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // 检查文件大小，小于1MB的不压缩
      if (file.size < 1024 * 1024) {
        resolve(file)
        return
      }

      const reader = new FileReader()
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.onload = (e) => {
        const img = new Image()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // 根据原始尺寸动态调整目标尺寸
          const maxWidth = 1920
          const maxHeight = 1920
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = Math.floor(width * ratio)
            height = Math.floor(height * ratio)
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')!
          // 使用更好的图像平滑算法
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          
          // 根据文件大小动态调整质量
          const quality = file.size > 5 * 1024 * 1024 ? 0.7 : 0.85
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                console.log(`Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`)
                resolve(compressedFile)
              } else {
                resolve(file)
              }
            },
            'image/jpeg',
            quality
          )
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Seedance 2.0 支持最多10张图片，其他模型最多2张
    const maxImages = selectedModel === 'doubao-seedance-2-0' ? 10 : 2
    
    if (files.length + imageFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed for ${selectedModel === 'doubao-seedance-2-0' ? 'Seedance 2.0' : 'this model'}`)
      return
    }
    
    // 验证文件类型和大小
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 30 * 1024 * 1024) {
        setError(`${file.name} exceeds 30MB limit`)
        return false
      }
      return true
    })
    
    if (validFiles.length === 0) return
    
    setError('Compressing images...')
    
    try {
      // 压缩所有图片
      const compressedFiles = await Promise.all(
        validFiles.map(file => compressImage(file))
      )
      
      setImageFiles(prev => [...prev, ...compressedFiles].slice(0, maxImages))
      setError('')
    } catch (err: any) {
      setError(`Image processing failed: ${err.message}`)
    }
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const insertImageReference = (index: number) => {
    const reference = `@image${index + 1} `
    setPrompt(prev => prev + reference)
  }

  return (
    <>
      <SEO 
        title="AI Video Generator - Text to Video & Image to Video | Seedance AI"
        description="Create stunning AI videos with Seedance. Transform text and images into professional videos using advanced AI models. Multiple resolutions, aspect ratios, and audio options available."
        keywords={[
          'AI video generator',
          'text to video',
          'image to video',
          'video creation tool',
          'AI video maker',
        ]}
      />

      <div className="min-h-screen smooth-scroll">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              AI Video <span className="text-gradient">Generator</span>
            </h1>
            <p className="text-lg text-gray-400 text-center mb-12">
              Create professional videos from text or images
            </p>

            {/* Error Message - Only show non-subscription errors at top */}
            {error && !needsSubscription && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/30 text-accent rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                  <button onClick={() => { setError(''); setNeedsSubscription(false); }} className="text-accent hover:text-accent-light">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Model Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Model</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {videoModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-4 rounded-xl transition-all text-left ${
                      selectedModel === model.id
                        ? 'btn-primary glow-cyan'
                        : 'glass glass-hover border border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold">{model.name}</span>
                      {model.badge && (
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{model.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="flex gap-4 mb-8 justify-center flex-wrap">
              <button
                onClick={() => setMode('text')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'text'
                    ? 'btn-primary glow-cyan'
                    : 'glass glass-hover border border-white/10'
                }`}
              >
                📝 Text to Video
              </button>
              <button
                onClick={() => setMode('image')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'image'
                    ? 'btn-primary glow-cyan'
                    : 'glass glass-hover border border-white/10'
                }`}
              >
                🖼️ Image to Video
              </button>
            </div>

            {/* Video Parameters - 核心修改：移除动态marginBottom，增加z-10确保层级 */}
            <div className="glass rounded-2xl p-6 mb-8 border border-white/10 relative z-10">
              <h3 className="text-lg font-semibold mb-4">Video Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {/* Aspect Ratio - 下拉菜单增加z-[999]悬浮层级 */}
                <div className="relative z-40">
                  <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                  <button
                    ref={ratioButtonRef}
                    onClick={() => setShowRatioMenu(!showRatioMenu)}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 transition-all flex items-center justify-between"
                  >
                    <span>{aspectRatio}</span>
                    <svg className={`w-4 h-4 transition-transform ${showRatioMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showRatioMenu && (
                    <motion.div
                      ref={ratioMenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute glass border border-white/10 rounded-xl p-2 z-[999] shadow-2xl max-h-64 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent top-full left-0 mt-2"
                    >
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio.value}
                          onClick={() => {
                            setAspectRatio(ratio.value)
                            setShowRatioMenu(false)
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            aspectRatio === ratio.value
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Resolution - 下拉菜单增加z-[999]悬浮层级 */}
                <div className="relative z-40">
                  <label className="block text-sm font-medium mb-2">Resolution</label>
                  <button
                    ref={resolutionButtonRef}
                    onClick={() => setShowResolutionMenu(!showResolutionMenu)}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 transition-all flex items-center justify-between"
                  >
                    <span>{resolution}</span>
                    <svg className={`w-4 h-4 transition-transform ${showResolutionMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showResolutionMenu && (
                    <motion.div
                      ref={resolutionMenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute glass border border-white/10 rounded-xl p-2 z-[999] shadow-2xl max-h-64 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent top-full left-0 mt-2"
                    >
                      {resolutions.map((res) => (
                        <button
                          key={res.value}
                          onClick={() => {
                            setResolution(res.value)
                            setShowResolutionMenu(false)
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            resolution === res.value
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          {res.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">Duration ({duration}s)</label>
                  <div className="w-full h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg flex items-center px-2">
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      style={{
                        background: 'transparent',
                      }}
                    />
                  </div>
                </div>

                {/* Generate Audio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Audio</label>
                  <button
                    onClick={() => setGenerateAudio(!generateAudio)}
                    className={`w-full px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      generateAudio
                        ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                        : 'glass border border-white/10'
                    }`}
                  >
                    {generateAudio ? '🔊 With Audio' : '🔇 No Audio'}
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex gap-4 mt-4 flex-wrap">
                <button
                  onClick={() => setWatermark(!watermark)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    watermark
                      ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                      : 'glass border border-white/10'
                  }`}
                >
                  {watermark ? '💧 Watermark' : '💧 No Watermark'}
                </button>
                <button
                  onClick={() => setCameraFixed(!cameraFixed)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    cameraFixed
                      ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                      : 'glass border border-white/10'
                  }`}
                >
                  {cameraFixed ? '📷 Fixed Camera' : '📷 Moving Camera'}
                </button>
              </div>
              </div>
            </div>

            {/* Generation Form - z-0 确保层级低于下拉菜单 */}
            <div className="glass rounded-2xl p-8 mb-8 border border-white/10 z-0 relative">
              {mode === 'image' && (
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-3">
                    Upload Images
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    {selectedModel === 'doubao-seedance-2-0' 
                      ? '🎨 Seedance 2.0: Upload up to 10 images for multi-frame video generation'
                      : 'Upload 1 image for first-frame generation, or 2 images for first-last frame generation'
                    }
                  </p>
                  
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple={selectedModel === 'doubao-seedance-2-0'}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 mx-auto mb-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-300 font-semibold">
                        {selectedModel === 'doubao-seedance-2-0' ? 'Click to upload images (multiple)' : 'Click to upload image'}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">PNG, JPG, WebP up to 30MB</p>
                      <p className="text-xs text-cyan-400 mt-2">
                        {selectedModel === 'doubao-seedance-2-0' ? 'Maximum 10 images' : 'Maximum 2 images'}
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Images Preview */}
                  {imageFiles.length > 0 && (
                    <div className={`grid gap-4 ${selectedModel === 'doubao-seedance-2-0' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2'}`}>
                      {imageFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group glass rounded-xl p-2 border border-cyan-500/20"
                        >
                          <div className="aspect-video rounded-lg overflow-hidden bg-dark-lighter mb-2">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-400 truncate flex-1">
                              {selectedModel === 'doubao-seedance-2-0' 
                                ? `Frame ${index + 1}` 
                                : (index === 0 ? 'First Frame' : 'Last Frame')
                              }
                            </span>
                            <button
                              onClick={() => removeImage(index)}
                              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs text-red-400 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  {mode === 'text' ? 'Describe Your Video' : 'Describe the Animation'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    mode === 'text'
                      ? 'A serene sunset over mountains with birds flying across the sky...'
                      : 'Describe how the image should animate. For example: Camera slowly zooms in, revealing details...'
                  }
                  className="w-full h-32 bg-dark-lighter border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || (mode === 'text' && !prompt) || (mode === 'image' && imageFiles.length === 0)}
                className="w-full py-4 btn-primary rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-cyan"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {taskStatus ? `${taskStatus}...` : 'Generating...'}
                  </span>
                ) : (
                  '✨ Generate Video'
                )}
              </button>
              
              {/* Subscription Required Alert - Below Generate Button */}
              {needsSubscription && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-rose-500/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zm-2-5a.75.75 0 00-1.5 0v.008a.75.75 0 001.5 0V3zM3 8a2 2 0 11-4 0 2 2 0 014 0zm0 8a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-pink-300 mb-1">Subscription Required</p>
                      <p className="text-sm text-pink-200/80 mb-3">{error}</p>
                      <a 
                        href="/#pricing" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all text-sm"
                      >
                        View Pricing Plans
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    </div>
                    <button 
                      onClick={() => { setError(''); setNeedsSubscription(false); }} 
                      className="text-pink-400 hover:text-pink-300 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Task Status Info */}
              {loading && taskId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 glass rounded-xl border border-cyan-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-cyan-400">Task ID: {taskId}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {taskStatus === 'queued' && 'Your video is in queue...'}
                        {taskStatus === 'running' && 'Generating your video...'}
                        {!taskStatus && 'Submitting task...'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Video Result */}
            {videoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold mb-4">Your Video is Ready! 🎉</h3>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-xl mb-4"
                />
                <div className="flex gap-4">
                  <a
                    href={videoUrl}
                    download
                    className="flex-1 py-3 btn-primary rounded-lg font-semibold text-center hover:scale-105 transition-transform"
                  >
                    Download Video
                  </a>
                  <button
                    onClick={() => {
                      setVideoUrl(null)
                      setPrompt('')
                      setImageFiles([])
                    }}
                    className="flex-1 py-3 glass rounded-lg font-semibold hover:glow transition-all border border-white/10"
                  >
                    Create Another
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  )
}