# Seedance AI - 部署指南

## 📋 前置要求

- Node.js 18+ 
- npm 或 yarn
- Supabase 账号
- 豆包 API 密钥
- PayPal 开发者账号

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

运行自动配置脚本（Windows PowerShell）：

```powershell
.\setup-env.ps1
```

或手动创建 `.env.local` 文件并填入以下内容：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Seedance API (豆包)
SEEDANCE_API_KEY=your_seedance_api_key
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_MODEL=doubao-seed-2-0-pro-260215

# PayPal Payment
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 3. 设置 Supabase 数据库

1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 执行 `supabase-schema.sql` 中的 SQL 语句
4. 启用 Email Authentication

### 4. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 生产部署

#### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 配置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SEEDANCE_API_KEY
vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID
```

#### 其他平台

支持任何支持 Next.js 的平台：
- Netlify
- Railway
- AWS Amplify
- 自托管服务器

## 🔧 配置说明

### Supabase 配置

1. 创建新项目
2. 获取 Project URL 和 anon key
3. 在 Authentication 中启用 Email provider
4. 执行数据库迁移脚本

### 豆包 API 配置

1. 访问 [火山引擎控制台](https://console.volcengine.com/)
2. 开通 Seedance 服务
3. 创建 API Key
4. 配置到环境变量

### PayPal 配置

1. 访问 [PayPal Developer](https://developer.paypal.com/)
2. 创建应用获取 Client ID
3. 配置 Webhook（可选）
4. 测试环境使用 Sandbox credentials

## 📊 性能优化

- ✅ 图片自动压缩（前端）
- ✅ 客户端速率限制
- ✅ API 请求重试机制
- ✅ 数据库索引优化
- ✅ Next.js 生产构建优化

## 🔒 安全特性

- ✅ Supabase Row Level Security (RLS)
- ✅ JWT Token 认证
- ✅ 客户端速率限制
- ✅ 环境变量隔离
- ✅ HTTPS 强制（生产环境）

## 📝 常见问题

### Q: 视频生成失败？
A: 检查豆包 API 密钥是否正确，查看浏览器控制台和服务器日志

### Q: 支付不工作？
A: 确认 PayPal Client ID 已正确配置，检查是否使用了 Sandbox 环境

### Q: 图片上传失败？
A: 确保图片小于 30MB，格式为 JPG/PNG/WebP

## 🆘 技术支持

- 文档：查看项目 README
- Issues：GitHub Issues
- Email：support@seedance.ai

## 📄 许可证

MIT License

