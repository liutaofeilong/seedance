# 🚀 Vercel 部署前检查清单

## ✅ 已修复的问题

1. ✅ 删除了 `pages/api/stripe/` 文件夹（使用了未安装的 stripe 包）
2. ✅ 修复了 `lib/supabase.ts` 构建时的环境变量检查
3. ✅ 修复了 `pages/checkout.tsx` 的错误处理和 PayPal 配置检查
4. ✅ 修复了 `pages/api/generate.ts` 的 TypeScript 类型错误
5. ✅ 修复了 `pages/api/check-task.ts` 的视频 URL 解析和超时处理

## 📋 部署步骤

### 1. 删除未使用的文件（如果还存在）

在 PowerShell 中运行：
```powershell
cd d:/AI/seedance
Remove-Item -Path "pages/api/auth" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "pages/api/stripe" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "lib/mongodb.ts" -Force -ErrorAction SilentlyContinue
```

### 2. 本地测试构建

```bash
npm run build
```

如果构建成功，继续下一步。

### 3. 在 Vercel 中配置环境变量

进入 Vercel 项目设置 → Environment Variables，添加：

**必需变量：**
```
NEXT_PUBLIC_SUPABASE_URL=https://olqcbssdcedbagxqitjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
SEEDANCE_API_KEY=你的_seedance_api_key
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
```

**可选变量（支付功能）：**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的_paypal_client_id
```

⚠️ **重要**：确保为所有环境（Production, Preview, Development）都添加这些变量。

### 4. 部署到 Vercel

```bash
git add .
git commit -m "Fix all Vercel build issues"
git push
```

或者在 Vercel Dashboard 中点击 "Redeploy"。

## 🔍 验证部署

部署成功后，测试以下页面：

- ✅ `/` - 首页应该正常显示
- ✅ `/generate` - 视频生成页面（需要登录）
- ✅ `/pricing` - 定价页面
- ✅ `/login` - 登录页面
- ✅ `/signup` - 注册页面

## 🐛 常见问题排查

### 问题 1：构建失败 - Missing Supabase environment variables
**解决方案**：
- 确保在 Vercel 中添加了 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 变量名必须完全匹配（区分大小写）
- 确保选择了所有环境（Production, Preview, Development）

### 问题 2：构建失败 - Cannot find module 'stripe' or 'next-auth'
**解决方案**：
- 确保已删除 `pages/api/stripe` 和 `pages/api/auth` 文件夹
- 运行 `npm run build` 本地验证

### 问题 3：运行时错误 - Network timeout
**解决方案**：
- 这是网络连接问题，不是代码问题
- 代码已经添加了超时重试机制
- 建议使用稳定的网络环境或配置代理

### 问题 4：PayPal 按钮不显示
**解决方案**：
- 添加 `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 环境变量
- 或者暂时不使用支付功能（会显示提示信息）

## 📊 项目架构

**使用的技术栈：**
- ✅ Next.js 14 - 前端框架
- ✅ Supabase - 数据库和认证
- ✅ 豆包 Seedance API - AI 视频生成
- ✅ PayPal - 支付处理
- ✅ Tailwind CSS + Framer Motion - UI 和动画

**不使用的技术（已移除）：**
- ❌ Stripe - 使用 PayPal 代替
- ❌ NextAuth - 使用 Supabase Auth 代替
- ❌ MongoDB - 使用 Supabase PostgreSQL 代替

## 🎉 部署成功标志

当你看到以下内容时，说明部署成功：
- ✅ Vercel 构建日志显示 "Build Completed"
- ✅ 访问部署的 URL 能看到首页
- ✅ 可以注册/登录账号
- ✅ 可以访问视频生成页面

祝部署顺利！🚀








