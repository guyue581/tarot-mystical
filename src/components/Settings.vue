<template>
  <div class="settings-page min-h-full p-8">
    <div class="max-w-2xl mx-auto">
      <!-- 返回首页按钮 -->
      <div class="flex justify-end mb-6">
        <button @click="$router.push('/')" class="btn-mystical text-sm py-2 px-4">
          返回首页
        </button>
      </div>
      
      <h1 class="text-ornate text-3xl text-gold-400 text-center mb-8">⚙️ 设置</h1>

      <!-- API设置 -->
      <div class="gold-border-ornate rounded-lg p-6 mb-6" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-xl text-gold-400 mb-4">🔑 AI API 设置</h2>
        
        <!-- API配置说明（可折叠） -->
        <div class="mb-4">
          <button
            @click="showApiGuide = !showApiGuide"
            class="w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-300"
            style="background: rgba(139, 99, 64, 0.1); border: 1px solid rgba(212, 175, 55, 0.2);"
          >
            <div class="flex items-center gap-2">
              <span class="text-gold-400">📖</span>
              <span class="text-sm font-medium text-gold-300">API配置快速指南</span>
            </div>
            <span class="text-gold-400 transition-transform duration-300" :class="{ 'transform rotate-180': showApiGuide }">▼</span>
          </button>
          
          <div v-if="showApiGuide" class="mt-2 p-3 rounded-lg text-xs space-y-1.5" style="background: rgba(139, 99, 64, 0.05); border: 1px solid rgba(212, 175, 55, 0.1);">
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 DeepSeek</strong>：<a href="https://platform.deepseek.com" target="_blank" class="underline hover:text-gold-200">platform.deepseek.com</a> → 获取API Key</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 豆包</strong>：<a href="https://console.volcengine.com/ark" target="_blank" class="underline hover:text-gold-200">console.volcengine.com/ark</a> → 获取API Key或AK/SK</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 通义千问（百炼）</strong>：<a href="https://bailian.console.aliyun.com" target="_blank" class="underline hover:text-gold-200">bailian.console.aliyun.com</a> → 获取API Key</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 Kimi</strong>：<a href="https://platform.moonshot.cn" target="_blank" class="underline hover:text-gold-200">platform.moonshot.cn</a> → 获取API Key</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 硅基流动</strong>：<a href="https://cloud.siliconflow.cn" target="_blank" class="underline hover:text-gold-200">cloud.siliconflow.cn</a> → 获取API Key</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 智谱AI</strong>：<a href="https://open.bigmodel.cn" target="_blank" class="underline hover:text-gold-200">open.bigmodel.cn</a> → 获取API Key</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 文心一言</strong>：<a href="https://yiyan.baidu.com/developer" target="_blank" class="underline hover:text-gold-200">yiyan.baidu.com/developer</a> → 获取API Key</p>
            <p class="text-gold-300/70"><strong class="text-gold-400">🔹 讯飞星火</strong>：<a href="https://xinghuo.xfyun.cn" target="_blank" class="underline hover:text-gold-200">xinghuo.xfyun.cn</a> → 获取API Key</p>
          </div>
        </div>

        <!-- 服务商选择 -->
        <div class="mb-4">
          <label class="text-gold-300/70 text-sm mb-2 block">文本解读 - 选择服务商</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="provider in providers" 
              :key="provider.value"
              @click="selectProvider(provider.value)"
              class="p-3 rounded border transition-all"
              :class="settings.provider === provider.value 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              {{ provider.label }}
            </button>
          </div>
        </div>

        <!-- 认证方式 -->
        <div class="mb-4">
          <label class="text-gold-300/70 text-sm mb-2 block">认证方式</label>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button 
              @click="settings.authType = 'bearer'"
              class="p-3 rounded border transition-all"
              :class="settings.authType === 'bearer' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              API Key (Bearer)
            </button>
            <button 
              @click="settings.authType = 'ak_sk'"
              class="p-3 rounded border transition-all"
              :class="settings.authType === 'ak_sk' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              AK/SK 签名
            </button>
          </div>
        </div>

        <template v-if="settings.authType === 'bearer'">
          <div class="mb-4">
            <label class="text-gold-300/70 text-sm mb-2 block">API Key</label>
            <div class="flex gap-2">
              <input 
                v-model="settings.apiKey"
                :type="showApiKey ? 'text' : 'password'"
                placeholder="请输入您的API密钥"
                class="input-mystical flex-1 rounded"
              />
              <button
                @click="showApiKey = !showApiKey"
                class="px-3 py-2 rounded border transition-colors"
                style="border-color: rgba(212, 175, 55, 0.3); color: #d4af37;"
              >
                {{ showApiKey ? '🔒' : '👁️' }}
              </button>
            </div>
            <p v-if="isApiKeyConfigured" class="mt-2 text-xs text-green-400 flex items-center gap-1">
              <span>✓</span>
              <span>已配置 {{ providerName }} API</span>
            </p>
            <p class="text-gold-300/40 text-xs mt-2">
              {{ getProviderInfo() }}
            </p>
          </div>
        </template>

        <template v-if="settings.authType === 'ak_sk' && settings.provider === 'doubao'">
          <div class="mb-4">
            <label class="text-gold-300/70 text-sm mb-2 block">Access Key (AK)</label>
            <input 
              v-model="settings.ak"
              type="password"
              placeholder="请输入Access Key"
              class="input-mystical w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="text-gold-300/70 text-sm mb-2 block">Secret Key (SK)</label>
            <input 
              v-model="settings.sk"
              type="password"
              placeholder="请输入Secret Key"
              class="input-mystical w-full rounded"
            />
            <p class="text-gold-300/40 text-xs mt-2">
              前往火山引擎控制台获取 AK/SK，用于豆包API签名认证
            </p>
          </div>
        </template>

        <!-- 豆包Endpoint ID（可选） -->
        <div v-if="settings.provider === 'doubao'" class="mb-4">
          <label class="text-gold-300/70 text-sm mb-2 block">Endpoint ID（可选，留空则使用Model ID）</label>
          <input 
            v-model="settings.endpointId"
            type="text"
            placeholder="如 ep-xxxxxxx，留空则使用标准Model ID调用"
            class="input-mystical w-full rounded"
          />
          <p class="text-gold-300/40 text-xs mt-2">
            在火山方舟「在线推理」页面获取Endpoint ID。如未创建推理接入点，请留空并使用Model ID调用。
          </p>
        </div>

        <!-- 模型配置 -->
        <div v-if="settings.provider !== 'none'" class="mb-4">
          <label class="text-gold-300/70 text-sm mb-2 block">模型配置</label>
          
          <!-- 模式选择 -->
          <div class="flex gap-2 mb-2">
            <button
              @click="settings.modelInputType = 'select'"
              class="flex-1 py-2 px-3 rounded border transition-all duration-300 text-sm"
              :class="settings.modelInputType === 'select' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              预设模型
            </button>
            <button
              @click="settings.modelInputType = 'custom'"
              class="flex-1 py-2 px-3 rounded border transition-all duration-300 text-sm"
              :class="settings.modelInputType === 'custom' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              自定义
            </button>
          </div>
          
          <!-- 预设模型选择 -->
          <select 
            v-if="settings.modelInputType === 'select'"
            v-model="selectedModelOption" 
            @change="onModelSelectChange"
            class="input-mystical w-full rounded"
          >
            <option v-for="model in availableModelOptions" :key="model.value" :value="model.value">
              {{ model.label }}
            </option>
          </select>
          
          <!-- 自定义模型输入 -->
          <input
            v-if="settings.modelInputType === 'custom'"
            v-model="settings.model"
            type="text"
            :placeholder="getCustomModelPlaceholder()"
            class="input-mystical w-full rounded"
          />
          
          <!-- 提示 -->
          <p v-if="settings.modelInputType === 'custom'" class="mt-1 text-[10px] text-gold-300/40">
            {{ getCustomModelTip() }}
          </p>
        </div>

        <!-- 保存模式 -->
        <div class="mb-4">
          <label class="text-gold-300/70 text-sm mb-2 block">保存模式</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="settings.saveMode = 'session'"
              class="py-2 px-3 rounded border transition-all duration-300 text-sm"
              :class="settings.saveMode === 'session' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              本次保存
            </button>
            <button
              @click="settings.saveMode = 'permanent'"
              class="py-2 px-3 rounded border transition-all duration-300 text-sm"
              :class="settings.saveMode === 'permanent' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              长期保存
            </button>
            <button
              @click="settings.saveMode = 'none'"
              class="py-2 px-3 rounded border transition-all duration-300 text-sm"
              :class="settings.saveMode === 'none' 
                ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
            >
              不保存
            </button>
          </div>
          <p class="mt-2 text-xs text-gold-300/40">
            {{ saveModeDescription }}
          </p>
        </div>
        
        <!-- 测试连接和保存按钮 -->
        <div class="flex gap-2 mb-4">
          <button @click="testConnection" class="btn-mystical flex-1" :disabled="isTesting">
            {{ isTesting ? '测试中...' : '测试连接' }}
          </button>
          <button @click="saveSettings" class="btn-mystical flex-1">
            💾 保存配置
          </button>
        </div>
        
        <!-- 测试结果 -->
        <div v-if="testResult" class="p-3 rounded-lg text-sm flex items-center gap-2 mb-4"
          :class="testResult.success 
            ? 'text-green-400' 
            : 'text-red-400'"
          style="background: rgba(139, 99, 64, 0.05); border: 1px solid rgba(212, 175, 55, 0.1);"
        >
          <span>{{ testResult.success ? '✓' : '✗' }}</span>
          <span>{{ testResult.message }}</span>
        </div>

        <p class="text-xs text-gold-300/40">
          您的API配置仅保存在本地，不会被上传
        </p>
      </div>

      <!-- 图像生成设置（功能开发中，暂时注释） -->
      <!--
      <div class="mt-6 pt-4 border-t border-gold-500/20">
        <label class="text-gold-300/70 text-sm mb-2 block">图像生成 - 选择服务</label>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <button 
            v-for="imgProvider in imageProviders" 
            :key="imgProvider.value"
            @click="settings.imageProvider = imgProvider.value"
            class="p-3 rounded border transition-all"
            :class="settings.imageProvider === imgProvider.value 
              ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
              : 'border-gold-500/30 text-gold-300/70 hover:border-gold-500/50'"
          >
            {{ imgProvider.label }}
          </button>
        </div>
        <div v-if="settings.imageProvider !== 'pollinations'" class="mb-4">
          <label class="text-gold-300/70 text-sm mb-2 block">图像API Key</label>
          <input 
            v-model="settings.imageApiKey"
            type="password"
            placeholder="请输入图像API密钥"
            class="input-mystical w-full rounded"
          />
        </div>
        <p class="text-gold-300/40 text-xs">
          {{ getImageProviderInfo() }}
        </p>
      </div>
      -->

      <!-- 音效设置（功能开发中，暂时注释） -->
      <!--
      <div class="gold-border-ornate rounded-lg p-6 mb-6" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-xl text-gold-400 mb-4">🔊 音效设置</h2>
        
        <div class="flex items-center justify-between mb-4">
          <span class="text-gold-300">背景音乐</span>
          <button 
            @click="settings.soundEnabled = !settings.soundEnabled"
            class="w-14 h-8 rounded-full transition-all relative"
            :class="settings.soundEnabled ? 'bg-gold-500' : 'bg-gold-500/30'"
          >
            <span 
              class="absolute top-1 w-6 h-6 rounded-full bg-white transition-all"
              :class="settings.soundEnabled ? 'left-7' : 'left-1'"
            ></span>
          </button>
        </div>

        <button @click="saveSettings" class="btn-mystical w-full">
          保存设置
        </button>
      </div>
      -->

      <!-- 主题设置 -->
      <div class="gold-border-ornate rounded-lg p-6 mb-6" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-xl text-gold-400 mb-4">🎨 主题设置</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <div 
            @click="setTheme('dark')"
            class="p-4 rounded border cursor-pointer transition-all"
            :class="currentTheme === 'dark' ? 'border-gold-500 bg-gold-500/20' : 'border-gold-500/30 hover:border-gold-500/50'"
          >
            <div class="w-full h-20 rounded bg-mystic-950 mb-2 flex items-center justify-center">
              <span class="text-gold-400">🌙</span>
            </div>
            <p class="text-gold-300 text-center">暗色主题</p>
          </div>
          
          <div 
            @click="setTheme('light')"
            class="p-4 rounded border cursor-pointer transition-all"
            :class="currentTheme === 'light' ? 'border-gold-500 bg-gold-500/20' : 'border-gold-500/30 hover:border-gold-500/50'"
          >
            <div class="w-full h-20 rounded bg-parchment mb-2 flex items-center justify-center">
              <span class="text-amber-700">☀️</span>
            </div>
            <p class="text-gold-300 text-center">浅色主题</p>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="gold-border-ornate rounded-lg p-6" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-xl text-gold-400 mb-4">💾 数据管理</h2>
        
        <div class="space-y-4">
          <button @click="clearHistory" class="btn-mystical w-full bg-transparent">
            🗑️ 清空历史记录
          </button>
          
          <button @click="exportData" class="btn-mystical w-full">
            📤 导出数据
          </button>
          
          <button @click="importData" class="btn-mystical w-full bg-transparent">
            📥 导入数据
          </button>
        </div>
      </div>

      <!-- 关于 -->
      <div class="gold-border-ornate rounded-lg p-6 mt-6" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-xl text-gold-400 mb-4">ℹ️ 关于</h2>
        <div class="text-center">
          <p class="text-gold-400 text-2xl mb-2">✧ 塔罗牌 Mystical ✧</p>
          <p class="text-gold-300/60">版本 2.1.0</p>
          <p class="text-gold-300/40 text-sm mt-4">
            探索命运的奥秘，聆听星辰的低语
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const settings = reactive({
  provider: 'deepseek',
  apiKey: '',
  model: '',
  authType: 'bearer',
  ak: '',
  sk: '',
  endpointId: '',
  imageProvider: 'qwen',
  imageApiKey: '',
  soundEnabled: true,
  modelInputType: 'select',
  saveMode: 'permanent'
})

