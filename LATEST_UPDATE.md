# Seedance Video Generator - 更新说明

## 最新更新 (2026-02-22)

### 1. 数据库表创建

创建了 `supabase_schema.sql` 文件，包含：

**video_generations 表**
- 存储视频生成记录
- 字段：id, user_id, mode, prompt, aspect_ratio, video_url, task_id, status, duration, resolution, created_at, updated_at
- 包含 RLS (Row Level Security) 策略，确保用户只能访问自己的记录

**subscriptions 表**
- 存储用户订阅信息
- 字段：id, user_id, plan, status, price, start_date, end_date, paypal_subscription_id, created_at, updated_at
- 包含 RLS 策略

**使用方法：**
1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 复制 `supabase_schema.sql` 的内容并执行

### 2. 切换到 Doubao Seedance 1.5 Pro

根据官方文档更新了 API 集成：

**主要变化：**
- 模型：`doubao-seedance-1-5-pro-251215`
- API 端点：`https://ark.cn-beijing.volces.com/api/v3/video/submit`
- 请求格式：使用新的参数结构（ratio, duration, resolution, generate_audio, watermark, camera_fixed）
- 图片模式：
  - 单张图片：首帧图生视频（role: "first_frame"）
  - 两张图片：首尾帧图生视频（role: "first_frame" 和 "last_frame"）

**新增参数：**
```json
{
  "model": "doubao-seedance-1-5-pro-251215",
  "content": [...],
  "ratio": "16:9",
  "duration": 5,
  "resolution": "720p",
  "generate_audio": true,
  "watermark": false,
  "camera_fixed": false
}
```

### 3. 异步任务处理

Seedance 1.5 Pro 使用异步任务模式：

**新增 API：**
- `/api/check-task.ts` - 查询任务状态

**前端轮询机制：**
- 提交任务后获得 task_id
- 每 5 秒轮询一次任务状态
- 最多轮询 120 次（10 分钟）
- 状态：queued → running → succeeded/failed/expired

**任务状态显示：**
- 实时显示任务 ID 和当前状态
- 动画效果提示处理进度

### 4. 环境变量更新

`.env.local` 需要配置：
```env
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_API_KEY=your_doubao_api_key
```

### 5. 文件变更

**修改的文件：**
- `pages/api/generate.ts` - 更新为 Seedance 1.5 Pro API 格式
- `pages/generate.tsx` - 添加任务轮询和状态显示

**新增的文件：**
- `pages/api/check-task.ts` - 任务状态查询 API
- `supabase_schema.sql` - 数据库表结构

### 6. 下一步操作

1. **创建数据库表：**
   - 在 Supabase 执行 `supabase_schema.sql`

2. **配置环境变量：**
   - 确保 `.env.local` 包含正确的 Seedance API 密钥

3. **重启开发服务器：**
   ```bash
   npm run dev
   ```

4. **测试视频生成：**
   - 文生视频：输入文本提示词
   - 图生视频：上传 1-2 张图片
   - 观察任务状态变化
   - 等待视频生成完成

### 7. API 文档参考

- Seedance 1.5 Pro 文档：https://www.volcengine.com/docs/82379/1520757
- 支持的功能：
  - 文生视频
  - 首帧图生视频
  - 首尾帧图生视频
  - 音频生成（generate_audio: true）
  - 多种分辨率和宽高比

### 8. 已知问题修复

- ✅ 修复了之前返回文本而非视频的问题
- ✅ 修复了 `parameters` 字段导致的 InvalidParameter 错误
- ✅ 添加了数据库表缺失的问题解决方案
- ✅ 实现了异步任务的正确处理流程

---

## 技术栈

- Next.js 14
- TypeScript
- Supabase (数据库 + 认证)
- Doubao Seedance 1.5 Pro (视频生成)
- PayPal (支付)
- Framer Motion (动画)
- Tailwind CSS (样式)


