-- 创建视频生成记录表
CREATE TABLE IF NOT EXISTS public.video_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode VARCHAR(50) NOT NULL, -- 'text' 或 'image'
  prompt TEXT NOT NULL,
  aspect_ratio VARCHAR(10) DEFAULT '16:9',
  video_url TEXT,
  task_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  duration INTEGER, -- 视频时长（秒）
  resolution VARCHAR(10), -- 分辨率，如 '720p', '1080p'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_video_generations_user_id ON public.video_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_task_id ON public.video_generations(task_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_created_at ON public.video_generations(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能查看自己的视频生成记录
CREATE POLICY "Users can view their own video generations"
  ON public.video_generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- 创建 RLS 策略：用户可以插入自己的视频生成记录
CREATE POLICY "Users can insert their own video generations"
  ON public.video_generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建 RLS 策略：用户可以更新自己的视频生成记录
CREATE POLICY "Users can update their own video generations"
  ON public.video_generations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 创建订阅表（如果还没有）
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  price DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paypal_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订阅表索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 启用订阅表的 RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 订阅表 RLS 策略
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

