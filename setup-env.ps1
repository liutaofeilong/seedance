# 快速设置环境变量
Write-Host "正在创建 .env.local 文件..." -ForegroundColor Green

$envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://olqcbssdcedbagxqitjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_M71vpAs91CFPxef6-BlItQ_-1dS6g54

# Seedance API (豆包 Seed 2.0 Pro)
SEEDANCE_API_KEY=dfcd99a2-5a3e-4ff7-ba20-bda48eeaebab
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_MODEL=doubao-seed-2-0-pro-260215

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ .env.local 文件创建成功！" -ForegroundColor Green
Write-Host ""
Write-Host "现在可以运行: npm run dev" -ForegroundColor Cyan


