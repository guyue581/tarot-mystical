# 🔮 塔罗牌 Mystical V2.1.0

> 一款复古神秘风格的塔罗牌桌面应用，采用 Electron + Vue 3 开发，支持 9 种 AI 大模型智能解读

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/Electron-29.1-47848F)
![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D)

## ✨ 功能特性

### 🃏 占卜核心
- **78 张完整塔罗牌数据**：大阿卡那 22 张 + 小阿卡那 56 张（权杖/圣杯/宝剑/金币）
- **3 种经典牌阵**：
  - 三牌阵（过去 / 现在 / 未来）
  - 六牌阵（情况 / 障碍 / 过去 / 现在 / 希望 / 结果）
  - 凯尔特十字（10 张牌深度解读）
- **沉浸式动画**：洗牌动画、扇形抽牌、翻牌揭示、羽毛飘落

### 🤖 AI 智能解读（支持 9 种大模型）
| 服务商 | 模型 | 认证方式 |
|--------|------|----------|
| DeepSeek | deepseek-chat | Bearer Token |
| 通义千问 | qwen3.5-plus | Bearer Token |
| 百炼 | qwen3.5-plus | Bearer Token |
| 豆包 | doubao-seed-2-0-pro | Bearer Token / AK-SK 签名 |
| Kimi | kimi-k2.5 | Bearer Token |
| 硅基流动 | DeepSeek-V3 | Bearer Token |
| 智谱 AI | glm-5 | Bearer Token |
| 文心一言 | ernie-4.0-8k | Bearer Token |
| 讯飞星火 | 4.0Ultra | Bearer Token |

- **多维度解读**：综合 / 事业 / 感情 / 学业 / 财运
- **追问对话**：基于上下文的连续追问
- **AI 配图生成**：古典神秘风格配图

### 📚 其他功能
- 🌙 今日运势（每日一抽，自动缓存）
- 📖 牌义词典（搜索 / 筛选 / 收藏）
- 📜 历史记录（最多 50 条，支持导出导入）
- 🌓 深色 / 浅色主题切换
- ⚙️ 灵活的 API 配置（支持多种认证方式）

## 🎨 设计风格

- **复古神秘主题**：深褐 / 墨绿 + 金色点缀
- **羊皮纸纹理背景**（SVG 内联图案）
- **金色装饰边框**（双层边框 + ✧ 装饰）
- **古典字体**：Cinzel（装饰）+ Noto Serif SC（中文衬线）
- **丰富动画**：羽毛飘落、卡牌翻转、洗牌散开、魔法粒子

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Electron | 29.1 | 桌面应用框架 |
| Vue 3 | 3.4 | 前端框架 |
| Vue Router | 4.3 | 路由管理（Hash 模式） |
| Pinia | 2.1 | 状态管理 |
| Vite | 5.1 | 构建工具 |
| TailwindCSS | 3.4 | 样式框架 |
| PostCSS | 8.4 | CSS 处理 |

## 📦 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装与运行
```bash
# 克隆项目
git clone <your-repo-url>
cd tarot-mystical

# 安装依赖
npm install

# 启动开发模式（Vite + Electron）
npm run electron:dev
```

### 构建桌面应用
```bash
# 构建 Windows 安装包
npm run electron:build

# 或使用打包脚本
.\build.bat
```

### 一键开发
```bash
# 仅启动前端开发服务器（浏览器调试）
npm run dev

# 启动 Electron 开发模式
npm run electron:dev
```

## ⚙️ API 配置

1. 启动应用后，进入「设置」页面
2. 选择 AI 服务商（推荐 DeepSeek 或通义千问）
3. 输入对应的 API Key
4. 点击「测试连接」验证配置
5. 选择保存方式（本次 / 长期 / 不保存）

详细配置指南请查看 [API配置说明.md](./API配置说明.md)

## 📁 项目结构

```
tarot-mystical/
├── electron/                  # Electron 主进程
│   ├── main.js               # 主进程入口（窗口创建、IPC）
│   └── preload.js            # 预加载脚本（安全桥接）
├── src/                       # Vue 前端源码
│   ├── main.js               # Vue 应用入口
│   ├── App.vue               # 根组件（主题切换、羽毛动画）
│   ├── router/index.js       # 路由配置（6 个页面）
│   ├── components/           # 页面组件
│   │   ├── Home.vue          # 首页（今日运势、功能入口）
│   │   ├── Reading.vue       # 占卜流程（选牌阵→洗牌→抽牌）
│   │   ├── Result.vue        # 解读结果（AI 解读、追问）
│   │   ├── Dictionary.vue    # 牌义词典（搜索、筛选、收藏）
│   │   ├── History.vue       # 历史记录（查看、删除、导出）
│   │   ├── Settings.vue      # 设置（API 配置、主题、数据管理）
│   │   └── Card.vue          # 可复用卡牌组件
│   ├── services/
│   │   └── apiService.js     # API 服务（9 种 AI 模型适配）
│   ├── data/
│   │   └── tarot.js          # 78 张塔罗牌完整数据 + 牌阵定义
│   └── assets/
│       └── styles.css        # 全局样式（动画、主题、自定义组件）
├── public/
│   └── icon.svg              # 应用图标
├── package.json              # 项目配置
├── vite.config.js            # Vite 配置
├── tailwind.config.js        # TailwindCSS 配置（自定义色板）
├── postcss.config.js         # PostCSS 配置
├── electron-builder.json     # Electron Builder 打包配置
├── build.bat                 # Windows 打包脚本
├── build.sh                  # macOS/Linux 打包脚本
├── README.md                 # 项目说明
└── API配置说明.md             # API 配置详细指南
```

## 🎮 使用说明

### 开始占卜
1. 点击首页「开始占卜」
2. 选择牌阵类型（三牌 / 六牌 / 凯尔特十字）
3. 观赏洗牌动画
4. 从扇形牌堆中点击抽牌
5. 查看 AI 智能解读（可选维度）
6. 可继续追问深入解读

### 今日运势
- 每日首次打开自动抽一张运势牌
- 支持重新抽取

### 牌义查询
- 进入「牌义词典」浏览 78 张牌
- 支持中英文名搜索、分类筛选
- 点击查看正位 / 逆位五维度解读
- 收藏喜欢的牌

## 📝 数据存储

所有数据使用 `localStorage` 本地存储：
- 历史记录（最多 50 条）
- 收藏列表
- API 配置
- 每日运势缓存
- 主题偏好

支持在设置页面导出 / 导入 JSON 数据。

## 🔒 安全说明

- Electron 安全配置：`nodeIntegration: false`、`contextIsolation: true`
- CSP 策略限制外部资源加载
- API Key 存储在本地 localStorage，不会上传

## 📄 许可证

MIT License - 自由使用、修改和分发

## 🙏 致谢

- 塔罗牌牌义参考传统韦特塔罗体系
- UI 设计灵感来自复古神秘主义风格
- 感谢所有开源 AI 服务商提供的 API 支持