const isTesting = ref(false)
const testResult = ref(null)
const currentTheme = ref('dark')
const selectedModelOption = ref('')
const showApiKey = ref(false)
const showApiGuide = ref(false)

const providers = [
  { label: 'DeepSeek', value: 'deepseek' },
  { label: '通义千问', value: 'qwen' },
  { label: '百炼', value: 'bailian' },
  { label: '豆包', value: 'doubao' },
  { label: 'Kimi', value: 'kimi' },
  { label: '硅基流动', value: 'siliconflow' },
  { label: '智谱AI', value: 'glm' },
  { label: '文心一言', value: 'ernie' },
  { label: '讯飞星火', value: 'spark' }
]

const imageProviders = [
  { label: 'Pollinations (免费)', value: 'pollinations' },
  { label: '通义万相 (阿里云)', value: 'qwen' },
  { label: '智谱CogView', value: 'zhipu' },
  { label: '豆包', value: 'doubao' }
]

const modelOptions = {
  deepseek: [
    { label: 'DeepSeek Chat (V3)', value: 'deepseek-chat' },
    { label: 'DeepSeek R1', value: 'deepseek-reasoner' }
  ],
  qwen: [
    { label: 'Qwen 3.5 Plus', value: 'qwen3.5-plus' },
    { label: 'Qwen 3.5 Turbo', value: 'qwen3.5-turbo' },
    { label: 'Qwen 3.5 Max', value: 'qwen3.5-max' },
    { label: 'Qwen Plus', value: 'qwen-plus' },
    { label: 'Qwen Turbo', value: 'qwen-turbo' },
    { label: 'Qwen Max', value: 'qwen-max' }
  ],
  bailian: [
    { label: 'Qwen 3.5 Plus', value: 'qwen3.5-plus' },
    { label: 'Qwen 3.5 Turbo', value: 'qwen3.5-turbo' },
    { label: 'Qwen 3.5 Max', value: 'qwen3.5-max' },
    { label: 'Qwen Plus', value: 'qwen-plus' },
    { label: 'Qwen Turbo', value: 'qwen-turbo' },
    { label: 'Qwen Max', value: 'qwen-max' }
  ],
  doubao: [
    { label: '豆包 Seed 2.0 Pro', value: 'doubao-seed-2-0-pro-260215' },
    { label: '豆包 Seed 2.0 Lite', value: 'doubao-seed-2-0-lite-260215' },
    { label: '豆包 Seed 1.8', value: 'doubao-seed-1-8-251215' },
    { label: '豆包 Seed 1.6', value: 'doubao-seed-1-6-251015' },
    { label: '豆包 Pro 32K', value: 'doubao-pro-32k' },
    { label: '豆包 Pro 128K', value: 'doubao-pro-128k' },
    { label: '豆包 Lite 32K', value: 'doubao-lite-32k' }
  ],
  kimi: [
    { label: 'Kimi K2.5', value: 'kimi-k2.5' },
    { label: 'Kimi K2', value: 'kimi-k2' },
    { label: 'Moonshot V1 8K', value: 'moonshot-v1-8k' },
    { label: 'Moonshot V1 32K', value: 'moonshot-v1-32k' },
    { label: 'Moonshot V1 128K', value: 'moonshot-v1-128k' }
  ],
  siliconflow: [
    { label: 'DeepSeek V3', value: 'deepseek-ai/DeepSeek-V3' },
    { label: 'DeepSeek R1', value: 'deepseek-ai/DeepSeek-R1' },
    { label: 'Qwen 2.5 72B', value: 'Qwen/Qwen2.5-72B-Instruct' }
  ],
  glm: [
    { label: 'GLM-5', value: 'glm-5' },
    { label: 'GLM-4', value: 'glm-4' },
    { label: 'GLM-4 Plus', value: 'glm-4-plus' },
    { label: 'GLM-4 Flash', value: 'glm-4-flash' },
    { label: 'GLM-4 Air', value: 'glm-4-air' }
  ],
  ernie: [
    { label: 'ERNIE 4.0 8K', value: 'ernie-4.0-8k' },
    { label: 'ERNIE 3.5 8K', value: 'ernie-3.5-8k' },
    { label: 'ERNIE Speed', value: 'ernie-speed-128k' }
  ],
  spark: [
    { label: 'Spark 4.0 Ultra', value: '4.0Ultra' },
    { label: 'Spark Max', value: 'generalv3.5' },
    { label: 'Spark Pro', value: 'generalv3' },
    { label: 'Spark Lite', value: 'general' }
  ]
}

