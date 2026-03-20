-- ============================================================
-- 增量迁移：切换到每日免费配额（不删表，不丢数据）
-- 安全说明：
--   ✅ 不删除任何表
--   ✅ 不删除任何用户数据
--   ✅ auth.users 表（用户注册数据）完全不受影响
--   ✅ video_generations、subscriptions 表完全不受影响
--   ✅ 所有操作幂等，重复执行不会报错
-- 在 Supabase SQL Editor 中执行
-- ============================================================

-- 1. 如果 user_quotas 表不存在则创建（已存在则跳过）
CREATE TABLE IF NOT EXISTS user_quotas (
  id                            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_free_used               INTEGER NOT NULL DEFAULT 0,
  daily_reset_date              DATE    NOT NULL DEFAULT CURRENT_DATE,
  subscription_generations_used INTEGER NOT NULL DEFAULT 0,
  created_at                    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at                    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 如果表已存在但缺少新列，则添加（已存在则跳过）
ALTER TABLE user_quotas
  ADD COLUMN IF NOT EXISTS daily_free_used               INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_reset_date              DATE    NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS subscription_generations_used INTEGER NOT NULL DEFAULT 0;

-- 3. 用旧列数据初始化新列（仅当旧列存在时）
--    free_generations_used >= 1 的用户今天已用过，标记为 1
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_quotas' AND column_name = 'free_generations_used'
  ) THEN
    UPDATE user_quotas
    SET
      daily_free_used  = CASE WHEN free_generations_used >= 1 THEN 1 ELSE 0 END,
      daily_reset_date = CURRENT_DATE
    WHERE daily_free_used = 0;
  END IF;
END;
$$;

-- 4. 启用 RLS（已启用则跳过）
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;

-- 5. 补全 RLS 策略（已存在则跳过，不会报错）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_quotas' AND policyname = 'Users can view their own quotas'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can view their own quotas"
        ON user_quotas FOR SELECT
        USING (auth.uid() = user_id)
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_quotas' AND policyname = 'Users can insert their own quotas'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can insert their own quotas"
        ON user_quotas FOR INSERT
        WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_quotas' AND policyname = 'Users can update their own quotas'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can update their own quotas"
        ON user_quotas FOR UPDATE
        USING (auth.uid() = user_id)
    $policy$;
  END IF;
END;
$$;

-- 6. 原子递增函数：每日免费次数（跨天自动重置）
CREATE OR REPLACE FUNCTION increment_daily_free_usage(uid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_quotas
  SET
    daily_free_used  = CASE
                         WHEN daily_reset_date < CURRENT_DATE THEN 1
                         ELSE daily_free_used + 1
                       END,
    daily_reset_date = CURRENT_DATE,
    updated_at       = NOW()
  WHERE user_id = uid;
END;
$$;

-- 7. 原子递增函数：订阅用户使用量（统计用）
CREATE OR REPLACE FUNCTION increment_subscription_usage(uid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_quotas
  SET
    subscription_generations_used = subscription_generations_used + 1,
    updated_at = NOW()
  WHERE user_id = uid;
END;
$$;

-- 8. 授权给登录用户调用
GRANT EXECUTE ON FUNCTION increment_daily_free_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_subscription_usage(UUID) TO authenticated;

-- ============================================================
-- 完成！验证数据完整性：
-- SELECT count(*) FROM auth.users;           -- 用户数不变
-- SELECT count(*) FROM video_generations;    -- 视频记录不变
-- SELECT user_id, daily_free_used, daily_reset_date FROM user_quotas;
-- ============================================================
