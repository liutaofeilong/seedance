# 🎬 Seedance AI - AI视频生成平台

<div align="center">

![Seedance AI](https://img.shields.io/badge/Seedance-AI%20Video%20Generator-00D9FF?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=for-the-badge&logo=supabase)

专业的AI视频生成平台 | 文生视频 · 图生视频 · 多模型支持

[在线演示](https://seedance.ai) · [部署指南](./DEPLOYMENT.md) · [报告问题](https://github.com/yourusername/seedance/issues)

</div>

---

## ✨ 核心功能

### 🎥 视频生成
- **文生视频 (Text-to-Video)** - 输入文字描述，AI 自动生成视频
- **图生视频 (Image-to-Video)** - 上传图片，生成动态视频
- **多帧生成** - 支持首帧、尾帧、多帧（最多10帧）生成

### 🤖 AI 模型
- Seedance 2.0 - 最新实验模型
- Seedance 1.5 Pro - 推荐，支持音频
- Seedance 1.0 系列 - 稳定快速

### ⚙️ 灵活配置
- 多种宽高比：21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- 分辨率选择：480p, 720p, 1080p
- 时长控制：3-10秒
- 音频生成、水印、镜头控制

### 💳 订阅系统
- 免费试用：1次生成
- 月度订阅：$50/月，无限生成
- 季度订阅：$125/3个月，节省 $25
- 年度订阅：$400/年，节省 $200

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: React Hooks

### 后端
- **API**: Next.js API Routes
- **认证**: Supabase Auth
- **数据库**: Supabase (PostgreSQL)
- **存储**: Supabase Storage
- **支付**: PayPal

### AI 服务
- **视频生成**: 豆包 Seedance API
- **模型**: Doubao Seed 2.0 Pro

## 📦 项目结构

```
seedance/
├── components/          # React 组件
│   ├── Navbar.tsx      # 导航栏
│   ├── Hero.tsx        # 首页 Hero
│   ├── Features.tsx    # 功能展示
│   ├── Pricing.tsx     # 价格方案
│   └── Footer.tsx      # 页脚
├── pages/              # Next.js 页面
│   ├── index.tsx       # 首页
│   ├── generate.tsx    # 视频生成页
│   ├── login.tsx       # 登录页
│   ├── signup.tsx      # 注册页
│   ├── checkout.tsx    # 支付页
│   └── api/            # API 路由
│       ├── generate.ts # 视频生成 API
│       └── check-task.ts # 任务状态查询
├── lib/                # 工具库
│   ├── supabase.ts     # Supabase 客户端
│   └── rateLimit.ts    # 速率限制
├── styles/             # 全局样式
├── public/             # 静态资源
└── supabase-schema.sql # 数据库结构

```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/seedance.git
cd seedance
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

Windows PowerShell:
```powershell
.\setup-env.ps1
```

或手动创建 `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SEEDANCE_API_KEY=your_seedance_api_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 4. 设置数据库

在 Supabase SQL Editor 中执行 `supabase-schema.sql`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📖 详细文档

- [部署指南](./DEPLOYMENT.md) - 生产环境部署说明
- [数据库结构](./supabase-schema.sql) - Supabase 表结构

## 🎨 功能亮点

### 智能图片压缩
- 自动检测图片大小
- 动态调整压缩质量
- 保持高质量输出

### 实时任务追踪
- 异步任务轮询
- 进度状态显示
- 友好的错误提示

### 速率限制保护
- 客户端请求限制
- 防止频繁点击
- 提升用户体验

### SEO 优化
- 结构化数据
- 动态 Meta 标签
- 语义化 HTML

## 🔐 安全特性

- ✅ JWT Token 认证
- ✅ Row Level Security (RLS)
- ✅ 环境变量隔离
- ✅ 客户端速率限制
- ✅ HTTPS 强制（生产）

## 📊 性能优化

- ✅ Next.js 增量静态生成
- ✅ 图片懒加载
- ✅ 代码分割
- ✅ API 请求缓存
- ✅ 数据库索引优化

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue！

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [豆包 AI](https://www.volcengine.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

Made with ❤️ by Seedance Team

[Website](https://seedance.ai) · [Twitter](https://twitter.com/seedance) · [Discord](https://discord.gg/seedance)

</div>
