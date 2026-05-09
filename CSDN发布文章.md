# 🔮 开源一款超美的复古神秘风格塔罗牌桌面应用 —— Electron + Vue3 + 9种AI大模型智能解读

> **项目已开源，欢迎 Star ⭐**
> 这是一款我独立开发的塔罗牌占卜桌面应用，从 UI 设计到 AI 解读全部手搓，支持 9 种国产/国际 AI 大模型，复古神秘风格，沉浸式动画体验。今天正式开源，附完整开发流程和使用教程。

---

## 📖 目录

- [项目介绍](#项目介绍)
- [功能亮点](#功能亮点)
- [技术架构](#技术架构)
- [开发流程](#开发流程)
- [核心代码解析](#核心代码解析)
- [使用教程](#使用教程)
- [开源地址](#开源地址)

---

## 🌟 项目介绍

**塔罗牌 Mystical** 是一款基于 Electron + Vue 3 的桌面应用，采用复古神秘主义设计风格。应用内置完整的 78 张韦特塔罗牌数据，支持 3 种经典牌阵，并通过接入多种 AI 大模型实现智能牌面解读。

**为什么做这个项目？**
- 个人对神秘学和塔罗文化感兴趣
- 想探索 Electron + Vue 3 的桌面应用开发
- 希望结合 AI 能力打造有深度的占卜体验
- 练习复古风格 UI 设计和 CSS 动画

---

## ✨ 功能亮点

### 🃏 完整的占卜体验
- **78 张塔罗牌**：22 张大阿卡那 + 56 张小阿卡那（权杖/圣杯/宝剑/金币），每张牌包含正位/逆位五维度解读（综合/爱情/事业/财运/健康）
- **3 种经典牌阵**：三牌阵（过去-现在-未来）、六牌阵、凯尔特十字（10 张牌深度解读）
- **沉浸式动画**：洗牌聚拢散开、扇形牌堆、翻牌揭示、羽毛飘落

### 🤖 9 种 AI 大模型支持

| 服务商 | 模型 | 特色 |
|--------|------|------|
| DeepSeek | deepseek-chat | 性价比之王 |
| 通义千问 | qwen3.5-plus | 阿里云出品 |
| 百炼 | qwen3.5-plus | 阿里云平台 |
| 豆包 | doubao-seed-2-0-pro | 字节跳动，支持 AK/SK 签名 |
| Kimi | kimi-k2.5 | 月之暗面，长上下文 |
| 硅基流动 | DeepSeek-V3 | 免费额度多 |
| 智谱 AI | glm-5 | 清华系 |
| 文心一言 | ernie-4.0-8k | 百度出品 |
| 讯飞星火 | 4.0Ultra | 科大讯飞 |

- **多维度解读**：综合 / 事业 / 感情 / 学业 / 财运
- **追问对话**：基于上下文连续追问，深入探讨牌面含义
- **灵活认证**：支持 Bearer Token 和 AK/SK HMAC-SHA256 签名两种方式

### 🎨 复古神秘设计
- 羊皮纸纹理背景（SVG 内联图案）
- 金色装饰边框（双层边框 + ✧ 装饰符号）
- 古典字体：Cinzel（英文装饰）+ Noto Serif SC（中文衬线）
- 深色/浅色双主题
- 丰富 CSS 动画：羽毛飘落、卡牌翻转、洗牌散开、魔法粒子、文字闪烁

### 📚 实用工具
- 🌙 每日运势（自动缓存，每日一抽）
- 📖 牌义词典（78 张牌搜索、筛选、收藏）
- 📜 历史记录（最多 50 条，支持 JSON 导出/导入）
- ⚙️ 灵活的 API 配置管理

---

## 🏗️ 技术架构

### 技术选型

```
┌─────────────────────────────────────────┐
│              Electron 29.1              │
│         (桌面应用壳 + 主进程)            │
├─────────────────────────────────────────┤
│              Vue 3.4 + Router 4.3       │
│         (前端框架 + 路由管理)            │
├─────────────────────────────────────────┤
│         TailwindCSS 3.4 + 自定义主题     │
│         (样式框架 + 复古风格)            │
├─────────────────────────────────────────┤
│              Vite 5.1                   │
│           (构建工具 + HMR)              │
├─────────────────────────────────────────┤
│         9 种 AI API 服务                │
│    (DeepSeek/通义/豆包/Kimi/...)        │
└─────────────────────────────────────────┘
```

### 项目结构

```
tarot-mystical/
├── electron/                  # Electron 主进程
│   ├── main.js               # 窗口创建、IPC 通信
│   └── preload.js            # 安全桥接（contextBridge）
├── src/                       # Vue 前端源码
│   ├── main.js               # 应用入口
│   ├── App.vue               # 根组件（主题、羽毛动画）
│   ├── router/index.js       # 6 个页面路由
│   ├── components/           # 7 个页面组件
│   │   ├── Home.vue          # 首页
│   │   ├── Reading.vue       # 占卜流程（核心）
│   │   ├── Result.vue        # AI 解读结果
│   │   ├── Dictionary.vue    # 牌义词典
│   │   ├── History.vue       # 历史记录
│   │   ├── Settings.vue      # 设置（API 配置）
│   │   └── Card.vue          # 可复用卡牌组件
│   ├── services/
│   │   └── apiService.js     # 9 种 AI 模型适配层
│   ├── data/
│   │   └── tarot.js          # 78 张牌数据 + 牌阵定义
│   └── assets/
│       └── styles.css        # 全局样式 + 动画
├── package.json
├── vite.config.js
├── tailwind.config.js        # 自定义色板（mystic/gold/parchment）
├── electron-builder.json     # 打包配置
└── build.bat / build.sh      # 一键打包脚本
```

---

## 🔧 开发流程

### 第一步：项目初始化

```bash
# 创建 Vite + Vue 项目
npm create vite@latest tarot-mystical -- --template vue

# 安装核心依赖
npm install vue-router@4 pinia@2

# 安装 Electron
npm install -D electron electron-builder concurrently wait-on

# 安装 TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 第二步：Electron 主进程搭建

`electron/main.js` 核心配置：

```javascript
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,      // 安全：禁用 Node 集成
      contextIsolation: true,       // 安全：启用上下文隔离
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 隐藏菜单栏
  Menu.setApplicationMenu(null)

  // 开发/生产模式加载
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}
```

### 第三步：自定义 TailwindCSS 主题

`tailwind.config.js` 中定义复古色板：

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: '#f4e4bc',     // 羊皮纸色
        mystic: {                  // 神秘色系（10 级）
          50: '#f5f0eb',
          100: '#e8ddd0',
          // ... 中间色阶
          900: '#1a1410',
          950: '#0d0a07'
        },
        gold: {                    // 金色系（9 级）
          50: '#fdf8e8',
          100: '#f9edc4',
          // ... 中间色阶
          600: '#b8860b'
        }
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        decorative: ['Cinzel', 'serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'feather-fall': 'featherFall 8s linear infinite',
        'card-reveal': 'cardReveal 0.6s ease-out'
      }
    }
  }
}
```

### 第四步：78 张塔罗牌数据

`src/data/tarot.js` 中定义完整的牌面数据结构：

```javascript
export const majorArcana = [
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    element: '风',
    image: '🃏',
    meaning: {
      upright: {
        core: '新的开始、自由、冒险精神',
        love: '新的恋情即将到来，保持开放心态',
        career: '事业新机遇，勇于尝试',
        finance: '投资需谨慎但有意外收获',
        health: '精力充沛，适合开始新运动'
      },
      reversed: {
        core: '鲁莽、不计后果、停滞不前',
        // ...
      }
    },
    description: '愚者踏出悬崖，象征无限可能...'
  },
  // ... 共 22 张大阿卡那
]

export const spreads = {
  threeCards: {
    name: '三牌阵',
    positions: ['过去', '现在', '未来']
  },
  celticCross: {
    name: '凯尔特十字',
    positions: ['现状', '挑战', '过去基础', '过去', '可能结果',
                '未来', '自我', '外在影响', '希望与恐惧', '最终结果']
  }
}
```

### 第五步：AI 多模型适配层

`src/services/apiService.js` 是整个项目的核心，统一适配 9 种 AI 服务：

```javascript
class ApiService {
  constructor() {
    this.textApiEndpoints = {
      doubao: 'https://ark.cn-beijing.volces.com/api/v3',
      deepseek: 'https://api.deepseek.com/v1/chat/completions',
      qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      kimi: 'https://api.moonshot.cn/v1/chat/completions',
      // ... 共 9 种
    }
  }

  // 统一调用入口
  async getTarotReading(cardsDescription, dimensionText, settings) {
    const { provider, apiKey, model } = settings
    const endpoint = this.textApiEndpoints[provider]

    // 构建系统提示词
    const systemPrompt = `你是一位专业的塔罗牌解读师...`

    // 根据不同服务商构建请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(provider, apiKey, settings),
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    })

    return this.extractTextContent(response, provider)
  }
}
```

**关键技术点**：
- 豆包支持 AK/SK HMAC-SHA256 签名认证（`getDoubaoHeadersWithSignature` 方法）
- 不同服务商的响应格式不同，`extractTextContent` 统一解析
- 追问对话通过维护 `messages` 数组实现上下文连续

### 第六步：沉浸式动画实现

**扇形牌堆排列算法**（Reading.vue）：

```javascript
// 以容器中心下方为圆心，-60° 到 +60° 展开牌堆
const totalCards = 78
const startAngle = -60
const endAngle = 60
const radius = containerWidth * 0.8

cards.forEach((card, index) => {
  const angle = startAngle + (endAngle - startAngle) * (index / totalCards)
  const radian = (angle * Math.PI) / 180
  const x = Math.cos(radian) * radius
  const y = Math.sin(radian) * radius - 200
  card.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`
})
```

**洗牌动画**：牌先汇聚到中心点（0.3s），然后重新随机排列散开（0.5s 弹性缓动）

**CSS 关键帧动画**（styles.css）：

```css
/* 羽毛飘落 */
@keyframes featherFall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}

/* 卡牌翻转 */
.card-flip {
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.card-flip.flipped {
  transform: rotateY(180deg);
}

/* 羊皮纸纹理背景 */
.parchment-bg {
  background-color: #f4e4bc;
  background-image: url("data:image/svg+xml,...");
}
```

### 第七步：打包发布

```bash
# Windows 安装包
npm run electron:build

# 或使用一键脚本
.\build.bat
```

`electron-builder.json` 配置 NSIS 安装程序：

```json
{
  "appId": "com.tarot.mystical",
  "productName": "塔罗牌 Mystical",
  "win": {
    "target": "nsis",
    "icon": "public/icon.svg"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "installerLanguages": ["zh_CN"]
  }
}
```

---

## 📖 使用教程

### 环境准备

```bash
# 需要 Node.js >= 16
node -v

# 克隆项目
git clone <your-repo-url>
cd tarot-mystical

# 安装依赖
npm install
```

### 启动开发

```bash
# 方式一：仅前端（浏览器调试）
npm run dev
# 访问 http://localhost:5173

# 方式二：Electron 桌面模式（推荐）
npm run electron:dev
```

### 配置 AI 服务

1. 启动应用后点击右下角「设置」
2. 在「API 配置」区域选择服务商
3. 输入 API Key（推荐使用 DeepSeek，注册即送额度）
4. 点击「测试连接」验证
5. 选择保存方式：
   - **本次保存**：关闭应用后清除
   - **长期保存**：持久化到 localStorage
   - **不保存**：每次手动输入

> 💡 **免费推荐**：DeepSeek 新用户注册送 500 万 Token，硅基流动也有免费额度，足够日常使用。

### 开始占卜

1. **选牌阵**：三牌阵（快速）/ 六牌阵（中等）/ 凯尔特十字（深度）
2. **洗牌**：自动播放洗牌动画
3. **抽牌**：从扇形牌堆中点击需要的牌
4. **查看解读**：AI 自动生成多维度解读
5. **追问**：对解读有疑问？继续追问深入探讨

### 构建发布

```bash
# 构建 Windows 安装包（.exe）
npm run electron:build

# 构建免安装版
npm run electron:build:dir
```

输出位置：`release/` 目录下

---

## 🎯 设计亮点总结

| 方面 | 实现方案 |
|------|----------|
| **复古风格** | 羊皮纸纹理 + 金色边框 + 古典字体 |
| **沉浸体验** | 洗牌/抽牌/翻牌全套 CSS 动画 |
| **AI 适配** | 统一接口层适配 9 种模型，切换无缝 |
| **安全设计** | nodeIntegration:false + contextIsolation + CSP |
| **数据持久化** | localStorage + JSON 导出导入 |
| **跨平台** | Electron 支持 Windows/macOS/Linux |

---

## 🔮 开源地址

**GitHub**：[https://github.com/your-username/tarot-mystical](https://github.com/your-username/tarot-mystical)

**欢迎 Star ⭐、Fork 和 PR！**

如果你觉得这个项目有趣，或者想在此基础上二次开发（比如接入更多 AI 模型、增加在线牌阵分享、添加音效等），欢迎贡献代码。

---

## 📝 写在最后

这个项目从零开始，经历了：
- **UI 设计**：反复调整色板、字体、动画，追求复古神秘氛围
- **数据整理**：手动整理 78 张塔罗牌的正位/逆位五维度解读
- **AI 适配**：逐一对接 9 种 AI 服务的 API 差异
- **动画打磨**：洗牌、抽牌、翻牌的交互体验反复优化

开发过程中踩了不少坑，比如 Electron 的 CSP 策略限制、不同 AI 服务商的响应格式差异、扇形排列的数学计算等，但最终效果还是很满意的。

**如果你也在做类似的项目，或者对这个项目有任何问题，欢迎在评论区交流！** 🎉

---

> **标签**：`Electron` `Vue3` `塔罗牌` `AI` `桌面应用` `开源` `TailwindCSS` `前端`