const defaultModels = {
  deepseek: 'deepseek-chat',
  qwen: 'qwen3.5-plus',
  bailian: 'qwen3.5-plus',
  doubao: 'doubao-seed-2-0-pro-260215',
  kimi: 'kimi-k2.5',
  siliconflow: 'deepseek-ai/DeepSeek-V3',
  glm: 'glm-5',
  ernie: 'ernie-4.0-8k',
  spark: '4.0Ultra'
}

const availableModelOptions = computed(() => {
  return modelOptions[settings.provider] || []
})

const saveModeDescription = computed(() => {
  const descriptions = {
    session: '关闭应用后清除，下次启动需重新输入',
    permanent: '长期保存，除非手动清除',
    none: '仅本次使用，关闭应用后自动清除'
  }
  return descriptions[settings.saveMode] || ''
})

const isApiKeyConfigured = computed(() => {
  if (settings.provider === 'none') return false
  if (settings.authType === 'bearer') {
    return !!settings.apiKey && !!settings.model
  } else {
    return !!settings.ak && !!settings.sk && !!settings.model
  }
})

const providerName = computed(() => {
  const nameMap = {
    deepseek: 'DeepSeek',
    qwen: '通义千问',
    bailian: '百炼',
    doubao: '豆包',
    kimi: 'Kimi',
    siliconflow: '硅基流动',
    glm: '智谱AI',
    ernie: '文心一言',
    spark: '讯飞星火'
  }
  return nameMap[settings.provider] || ''
})

