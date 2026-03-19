# 更新环境变量
Write-Host "正在更新 .env.local 文件..." -ForegroundColor Green

$envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ethyobiqkeiwvpjwbfbq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_MSEKJ3BWpMOLli0onvVG7w_DRclzW0n

# Seedance API (豆包 Seed 2.0 Pro)
SEEDANCE_API_KEY=dfcd99a2-5a3e-4ff7-ba20-bda48eeaebab
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_MODEL=doubao-seed-2-0-pro-260215

# PayPal Payment
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Stripe Payment (备用)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8 -Force

Write-Host "环境变量已更新！" -ForegroundColor Green
Write-Host "新的 Supabase URL: https://ethyobiqkeiwvpjwbfbq.supabase.co" -ForegroundColor Cyan

