import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { supabase } from '@/lib/supabase'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get user from authorization header
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      console.error('No authorization token provided')
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - Please sign in' 
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - Invalid token' 
      })
    }

    console.log('User authenticated:', user.email)

    // Parse form data
    const form = formidable({})
    const [fields, files] = await form.parse(req)

    const mode = fields.mode?.[0]
    const prompt = fields.prompt?.[0]
    const selectedModel = fields.selectedModel?.[0] || 'doubao-seedance-1-5-pro'
    const aspectRatio = fields.aspectRatio?.[0] || '16:9'
    const resolution = fields.resolution?.[0] || '720p'
    const duration = parseInt(fields.duration?.[0] || '5')
    const generateAudio = fields.generateAudio?.[0] === 'true'
    const watermark = fields.watermark?.[0] === 'true'
    const cameraFixed = fields.cameraFixed?.[0] === 'true'
    const imageCount = parseInt(fields.imageCount?.[0] || '0')

    console.log('Request params:', { 
      mode, 
      selectedModel,
      aspectRatio, 
      resolution,
      duration,
      generateAudio,
      watermark,
      cameraFixed,
      imageCount, 
      promptLength: prompt?.length 
    })

    // 收集所有上传的图片
    const images: any[] = []
    for (let i = 1; i <= imageCount; i++) {
      const imageKey = `image${i}`
      if (files[imageKey]) {
        images.push(files[imageKey][0])
        console.log(`Image ${i} uploaded:`, files[imageKey][0].originalFilename)
      }
    }

    // Check user's subscription and usage
    // TODO: Implement subscription check from Supabase
    
    // Call Seedance API (豆包)
    console.log('Calling Seedance API...')
    const seedanceResponse = await callSeedanceAPI({
      mode,
      prompt,
      selectedModel,
      aspectRatio,
      resolution,
      duration,
      generateAudio,
      watermark,
      cameraFixed,
      images,
    })

    if (seedanceResponse.success) {
      console.log('Task submitted:', seedanceResponse.taskId)
      
      // Save generation record to Supabase (status: processing)
      const { error: dbError } = await supabase
        .from('video_generations')
        .insert({
          user_id: user.id,
          mode,
          prompt,
          aspect_ratio: aspectRatio,
          video_url: null,
          task_id: seedanceResponse.taskId,
          status: 'processing',
          created_at: new Date().toISOString(),
        })

      if (dbError) {
        console.error('Database error:', dbError)
      }
      
      return res.status(200).json({
        success: true,
        taskId: seedanceResponse.taskId,
        status: seedanceResponse.status || 'processing',
      })
    } else {
      console.error('Seedance API failed:', seedanceResponse.error)
      return res.status(500).json({
        success: false,
        message: seedanceResponse.error || 'Video generation failed',
      })
    }
  } catch (error: any) {
    console.error('Generation error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

async function callSeedanceAPI(params: any) {
  // 豆包 Seedance 1.5 Pro API 集成
  const { mode, prompt, selectedModel, aspectRatio, resolution, duration, generateAudio, watermark, cameraFixed, images } = params
  
  try {
    let content: any[] = []
    
    if (mode === 'image' && images && images.length > 0) {
      // 图生视频模式
      console.log(`Processing ${images.length} images...`)
      
      // 根据图片数量判断模式
      if (images.length === 1) {
        // 首帧图生视频 - 不需要 role
        const image = images[0]
        const imageBuffer = fs.readFileSync(image.filepath)
        const base64Image = imageBuffer.toString('base64')
        
        content.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`
          }
        })
        console.log('Single image added (first frame mode)')
      } else if (images.length === 2) {
        // 首尾帧图生视频 - 需要明确指定 role
        const firstImage = images[0]
        const lastImage = images[1]
        
        const firstBuffer = fs.readFileSync(firstImage.filepath)
        const lastBuffer = fs.readFileSync(lastImage.filepath)
        
        // 首帧图片
        content.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${firstBuffer.toString('base64')}`
          },
          role: "first_frame"
        })
        
        // 尾帧图片
        content.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${lastBuffer.toString('base64')}`
          },
          role: "last_frame"
        })
        console.log('Two images added (first-last frame mode)')
      }
      
      // 添加文本提示词
      if (prompt) {
        content.push({
          type: "text",
          text: prompt
        })
        console.log('Prompt added:', prompt.substring(0, 100))
      }
    } else {
      // 文生视频模式
      content = [
        {
          type: "text",
          text: prompt
        }
      ]
      console.log('Text-to-video mode, prompt:', prompt?.substring(0, 100))
    }

    const apiUrl = process.env.SEEDANCE_API_URL || 'https://ark.cn-beijing.volces.com/api/v3'
    const apiKey = process.env.SEEDANCE_API_KEY
    
    // 根据选择的模型映射到实际的模型ID
    const modelMapping: any = {
      'doubao-seedance-2-0': 'doubao-seedance-2-0',
      'doubao-seedance-1-5-pro': 'doubao-seedance-1-5-pro-251215',
      'doubao-seedance-1-0-pro': 'doubao-seedance-1-0-pro',
      'doubao-seedance-1-0-pro-fast': 'doubao-seedance-1-0-pro-fast',
      'doubao-seedance-1-0-lite-i2v': 'doubao-seedance-1-0-lite-i2v',
      'doubao-seedance-1-0-lite-t2v': 'doubao-seedance-1-0-lite-t2v',
    }
    
    const model = modelMapping[selectedModel] || 'doubao-seedance-1-5-pro-251215'

    console.log('API Config:', {
      url: apiUrl,
      model: model,
      hasApiKey: !!apiKey,
      aspectRatio: aspectRatio,
      resolution: resolution,
      duration: duration
    })

    // 解析宽高比和时长
    const [width, height] = aspectRatio.split(':').map(Number)
    const ratioStr = `${width}:${height}`
    
    // 根据文档，参数可以在文本中指定
    let promptWithParams = prompt || ''
    if (!promptWithParams.includes('--duration')) {
      promptWithParams += ` --duration ${duration}`
    }
    if (!promptWithParams.includes('--camerafixed')) {
      promptWithParams += ` --camerafixed ${cameraFixed}`
    }
    if (!promptWithParams.includes('--watermark')) {
      promptWithParams += ` --watermark ${watermark}`
    }
    if (!promptWithParams.includes('--ratio')) {
      promptWithParams += ` --ratio ${ratioStr}`
    }
    
    // 更新 content 中的文本
    if (mode === 'text') {
      content[0].text = promptWithParams
    } else if (mode === 'image' && content.length > 0) {
      // 找到文本内容并更新
      const textIndex = content.findIndex(c => c.type === 'text')
      if (textIndex >= 0) {
        content[textIndex].text = promptWithParams
      }
    }
    
    // 构建请求体（按照 Seedance 1.5 pro 文档格式）
    const requestBody: any = {
      model: model,
      content: content
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2).substring(0, 1000))
    console.log('Sending request to Seedance API...')
    
    const response = await fetch(`${apiUrl}/contents/generations/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Response status:', response.status, response.statusText)
    
    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      // Seedance 1.5 是异步任务，返回 task_id
      const taskId = data.id || data.task_id || data.request_id
      
      if (taskId) {
        console.log('Task submitted successfully, task ID:', taskId)
        
        // 返回任务ID，前端需要轮询查询结果
        return {
          success: true,
          taskId: taskId,
          status: data.status || 'processing',
          message: 'Video generation task submitted. Please wait for processing.'
        }
      } else {
        console.error('No task ID in response')
        return {
          success: false,
          error: 'No task ID returned from API'
        }
      }
    } else {
      const errorMsg = data.error?.message || data.message || JSON.stringify(data)
      console.error('Seedance API error response:', errorMsg)
      return {
        success: false,
        error: `API Error: ${errorMsg}`,
      }
    }
  } catch (error: any) {
    console.error('Seedance API call exception:', error)
    return {
      success: false,
      error: `Network Error: ${error.message}`,
    }
  }
}