const getProviderInfo = () => {
  const infos = {
    deepseek: '前往 https://platform.deepseek.com 获取API Key',
    qwen: '前往 https://dashscope.aliyuncs.com 获取API Key',
    bailian: '前往 https://bailian.console.aliyun.com 获取API Key',
    doubao: '前往 https://console.volces.com 获取API Key 或 AK/SK',
    kimi: '前往 https://platform.moonshot.cn 获取API Key',
    siliconflow: '前往 https://cloud.siliconflow.cn 获取API Key',
    glm: '前往 https://open.bigmodel.cn 获取API Key',
    ernie: '前往 https://console.bce.baidu.com 获取API Key',
    spark: '前往 https://console.xfyun.cn 获取API Key'
  }
  return infos[settings.provider] || ''
}

const getImageProviderInfo = () => {
  const infos = {
    pollinations: '免费图像生成，无需API Key',
    qwen: '使用通义万相，需要阿里云API Key',
    zhipu: '使用智谱CogView，需要智谱API Key',
    doubao: '使用豆包图像生成，需要豆包API Key'
  }
  return infos[settings.imageProvider] || ''
}

const getModelTip = () => {
  const tips = {
    deepseek: '默认使用 DeepSeek Chat (V3)',
    qwen: '默认使用 Qwen 3.5 Plus',
    bailian: '默认使用 Qwen 3.5 Plus',
    doubao: '默认使用 豆包 Seed 2.0 Pro，如需使用Endpoint ID请在上方填写',
    kimi: '默认使用 Kimi K2.5',
    siliconflow: '默认使用 DeepSeek V3',
    glm: '默认使用 GLM-5',
    ernie: '默认使用 ERNIE 4.0 8K',
    spark: '默认使用 Spark 4.0 Ultra'
  }
  return tips[settings.provider] || ''
}

