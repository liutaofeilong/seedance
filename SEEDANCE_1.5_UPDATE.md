# Seedance 1.5 Pro 集成更新

## 更新时间：2026-02-22

## 主要更新

### 1. 添加模型分类选择

新增了模型分类系统，用户可以选择不同类型的 AI 模型：

**语言模型：**
- 视觉理解（即将推出）
- 文本生成（即将推出）

**视觉模型：**
- ✅ 视频生成（已启用 - Doubao Seedance 1.5 Pro）
- 图片生成（即将推出）
- 3D生成（即将推出）

### 2. 正确对接 Doubao Seedance 1.5 Pro

根据官方文档完整对接了 REST API：

#### API 端点更新

**创建任务：**
```
POST https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks
```

**查询任务：**
```
GET https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/{id}
```

#### 请求格式

```json
{
  "model": "doubao-seedance-1-5-pro-251215",
  "content": [
    {
      "type": "text",
      "text": "提示词 --duration 5 --camerafixed false --watermark false --ratio 16:9"
    },
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,..."
      }
    }
  ]
}
```

#### 参数说明

参数通过在文本提示词中添加标记来指定：

- `--duration 5` - 视频时长（秒）
- `--camerafixed false` - 是否固定镜头
- `--watermark false` - 是否添加水印
- `--ratio 16:9` - 视频宽高比

#### 响应格式

**创建任务响应：**
```json
{
  "id": "task_id_here",
  "status": "queued",
  ...
}
```

**查询任务响应：**
```json
{
  "id": "task_id_here",
  "status": "succeeded",
  "videos": [
    {
      "url": "https://...",
      "video_url": "https://..."
    }
  ],
  "last_frame_url": "https://..."
}
```

### 3. 文件变更

**修改的文件：**

1. `pages/generate.tsx`
   - 添加模型分类选择界面
   - 添加模型类型选择（语言/视觉）
   - 只在视频生成模式下显示相关选项

2. `pages/api/generate.ts`
   - 更新 API 端点为 `/contents/generations/tasks`
   - 参数通过文本标记方式传递
   - 自动添加默认参数（duration, camerafixed, watermark, ratio）

3. `pages/api/check-task.ts`
   - 更新查询端点为 `/contents/generations/tasks/{id}`
   - 从 `data.videos[0].url` 获取视频 URL
   - 正确处理响应格式

### 4. 使用方式

#### 文生视频
```
1. 选择"视觉模型" → "视频生成"
2. 选择"Text to Video"
3. 输入提示词：无人机以极快速度穿越复杂障碍或自然奇观
4. 点击"Generate Video"
5. 等待任务完成（自动轮询）
```

#### 图生视频（首帧）
```
1. 选择"视觉模型" → "视频生成"
2. 选择"Image to Video"
3. 上传1张图片
4. 输入动画描述
5. 点击"Generate Video"
```

#### 图生视频（首尾帧）
```
1. 选择"视觉模型" → "视频生成"
2. 选择"Image to Video"
3. 上传2张图片（第1张作为首帧，第2张作为尾帧）
4. 输入动画描述
5. 点击"Generate Video"
```

### 5. 环境变量

确保 `.env.local` 配置正确：

```env
# Seedance API
SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3
SEEDANCE_API_KEY=your_ark_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

### 6. 测试步骤

1. **确保数据库表已创建**
   ```bash
   # 在 Supabase SQL Editor 中执行 supabase_schema.sql
   ```

2. **重启开发服务器**
   ```bash
   npm run dev
   ```

3. **测试文生视频**
   - 访问 http://localhost:3000/generate
   - 选择"视觉模型" → "视频生成"
   - 输入提示词并生成

4. **观察日志**
   - 查看终端输出的 API 请求和响应
   - 确认任务 ID 正确返回
   - 观察轮询状态变化

### 7. API 调用流程

```
用户提交
    ↓
POST /api/generate
    ↓
POST /contents/generations/tasks (Seedance API)
    ↓
返回 task_id
    ↓
前端开始轮询（每5秒）
    ↓
GET /api/check-task?taskId=xxx
    ↓
GET /contents/generations/tasks/{id} (Seedance API)
    ↓
status: queued → running → succeeded
    ↓
返回 videos[0].url
    ↓
显示视频
```

### 8. 错误处理

- 如果 API 返回错误，会显示在界面上
- 任务超时时间：10分钟（120次轮询 × 5秒）
- 失败的任务会在数据库中标记为 'failed'

### 9. 下一步计划

- [ ] 添加其他模型类型（图片生成、3D生成等）
- [ ] 添加语言模型功能（视觉理解、文本生成）
- [ ] 优化轮询机制（WebSocket 实时更新）
- [ ] 添加视频历史记录页面
- [ ] 支持批量生成

---

## 参考文档

- Seedance 1.5 Pro 官方文档：https://www.volcengine.com/docs/82379/1520757
- REST API 调用示例：https://www.volcengine.com/docs/82379/1521675


