# Seedance 2.0 多图片上传功能

## ✅ 已完成的优化

### 功能说明

根据选择的模型，图片上传限制不同：

#### Seedance 2.0 模型
- ✅ 支持上传最多 **10 张图片**
- ✅ 多帧视频生成
- ✅ 支持批量选择（multiple 属性）
- ✅ 图片预览采用 5 列网格布局
- ✅ 显示 "Frame 1", "Frame 2", ... "Frame 10"

#### 其他模型（1.5 Pro, 1.0 Pro, Lite 等）
- ✅ 支持上传最多 **2 张图片**
- ✅ 首帧/尾帧视频生成
- ✅ 单张选择
- ✅ 图片预览采用 2 列网格布局
- ✅ 显示 "First Frame", "Last Frame"

## 🎨 UI 优化

### 上传提示文本
- **Seedance 2.0**: "🎨 Seedance 2.0: Upload up to 10 images for multi-frame video generation"
- **其他模型**: "Upload 1 image for first-frame generation, or 2 images for first-last frame generation"

### 上传按钮
- **Seedance 2.0**: "Click to upload images (multiple)" + "Maximum 10 images"
- **其他模型**: "Click to upload image" + "Maximum 2 images"

### 图片预览网格
- **Seedance 2.0**: 响应式 5 列布局
  - 移动端: 2 列
  - 平板: 3 列
  - 桌面: 5 列
- **其他模型**: 固定 2 列布局

### 图片标签
- **Seedance 2.0**: Frame 1, Frame 2, Frame 3...
- **其他模型**: First Frame, Last Frame

## 🔧 技术实现

### 动态限制
```typescript
const maxImages = selectedModel === 'doubao-seedance-2-0' ? 10 : 2
```

### Multiple 属性
```tsx
<input
  type="file"
  multiple={selectedModel === 'doubao-seedance-2-0'}
  onChange={handleImageUpload}
/>
```

### 响应式网格
```tsx
<div className={`grid gap-4 ${
  selectedModel === 'doubao-seedance-2-0' 
    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' 
    : 'grid-cols-2'
}`}>
```

## 📋 修改的文件

- `pages/generate.tsx` - 添加多图片上传支持

## 🚀 部署

```bash
git add pages/generate.tsx
git commit -m "Add multi-image upload support for Seedance 2.0 (up to 10 images)"
git push
```

## 🎯 用户体验

1. **智能提示**: 根据选择的模型显示不同的上传说明
2. **批量上传**: Seedance 2.0 支持一次选择多张图片
3. **清晰标识**: 每张图片都有明确的帧序号
4. **响应式布局**: 在不同设备上都有良好的显示效果
5. **图片压缩**: 所有图片自动压缩到 1920x1080，避免上传失败

## 📸 效果预览

### Seedance 2.0
- 可以一次选择多张图片（最多10张）
- 图片以 5 列网格显示
- 每张图片标记为 Frame 1-10

### 其他模型
- 单张或两张图片上传
- 图片以 2 列显示
- 标记为 First Frame / Last Frame

完成！🎉