const getCustomModelPlaceholder = () => {
  const placeholders = {
    deepseek: '输入模型名称（如 deepseek-v3）...',
    doubao: '输入 Endpoint ID（如 ep-20250512195705-c8kq4）...',
    qwen: '输入模型名称（如 qwen3.5-plus）...',
    bailian: '输入模型名称（如 qwen3.5-plus）...',
    kimi: '输入模型名称（如 kimi-k2.5）...',
    siliconflow: '输入模型名称（如 deepseek-ai/DeepSeek-V3）...',
    glm: '输入模型名称（如 glm-5）...',
    ernie: '输入模型名称（如 ernie-4.0-8k）...',
    spark: '输入模型名称（如 4.0Ultra）...'
  }
  return placeholders[settings.provider] || '输入模型名称...'
}

const getCustomModelTip = () => {
  const tips = {
    deepseek: '💡 查看 DeepSeek 官网获取最新模型名称',
    doubao: '💡 Endpoint ID 从火山引擎控制台 → 方舟 → 推理接入点获取',
    qwen: '💡 查看百炼官网获取最新模型名称',
    bailian: '💡 查看百炼官网获取最新模型名称',
    kimi: '💡 查看 Kimi 官网获取最新模型名称',
    siliconflow: '💡 查看硅基流动官网获取完整模型列表',
    glm: '💡 查看智谱AI官网获取最新模型名称',
    ernie: '💡 查看文心一言开发者平台获取最新模型名称',
    spark: '💡 查看讯飞星火开放平台获取最新模型名称'
  }
  return tips[settings.provider] || '💡 查看对应API官网获取模型名称'
}

