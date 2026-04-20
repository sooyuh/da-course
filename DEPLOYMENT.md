# Cloudflare Pages 部署指南

## Cloudflare Pages 配置

### 1. 项目设置

在 Cloudflare Pages 中创建新项目时，请使用以下配置：

**构建设置：**
- **构建命令：** `npm run build`
- **输出目录：** `dist`
- **根目录：** `frontend` (如果您的仓库根目录不是 `frontend` 目录，请相应调整)

### 2. Node 版本

确保在 Cloudflare Pages 的环境变量中设置 Node 版本（可选但推荐）：
- **环境变量键：** `NODE_VERSION`
- **值：** `18` 或 `20`

### 3. 部署流程

1. **连接 GitHub 仓库**
2. **选择分支：** `master` 或 `main`
3. **配置构建设置：**
   - 框架预设：Vite
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - 根目录：`frontend`
4. **保存并部署**

## 常见部署问题及解决方案

### 问题1：构建命令找不到文件

**错误信息：** `Could not find a required file.`

**解决方案：**
- 确保根目录设置正确。如果您的项目在 `frontend` 文件夹中，根目录应设置为 `frontend`
- 检查 `package.json` 是否存在于根目录中

### 问题2：构建失败，缺少依赖

**错误信息：** `Module not found`

**解决方案：**
- 确保 `package.json` 和 `package-lock.json` 都已提交到仓库
- 检查 `.gitignore` 是否错误地排除了必要的文件

### 问题3：路由刷新显示404

**错误信息：** 刷新页面后显示 404 错误

**解决方案：**
- 我已创建 `_redirects` 文件，该文件会在部署时自动处理 SPA 路由
- 文件路径：`frontend/_redirects`
- 内容：`/*    /index.html   200`

### 问题4：API 请求失败

**错误信息：** API 请求返回 500 或连接错误

**解决方案：**
- 当前项目使用本地后端（Flask），需要单独部署后端
- Cloudflare Pages 仅部署前端，后端需要部署到其他平台（如 Railway、Render、Vercel 等）
- 需要修改前端的 API 基础 URL 配置

## 项目文件结构

确保您的仓库包含以下文件：

```
/workspace/
├── frontend/
│   ├── src/
│   ├── dist/ (构建输出，不需要提交)
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── _redirects (新增)
│   └── ...
└── backend/
    └── ...
```

## 提交更改

在重新部署之前，请确保提交新添加的文件：

```bash
git add frontend/_redirects DEPLOYMENT.md
git commit -m "Add deployment configuration and documentation"
git push origin master
```

## 验证部署

部署成功后，您可以：
1. 访问您的 Cloudflare Pages 域名
2. 测试所有页面路由
3. 检查资源加载是否正常

## 后续优化

1. **部署后端服务**：考虑使用 Railway、Render 或 Vercel 部署 Flask 后端
2. **环境变量**：在 Cloudflare Pages 中配置 API 基础 URL
3. **监控**：设置 Cloudflare Analytics 监控网站性能

如需更多帮助，请参考 Cloudflare Pages 官方文档：https://developers.cloudflare.com/pages/
