# 视频生成功能测试指南

## 当前状态

✅ 已完成功能：
- 多图片上传（最多5张）
- 图片引用功能（@图片1, @图片2...）
- 视频比例选择（6种比例）
- 豆包 Seed 2.0 API 集成
- 详细的错误日志

## 可能的失败原因

### 1. 网络连接问题 ⚠️
豆包 API 地址：`https://ark.cn-beijing.volces.com`

**解决方案**：
- 需要使用 VPN 访问（如果在国外）
- 检查网络连接
- 查看浏览器控制台的详细错误信息

### 2. API 认证问题
- API Key: `dfcd99a2-5a3e-4ff7-ba20-bda48eeaebab`
- 模型: `doubao-seed-2-0-pro-260215`

**检查步骤**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 尝试生成视频
4. 查看详细的日志输出

### 3. 用户认证问题
**解决方案**：
- 确保已登录
- 刷新页面重新登录
- 检查 Supabase 连接

## 测试步骤

### 文生视频测试：
```
1. 访问 http://localhost:3003/generate
2. 确保已登录
3. 点击 "Text to Video"
4. 输入提示词：
   "一个美丽的日落场景，海边有飞鸟"
5. 选择比例：16:9
6. 点击 "Generate Video"
7. 查看控制台日志
```

### 图生视频测试：
```
1. 点击 "Image to Video"
2. 上传 1-3 张图片
3. 点击图片上的 @ 按钮插入引用
4. 输入提示词：
   "@图片1 的场景，@图片2 的人物在移动"
5. 选择比例：16:9
6. 点击 "Generate Video"
7. 查看控制台日志
```

## 查看详细日志

### 后端日志（终端）：
```
- User authenticated: xxx@xxx.com
- Request params: { mode, aspectRatio, imageCount }
- Image 1 uploaded: xxx.jpg
- Calling Seedance API...
- API Config: { url, model, hasApiKey, aspectRatio }
- Response status: 200 OK
- Response data: { ... }
```

### 前端日志（浏览器控制台）：
```
- Generation error: xxx
- Error: xxx
```

## 常见错误及解决

### "Unauthorized - Please sign in"
- 重新登录
- 清除浏览器缓存

### "Network Error: fetch failed"
- 检查 VPN 连接
- 确认 API 地址可访问
- 检查防火墙设置

### "API Error: ..."
- 检查 API Key 是否正确
- 检查模型名称是否正确
- 查看 API 返回的具体错误信息

## 调试技巧

1. **查看完整请求**：
   - 打开 Network 标签
   - 找到 `/api/generate` 请求
   - 查看 Request Headers 和 Request Payload

2. **查看完整响应**：
   - 点击请求
   - 查看 Response 标签
   - 查看返回的错误信息

3. **测试 API 连接**：
   ```bash
   curl https://ark.cn-beijing.volces.com/api/v3/responses \
   -H "Authorization: Bearer dfcd99a2-5a3e-4ff7-ba20-bda48eeaebab" \
   -H 'Content-Type: application/json' \
   -d '{
       "model": "doubao-seed-2-0-pro-260215",
       "input": [{
           "role": "user",
           "content": [{
               "type": "input_text",
               "text": "测试"
           }]
       }]
   }'
   ```

## 下一步优化

如果 API 调用成功但视频生成失败，可能需要：
1. 调整请求参数格式
2. 添加更多的 API 参数
3. 实现异步轮询机制（如果 API 是异步的）
4. 添加任务状态查询功能

## 联系支持

如果问题持续存在：
1. 收集完整的错误日志
2. 检查豆包 API 文档
3. 确认 API Key 的权限和配额

