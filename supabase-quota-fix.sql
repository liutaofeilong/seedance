-- ============================================================
-- Quota Fix Migration — Daily Free Tier (1 video/day)
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- 1. Drop old quota table and recreate with daily-reset columns
DROP TABLE IF EXISTS user_quotas CASCADE;

CREATE TABLE user_quotas (
  id                            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Daily free tier tracking
  daily_free_used               INTEGER NOT NULL DEFAULT 0,
  daily_reset_date              DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Subscription usage tracking (informational)
  subscription_generations_used INTEGER NOT NULL DEFAULT 0,
  created_at                    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at                    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_quotas_user_id ON user_quotas(user_id);

-- 2. Enable RLS
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quotas"
  ON user_quotas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotas"
  ON user_quotas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotas"
  ON user_quotas FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_quotas_updated_at ON user_quotas;
CREATE TRIGGER update_user_quotas_updated_at
  BEFORE UPDATE ON user_quotas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Atomic daily-free increment
--    Resets the counter if the stored date is before today, then increments.
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

-- 5. Atomic subscription usage increment (informational counter)
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

-- 6. Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION increment_daily_free_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_subscription_usage(UUID) TO authenticated;

-- Done. Verify with:
-- SELECT user_id, daily_free_used, daily_reset_date FROM user_quotas;
