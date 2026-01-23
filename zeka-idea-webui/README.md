# Zeka IDEA WebUI

<div align="center">

**Zeka Stack IntelliJ IDEA 插件的 Web 用户界面**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vite.dev)

</div>

---

## 项目简介

Zeka IDEA WebUI 是 Zeka Stack 生态系统中 IntelliJ IDEA 插件的 Web 用户界面，为用户提供了一个现代化的 Web 平台来浏览插件信息、提交功能反馈、查看统计数据等。

### 核心功能

- **插件展示** - 展示 Zeka Stack 系列插件（Javadoc、Changelog、Terminal、Tracer、Repairer、Engine）
- **功能反馈** - 用户可以提交功能请求、投票和评论
- **用户认证** - 支持 GitHub OAuth 登录
- **统计数据** - 展示插件使用统计和分析
- **更新日志** - 查看插件版本更新历史
- **设置管理** - 用户个性化设置

---

## 技术栈

### 前端框架

| 技术           | 版本   | 说明     |
|--------------|------|--------|
| React        | 19.2 | UI 框架  |
| TypeScript   | 5.9  | 类型安全   |
| Vite         | 7.2  | 构建工具   |
| Tailwind CSS | 3.4  | CSS 框架 |

### 主要依赖

- **lucide-react** - 图标库
- **react-markdown** - Markdown 渲染
- **highlight.js** - 代码高亮
- **rehype-highlight** - Markdown 代码高亮增强

---

## 快速开始

### 环境要求

- Node.js 18+
- pnpm（推荐）或 npm

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建产物将输出到 `dist/` 目录。

### 代码检查

```bash
pnpm lint
# 或
npm run lint
```

---

## 项目结构

```
zeka-idea-webui/
├── src/
│   ├── components/          # 通用组件
│   │   ├── Header.tsx       # 顶部导航
│   │   ├── Footer.tsx       # 底部信息
│   │   ├── RequestCard.tsx  # 反馈卡片
│   │   └── ...
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页
│   │   ├── FeatureRequests.tsx  # 功能反馈
│   │   ├── Statistics.tsx   # 统计数据
│   │   ├── plugins/         # 插件专属页面
│   │   └── ...
│   ├── lib/                 # 工具库
│   │   ├── api.ts           # API 接口
│   │   ├── auth.ts          # 认证管理
│   │   └── signature.ts     # 签名工具
│   ├── App.tsx              # 应用入口
│   └── main.tsx             # 主文件
├── public/                  # 静态资源
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
└── package.json             # 项目配置
```

---

## 路由配置

项目使用基于 Hash 的简单路由系统：

| 路由                    | 页面              | 说明           |
|-----------------------|-----------------|--------------|
| `#/`                  | Home            | 首页           |
| `#/feedback`          | FeatureRequests | 功能反馈         |
| `#/statistics`        | Statistics      | 统计数据         |
| `#/changelog`         | Changelog       | 更新日志         |
| `#/login`             | Login           | 登录页面         |
| `#/settings`          | Settings        | 设置页面         |
| `#/donate`            | Donate          | 捐赠页面         |
| `#/plugins/javadoc`   | JavadocHome     | Javadoc 插件   |
| `#/plugins/changelog` | ChangelogHome   | Changelog 插件 |
| `#/plugins/terminal`  | TerminalHome    | Terminal 插件  |
| `#/plugins/tracer`    | TracerHome      | Tracer 插件    |
| `#/plugins/repairer`  | RepairerHome    | Repairer 插件  |
| `#/plugins/engine`    | EngineHome      | Engine 插件    |

---

## API 集成

### 后端服务

WebUI 通过代理与后端 API 服务通信：

- **开发环境**: `http://127.0.0.1:8080/api`
- **生产环境**: 通过 Nginx 反向代理

### API 端点

主要 API 接口：

- `GET /api/projects/list` - 获取项目列表
- `GET /api/projects/feedbacks/list` - 获取反馈列表
- `POST /api/projects/feedbacks` - 创建反馈
- `POST /api/projects/feedbacks/{id}/vote` - 投票
- `GET /api/auth/me` - 获取认证状态

完整 API 文档请参考 [zeka-stack-api](../zeka-stack-api/README.md)。

---

## 部署

### 本地部署

```bash
# 1. 构建项目
pnpm build

# 2. 将 dist 目录部署到 Web 服务器
```

### 生产部署

项目包含部署脚本 `deploy.sh`：

```bash
./deploy.sh
```

### Nginx 配置

Nginx 配置示例参考 `zekastack.dong4j.site.conf`。

---

## 开发指南

### 添加新页面

1. 在 `src/pages/` 创建新组件
2. 在 `App.tsx` 中添加路由
3. 更新导航菜单（如需要）

### 修改样式

项目使用 Tailwind CSS，可直接在组件中使用 Tailwind 类名：

```tsx
<div className="bg-blue-500 text-white p-4 rounded">
  内容
</div>
```

### API 调用

使用 `src/lib/api.ts` 中定义的 API 函数：

```tsx
import {api} from './lib/api';

const projects = await api.getProjects();
```

---

## 环境变量

创建 `.env` 文件配置环境变量：

```env
# 后端 feedback 密钥, 主要用于 github issues 操作
VITE_FEEDBACK_SECRET=
```

---

## 本地开发 Mock

开发环境支持 Mock 用户认证，便于测试不同权限下的功能：

- **Admin 模式**: `http://localhost:5173?role=admin` - 模拟管理员登录，可管理反馈、修改状态等
- **User 模式**: `http://localhost:5173?role=user` - 模拟普通用户登录，可提交反馈、投票和评论
- **访客模式**: `http://localhost:5173?role=guest` - 访客模式，只能浏览内容

> 💡 **提示**: 功能反馈管理页面 (`/requests`) 需要 admin 权限才能访问，请在本地开发时使用 `http://localhost:5173/requests?role=admin` 开启
> admin 模式。

---

## 相关项目

- **[zeka-stack-api](../zeka-stack-api)** - 后端 API 服务
- **[intelli-ai-javadoc](../../zeka-idea-plugin/intelli-ai-javadoc)** - Javadoc 插件
- **[Zeka Stack](../../)** - Zeka Stack 主仓库

---

## 许可证

MIT License

---

<div align="center">

**Made with ❤️ by Zeka Stack Team**

[官网](https://zeka-stack.github.io) · [文档](https://zeka-stack.github.io/docs) · [GitHub](https://github.com/zeka-stack)

</div>
