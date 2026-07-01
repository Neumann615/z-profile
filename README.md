# Z-Profile

> 个人主页 / Personal Homepage — 基于 Next.js 14 构建的个人简介与项目展示站点。

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## ✨ 特性

- 🌐 **中英文国际化** — 基于 `next-intl` v3，`/` 为中文，`/en` 为英文
- 🌙 **深色模式** — `next-themes` 驱动，支持跟随系统
- 🎨 **p5.js 动态背景** — 流场粒子动画，深浅色自适应
- 📊 **GitHub 年度贡献图** — 调用 GitHub Contributions API 渲染热力图
- 🔗 **LinkPreview 链接预览** — 悬停项目卡片时预览目标网页缩略图
- ✨ **SparklesText 文字特效** — 名称装饰光点动画
- 📱 **响应式布局** — 移动端 / 平板 / 桌面三档适配
- 🎬 **加载动画** — 桌面端视频过渡，移动端 CSS 动画（避免下载弹窗）
- 🔄 **View Transitions** — 主题切换平滑过渡

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3.4 + `tailwindcss-animate` |
| 国际化 | `next-intl` v3 |
| 主题 | `next-themes` |
| 动效 | p5.js (`p5i`), CSS Animations |
| 工具 | `clsx`, `tailwind-merge`, `lucide-react` |

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器访问
# 中文: http://localhost:3000
# 英文: http://localhost:3000/en
```

## 📦 构建部署

```bash
npm run build   # 生产构建
npm run start   # 启动生产服务器
```

## 📁 目录结构

```
z-profile/
├── app/
│   ├── layout.tsx                  # 根 HTML shell
│   ├── globals.css                 # 全局样式 + View Transitions
│   └── [locale]/
│       ├── layout.tsx              # NextIntlClientProvider + metadata
│       └── (app)/
│           ├── layout.tsx          # GlobalBg + Header + Main 布局
│           └── (home)/
│               └── page.tsx        # 主页（个人信息/技术栈/项目/GitHub）
├── components/
│   ├── GlobalBg/                   # p5.js 流场粒子背景
│   ├── GlobalLoading/              # 启动加载动画（桌面视频/移动端 CSS）
│   ├── GithubYearContributions/    # GitHub 年度贡献热力图
│   ├── GithubContributions/        # GitHub 季度贡献（已从页面移除）
│   ├── Header/                     # 顶栏（主题切换 + 语言切换）
│   ├── LanguageSwitcher/           # 中/英语言切换按钮
│   ├── LinkPreview/                # 链接缩略图预览
│   ├── LocaleAwareHtml/            # 动态设置 <html lang>
│   ├── Main/                       # 主内容容器
│   ├── SparklesText/               # 文字光点动画
│   └── Icon/                       # SVG 图标组件
├── data/
│   ├── profile.zh.json             # 中文个人信息数据
│   └── profile.en.json             # 英文个人信息数据
├── i18n/
│   ├── routing.ts                  # locale 路由配置
│   └── request.ts                  # 服务端 locale 检测 & 消息加载
├── messages/
│   ├── zh.json                     # 中文翻译文案
│   └── en.json                     # 英文翻译文案
├── public/
│   ├── logo.jpg                    # 头像
│   ├── wx-qr-code.png              # 微信二维码
│   └── video/                      # 加载动画视频素材
├── middleware.ts                   # next-intl 路由中间件
├── next.config.mjs                 # Next.js 配置（含 next-intl 插件）
├── tailwind.config.ts              # Tailwind CSS 配置
└── package.json
```

## 🌍 国际化

- **默认语言**: 中文（`/`）
- **英文**: `/en`
- **语言切换**: 右上角按钮，使用 `useTransition` + `router.replace` 平滑切换
- **数据分离**: 个人信息数据按语言拆分至 `data/profile.{zh,en}.json`
- **URL 策略**: `localePrefix: 'as-needed'`，中文路径不带前缀

### 添加翻译

1. 在 `messages/zh.json` 和 `messages/en.json` 中添加键值对
2. 在组件中使用 `useTranslations()` hook：
   ```tsx
   const t = useTranslations('namespace')
   return <span>{t('key')}</span>
   ```

## 🎨 自定义

### 修改个人信息

编辑 `data/profile.zh.json` 和 `data/profile.en.json`：

```json
{
  "personal": {
    "name": "你的名字",
    "role": "你的职位",
    "bio": "个人简介",
    "motto": "座右铭",
    "avatar": "/your-avatar.jpg"
  },
  "contacts": [...],
  "skills": ["html", "css", "js", ...],
  "projects": [...]
}
```

技能图标使用 [skillicons.dev](https://skillicons.dev/) 的 Icon ID，图标颜色自动跟随主题。

### 替换加载视频

将你的视频文件放入 `public/video/`：
- `loader.mov` — 循环播放的加载动画
- `loader_end.mp4` — 加载结束过渡动画

## 📄 许可证

MIT License
