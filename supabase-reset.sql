-- 清理并重新创建 Supabase 数据库表结构
-- 在 Supabase SQL Editor 中执行

-- 1. 删除现有的策略（如果存在）
DROP POLICY IF EXISTS "Users can view their own video generations" ON video_generations;
DROP POLICY IF EXISTS "Users can insert their own video generations" ON video_generations;
DROP POLICY IF EXISTS "Users can update their own video generations" ON video_generations;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view their own quotas" ON user_quotas;
DROP POLICY IF EXISTS "Users can update their own quotas" ON user_quotas;

-- 2. 删除现有的表（如果存在）
DROP TABLE IF EXISTS video_generations CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_quotas CASCADE;

-- 3. 创建视频生成记录表
CREATE TABLE video_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('text', 'image')),
  prompt TEXT,
  aspect_ratio TEXT DEFAULT '16:9',
  resolution TEXT DEFAULT '720p',
  duration INTEGER DEFAULT 5,
  video_url TEXT,
  task_id TEXT UNIQUE,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建订阅记录表
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly-plan', 'quarterly-plan', 'annual-plan')),
  amount DECIMAL(10, 2) NOT NULL,
  paypal_order_id TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建用户配额表
CREATE TABLE user_quotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  free_generations_used INTEGER DEFAULT 0,
  free_generations_limit INTEGER DEFAULT 1,
  subscription_generations_used INTEGER DEFAULT 0,
  reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建索引
CREATE INDEX idx_video_generations_user_id ON video_generations(user_id);
CREATE INDEX idx_video_generations_task_id ON video_generations(task_id);
CREATE INDEX idx_video_generations_status ON video_generations(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 7. 启用行级安全策略
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;

-- 8. 创建 RLS 策略
CREATE POLICY "Users can view their own video generations"
  ON video_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video generations"
  ON video_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video generations"
  ON video_generations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quotas"
  ON user_quotas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotas"
  ON user_quotas FOR UPDATE
  USING (auth.uid() = user_id);

-- 9. 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. 创建触发器
CREATE TRIGGER update_video_generations_updated_at
  BEFORE UPDATE ON video_generations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_quotas_updated_at
  BEFORE UPDATE ON user_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

