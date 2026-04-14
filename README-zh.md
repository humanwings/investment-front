# investment-front

投资系统前端项目。

## 启动准备

### 环境要求

- Node.js
- npm

建议版本：

- Node.js 16.x
- npm 8.x 及以上

### 安装依赖

```bash
npm install
```

## 运行方法

### 开发环境启动

```bash
npm run dev
```

默认访问地址：

- `http://localhost:9528`

当前开发环境接口地址配置在 `.env.development`：

- `VUE_APP_BASE_API=http://localhost:8080`

启动前请确认后端服务已经运行。

### 生产构建

```bash
npm run build:prod
```

构建输出目录：

- `dist/`

### 预发构建

```bash
npm run build:stage
```

### 构建结果预览

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 技术实现

### 核心技术栈

- Vue 2
- Vue Router
- Vuex
- Element UI
- Axios
- SCSS

### 目录结构

- `src/views/`
  页面视图
- `src/router/`
  路由配置
- `src/store/`
  Vuex 状态管理
- `src/api/`
  前端接口封装
- `src/layout/`
  整体布局、侧边栏、顶部导航
- `src/components/`
  通用组件
- `src/utils/`
  公共工具

### 运行方式说明

- 前端通过 HTTP 接口与后端通信
- 登录态通过 Vuex 与 token 持久化管理
- 左侧菜单由路由配置驱动
- 不同环境的接口地址通过 `.env.*` 文件控制

