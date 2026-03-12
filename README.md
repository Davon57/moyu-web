# 🐟 摸鱼坊

> 上班偷偷懒，快乐每一天

一个聚合多个热门榜单的摸鱼网站，帮助上班族在忙碌的工作间隙快速浏览热门资讯。

## ✨ 功能特性

### 热门榜单（16个）
1. 📰 今日新闻 - 每天 60 秒读懂世界
2. 📕 小红书热点
3. 🎵 抖音热搜
4. 🔴 微博热搜
5. 💡 知乎话题
6. 🚗 懂车帝热搜
7. 🎬 猫眼电影实时票房
8. 📺 猫眼电视收视排行
9. 🔥 猫眼网剧实时热度
10. 📺 豆瓣华语口碑剧集榜
11. 📺 豆瓣华语口碑综艺榜
12. 🎥 豆瓣全球口碑电影榜
13. 📺 豆瓣全球口碑剧集榜
14. 📺 豆瓣全球口碑综艺榜
15. 🎵 网易云榜单
16. 🎬 猫眼全球票房总榜

### 实用工具
- 🌤️ 天气查询 - 支持城市搜索、详细天气信息
- ⏰ 下班倒计时 - 可自定义设置下班时间

### 其他
- 💬 一言 - 随机经典语录（显示在 Logo 旁）
- 🌙 明暗主题切换
- 📱 响应式设计，适配手机/平板/电脑

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **状态管理**: Pinia
- **样式**: CSS Variables
- **数据源**: 60s.viki.moe API

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
moyu-web/
├── src/
│   ├── components/     # 组件（21个组件）
│   ├── views/         # 页面视图
│   ├── stores/        # 状态管理
│   └── assets/        # 静态资源
├── docs/              # 文档
├── public/             # 公共文件
└── dist/              # 构建输出
```

## 📝 数据来源

- 热搜/榜单数据: [60s.viki.moe](https://60s.viki.moe)
- 天气数据: 腾讯天气 API

## 📄 License

MIT

---

![Vue](https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vuedotjs)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)
