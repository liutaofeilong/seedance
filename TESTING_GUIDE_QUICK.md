# 快速测试指南

## 准备工作

### 1. 创建数据库表
在 Supabase Dashboard → SQL Editor 中执行：
```sql
-- 复制 supabase_schema.sql 的内容并执行
```

### 2. 配置环境变量
确保 `.env.local` 包含：
```env
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_API_KEY=你的豆包API密钥
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 3. 启动服务器
```bash
npm run dev
```

## 测试场景

### 场景1：文生视频（最简单）

1. 访问 http://localhost:3001/generate
2. 选择"视觉模型"
3. 选择"视频生成"
4. 选择"Text to Video"
5. 输入提示词：
   ```
   无人机以极快速度穿越复杂障碍或自然奇观，带来沉浸式飞行体验
   ```
6. 点击"Generate Video"
7. 观察：
   - 任务 ID 显示
   - 状态变化：queued → running → succeeded
   - 视频自动显示

### 场景2：图生视频（首帧）

1. 选择"Image to Video"
2. 上传1张图片
3. 输入描述：
   ```
   镜头缓慢推进，展现画面中的细节
   ```
4. 点击"Generate Video"
5. 等待生成完成

### 场景3：图生视频（首尾帧）

1. 选择"Image to Video"
2. 上传2张图片
3. 输入描述：
   ```
   从第一张图片平滑过渡到第二张图片
   ```
4. 点击"Generate Video"
5. 等待生成完成

## 检查点

### 终端日志应该显示：

```
User authenticated: your_email@example.com
Request params: { mode: 'text', aspectRatio: '16:9', ... }
Calling Seedance API...
API Config: { url: 'https://ark.cn-beijing.volces.com/api/v3', ... }
Request body: { "model": "doubao-seedance-1-5-pro-251215", ... }
Sending request to Seedance API...
Response status: 200 OK
Task submitted successfully, task ID: task_xxx
```

### 轮询日志：

```
Checking task status: task_xxx
Task status response: { "status": "queued", ... }
Checking task status: task_xxx
Task status response: { "status": "running", ... }
Checking task status: task_xxx
Task status response: { "status": "succeeded", "videos": [...] }
```

## 常见问题

### 1. 401 Unauthorized
- 检查 SEEDANCE_API_KEY 是否正确
- 确保已在豆包平台开通 Seedance 1.5 Pro

### 2. 404 Not Found
- 检查 API 端点是否正确
- 应该是 `/contents/generations/tasks`

### 3. 视频一直不显示
- 查看终端日志中的 `videos` 字段
- 确认 `data.videos[0].url` 存在
- 检查网络连接

### 4. 数据库错误
- 确保已执行 `supabase_schema.sql`
- 检查 Supabase 连接配置

## 成功标志

✅ 任务成功提交并返回 task_id
✅ 前端显示任务状态（queued/running）
✅ 轮询正常工作（每5秒一次）
✅ 任务完成后显示视频
✅ 数据库中保存了记录

## 下一步

测试成功后，可以：
1. 尝试不同的提示词
2. 测试不同的宽高比
3. 上传不同的图片
4. 查看 Supabase 中的生成记录