const selectProvider = (value) => {
  settings.provider = value
  const models = modelOptions[value]
  if (models && models.length > 0) {
    selectedModelOption.value = models[0].value
    settings.model = models[0].value
    settings.modelInputType = 'select'
  }
}

const onModelSelectChange = () => {
  if (selectedModelOption.value) {
    settings.model = selectedModelOption.value
    settings.modelInputType = 'select'
  }
}

watch(() => settings.provider, (newProvider) => {
  const models = modelOptions[newProvider]
  if (models && models.length > 0) {
    if (!settings.model || settings.modelInputType === 'select') {
      selectedModelOption.value = models[0].value
      settings.model = models[0].value
      settings.modelInputType = 'select'
    }
  }
})

onMounted(async () => {
  const saved = localStorage.getItem('tarot-settings')
  if (saved) {
    const savedSettings = JSON.parse(saved)
    Object.assign(settings, savedSettings)
  }
  
  const theme = localStorage.getItem('tarot-theme')
  if (theme) {
    currentTheme.value = theme
  }
  
  if (!settings.model) {
    const models = modelOptions[settings.provider]
    if (models && models.length > 0) {
      selectedModelOption.value = models[0].value
      settings.model = models[0].value
      settings.modelInputType = 'select'
    }
  } else {
    const models = modelOptions[settings.provider]
    if (models) {
      const found = models.find(m => m.value === settings.model)
      if (found) {
        selectedModelOption.value = found.value
        settings.modelInputType = 'select'
      } else {
        selectedModelOption.value = ''
        settings.modelInputType = 'custom'
      }
    }
  }
})

