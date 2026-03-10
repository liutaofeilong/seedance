// 简单的客户端速率限制（防止用户频繁点击）
const rateLimitMap = new Map<string, number>()

export function checkRateLimit(key: string, limitMs: number = 3000): boolean {
  const now = Date.now()
  const lastRequest = rateLimitMap.get(key)
  
  if (lastRequest && now - lastRequest < limitMs) {
    return false // 被限制
  }
  
  rateLimitMap.set(key, now)
  return true // 允许请求
}

export function getRemainingTime(key: string, limitMs: number = 3000): number {
  const now = Date.now()
  const lastRequest = rateLimitMap.get(key)
  
  if (!lastRequest) return 0
  
  const remaining = limitMs - (now - lastRequest)
  return Math.max(0, Math.ceil(remaining / 1000))
}

