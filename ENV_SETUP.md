# 环境变量配置说明

## 重要：创建 .env.local 文件

请在项目根目录创建 `.env.local` 文件，并复制以下内容：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://olqcbssdcedbagxqitjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_M71vpAs91CFPxef6-BlItQ_-1dS6g54

# Seedance API (豆包 Seed 2.0 Pro)
SEEDANCE_API_KEY=dfcd99a2-5a3e-4ff7-ba20-bda48eeaebab
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_MODEL=doubao-seed-2-0-pro-260215

# Stripe Payment (可选，用于支付功能)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 配置步骤

1. **复制文件**：
   ```bash
   # Windows PowerShell
   Copy-Item env.example.txt .env.local
   
   # 或者手动创建 .env.local 文件并粘贴上面的内容
   ```

2. **重启开发服务器**：
   ```bash
   npm run dev
   ```

## 已配置的服务

### ✅ Supabase (数据库 + 认证)
- URL: `https://olqcbssdcedbagxqitjo.supabase.co`
- 已配置 Google OAuth 登录

### ✅ 豆包 Seed 2.0 Pro (视频生成)
- API Key: `dfcd99a2-5a3e-4ff7-ba20-bda48eeaebab`
- 模型: `doubao-seed-2-0-pro-260215`
- 支持文生视频和图生视频

## 功能清单

- ✅ 视频比例选择 (1:1, 3:4, 4:3, 9:16, 16:9, 21:9)
- ✅ Logo 展示
- ✅ 个人中心 (修改密码、修改头像、会员状态)
- ✅ Google 登录
- ✅ 豆包 Seed 2.0 API 集成
- ✅ Supabase 数据库

## 注意事项

⚠️ **重要**：`.env.local` 文件包含敏感信息，已被 `.gitignore` 忽略，不会提交到 Git。

## 故障排除

如果遇到 "Missing Supabase environment variables" 错误：

1. 确认 `.env.local` 文件存在于项目根目录
2. 确认文件内容正确
3. 重启开发服务器
4. 清除 Next.js 缓存：`Remove-Item -Recurse -Force .next`


