import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { taskId } = req.query
    
    if (!taskId || typeof taskId !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Task ID is required' 
      })
    }

    // Get user from authorization header
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized' 
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized' 
      })
    }

    // 查询豆包 Seedance API 任务状态
    const apiUrl = process.env.SEEDANCE_API_URL || 'https://ark.cn-beijing.volces.com/api/v3'
    const apiKey = process.env.SEEDANCE_API_KEY

    console.log('Checking task status:', taskId)

    const response = await fetch(`${apiUrl}/contents/generations/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000), // 30秒超时（增加到30秒）
    })

    const data = await response.json()
    console.log('Task status response:', JSON.stringify(data, null, 2))

    if (response.ok) {
      const status = data.status // queued, running, succeeded, failed, expired
      
      // 根据实际返回格式，视频URL在 data.content.video_url 中
      let videoUrl = null
      if (data.content && data.content.video_url) {
        videoUrl = data.content.video_url
      } else if (data.videos && data.videos.length > 0) {
        videoUrl = data.videos[0].url || data.videos[0].video_url
      }
      
      const lastFrameUrl = data.last_frame_url || data.content?.last_frame_url

      // 更新数据库记录
      if (status === 'succeeded' && videoUrl) {
        await supabase
          .from('video_generations')
          .update({
            status: 'completed',
            video_url: videoUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('task_id', taskId)
          .eq('user_id', user.id)
      } else if (status === 'failed' || status === 'expired') {
        await supabase
          .from('video_generations')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('task_id', taskId)
          .eq('user_id', user.id)
      }

      return res.status(200).json({
        success: true,
        status: status,
        videoUrl: videoUrl,
        lastFrameUrl: lastFrameUrl,
        taskId: taskId,
      })
    } else {
      const errorMsg = data.error?.message || data.message || 'Failed to check task status'
      return res.status(500).json({
        success: false,
        error: errorMsg,
      })
    }
  } catch (error: any) {
    console.error('Check task error:', error)
    
    // 如果是网络超时或连接错误，返回特殊状态让前端继续轮询
    if (error.name === 'AbortError' || error.code === 'ECONNREFUSED' || error.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return res.status(200).json({
        success: true,
        status: 'running', // 假设仍在运行
        message: 'Network timeout, will retry'
      })
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

