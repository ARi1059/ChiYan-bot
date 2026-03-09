# ChiYan Bot

Telegram 群组关键词自动回复机器人，支持 Web 后台管理。

## 功能特性

- 关键词自动回复（精确匹配/包含匹配/正则匹配）
- 支持文本 + 图片回复
- 支持 Telegram 文本格式（加粗、斜体、链接等）
- 支持 Inline 按钮
- Web 管理后台
- Docker 一键部署

## 快速开始

### 1. 准备工作

- 创建 Telegram Bot，获取 Bot Token
- 获取管理员 Chat ID

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入配置
```

### 3. 创建管理员账号

```bash
cd backend
npm install
npx prisma migrate dev
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 10).then(hash => console.log(hash));"
```

将生成的密码哈希插入数据库：

```bash
npx prisma studio
# 在 User 表中添加记录：username: admin, passwordHash: <生成的哈希>
```

### 4. Docker 部署

```bash
docker-compose up -d
```

访问 http://your-server-ip 进入管理后台。

### 5. 本地开发

**后端：**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**前端：**
```bash
cd frontend
npm install
npm run dev
```

## 使用说明

1. 登录管理后台
2. 添加关键词规则
3. Bot 自动在群组中响应

## 技术栈

- 后端：Node.js + TypeScript + Express + Telegraf + Prisma
- 前端：Vue 3 + TypeScript + Element Plus
- 数据库：SQLite
- 部署：Docker + Nginx