const saveSettings = async () => {
  localStorage.setItem('tarot-settings', JSON.stringify(settings))
  
  testResult.value = {
    success: true,
    message: '配置已保存'
  }
  
  setTimeout(() => {
    testResult.value = null
  }, 3000)
}

const testConnection = async () => {
  if (settings.authType === 'bearer' && !settings.apiKey) {
    testResult.value = { success: false, message: '请先输入API Key' }
    return
  }
  
  if (settings.authType === 'ak_sk' && (!settings.ak || !settings.sk)) {
    testResult.value = { success: false, message: '请先输入Access Key和Secret Key' }
    return
  }
  
  if (!settings.model) {
    testResult.value = { success: false, message: '请选择或输入模型名称' }
    return
  }
  
  isTesting.value = true
  testResult.value = null
  
  try {
    const { apiService } = await import('../services/apiService')
    const result = await apiService.testConnection({
      provider: settings.provider,
      apiKey: settings.apiKey,
      model: settings.model,
      authType: settings.authType,
      ak: settings.ak,
      sk: settings.sk,
      endpointId: settings.endpointId
    })
    testResult.value = result
  } catch (error) {
    testResult.value = { success: false, message: error.message || '测试失败' }
  } finally {
    isTesting.value = false
  }
}

const setTheme = (theme) => {
  currentTheme.value = theme
  localStorage.setItem('tarot-theme', theme)
  window.location.reload()
}

const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    localStorage.removeItem('tarot-history')
    alert('历史记录已清空')
  }
}

const exportData = () => {
  const data = {
    settings: localStorage.getItem('tarot-settings'),
    history: localStorage.getItem('tarot-history'),
    favorites: localStorage.getItem('tarot-favorites'),
    dailyCard: localStorage.getItem('tarot-daily-card')
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tarot-backup-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.settings) localStorage.setItem('tarot-settings', data.settings)
        if (data.history) localStorage.setItem('tarot-history', data.history)
        if (data.favorites) localStorage.setItem('tarot-favorites', data.favorites)
        if (data.dailyCard) localStorage.setItem('tarot-daily-card', data.dailyCard)
        alert('数据导入成功')
        window.location.reload()
      } catch (error) {
        alert('数据格式错误，导入失败')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<style scoped>
.settings-page {
  background: radial-gradient(ellipse at center, rgba(45, 31, 21, 0.8) 0%, rgba(26, 20, 16, 0.95) 100%);
  min-height: calc(100vh - 80px);
}
</style>
