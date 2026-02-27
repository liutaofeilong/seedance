# Vercel Deployment Guide

## Required Environment Variables

在 Vercel 项目设置中添加以下环境变量：

### 1. Supabase (必需)
```
NEXT_PUBLIC_SUPABASE_URL=https://olqcbssdcedbagxqitjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Seedance API (必需)
```
SEEDANCE_API_KEY=your_seedance_api_key
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
```

### 3. PayPal (可选 - 如果使用支付功能)
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 部署步骤

1. **删除未使用的文件**（如果还存在）：
   ```bash
   rm -rf pages/api/auth
   rm -rf pages/api/stripe
   rm -f lib/mongodb.ts
   ```

2. **推送到 Git**：
   ```bash
   git add .
   git commit -m "Fix Vercel build issues"
   git push
   ```

3. **在 Vercel 中配置环境变量**：
   - 进入项目设置 → Environment Variables
   - 添加上述所有必需的环境变量
   - 确保选择 Production, Preview, Development 环境

4. **重新部署**：
   - Vercel 会自动触发部署
   - 或手动点击 "Redeploy"

## 常见问题

### 构建失败：Missing Supabase environment variables
- 确保在 Vercel 中添加了 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 环境变量名必须完全匹配（区分大小写）

### 构建失败：Cannot find module 'stripe'
- 确保已删除 `pages/api/stripe` 文件夹
- 项目使用 PayPal 而不是 Stripe

### 运行时错误：PayPal is not configured
- 添加 `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 环境变量
- 或者暂时不使用支付功能

## 验证部署

部署成功后，访问以下页面确认：
- `/` - 首页
- `/generate` - 视频生成页面（需要登录）
- `/pricing` - 定价页面
- `/login` - 登录页面


