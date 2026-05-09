<template>
  <div class="result-page min-h-full p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-ornate text-3xl text-gold-400 text-center mb-8">✧ 占卜解读 ✧</h1>
      
      <!-- 牌阵展示 -->
      <div class="mb-12">
        <h2 class="text-xl text-gold-300 text-center mb-6">{{ reading?.spreadName }}</h2>
        
        <div class="flex flex-wrap justify-center gap-6">
          <div 
            v-for="(card, index) in reading?.cards" 
            :key="index"
            class="gold-border p-4 rounded-lg w-64"
            style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
          >
            <div class="text-center mb-3">
              <span class="text-gold-400/60 text-sm">{{ card.position?.name }}</span>
              <h3 class="text-lg text-gold-400 font-serif">{{ card.name }}</h3>
              <span class="text-gold-300/50 text-sm">{{ card.nameEn }}</span>
              <div v-if="card.isReversed" class="text-indigo-400 text-xs mt-1">逆位</div>
            </div>
            <div class="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-3"></div>
            <p class="text-gold-300/70 text-sm text-center">
              {{ card.meaning?.upright?.core }}
            </p>
          </div>
        </div>
      </div>

      <!-- AI解读 -->
      <div class="gold-border-ornate p-8 rounded-lg mb-8" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-2xl text-gold-400 text-center mb-2">🔮 AI智能解读</h2>
        <p class="text-gold-300/50 text-sm text-center mb-6">配置API密钥后，AI会根据您的牌阵生成专业的个性化解读</p>
        
        <!-- 维度选择 -->
        <div class="flex flex-wrap justify-center gap-3 mb-6">
          <button 
            v-for="dim in dimensions" 
            :key="dim.value"
            @click="selectedDimension = dim.value"
            class="px-4 py-2 rounded-full text-sm transition-all"
            :class="selectedDimension === dim.value 
              ? 'bg-gold-500/30 text-gold-400 border border-gold-500' 
              : 'bg-mystic-900/50 text-gold-300/70 border border-gold-500/30 hover:border-gold-500/50'"
          >
            {{ dim.label }}
          </button>
        </div>
        
        <!-- 解读内容 -->
        <div v-if="aiReading" class="ai-reading-content text-left">
          <div v-for="(section, index) in aiReading.sections" :key="index" class="mb-6">
            <h3 class="text-gold-400 text-lg mb-2 font-serif">{{ section.title }}</h3>
            <p class="text-gold-200/80 leading-relaxed whitespace-pre-wrap">{{ section.content }}</p>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-else-if="isLoading" class="text-center py-8">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-gold-300/70">正在召唤命运的指引...</p>
        </div>
        
        <!-- 默认提示 -->
        <div v-else class="text-center py-8">
          <div v-if="!hasApiKey" class="mb-4">
            <p class="text-gold-300/60 mb-2">⚠️ 请先配置API密钥</p>
            <p class="text-gold-300/40 text-xs mb-4">前往【设置】页面配置AI服务密钥后即可获取专业解读</p>
          </div>
          <p v-else class="text-gold-300/70 mb-4">选择您想了解的维度，获取针对性解读</p>
          <button 
            @click="hasApiKey ? generateAIReading() : $router.push('/settings')" 
            class="btn-mystical" 
            :disabled="isLoading"
          >
            {{ hasApiKey ? '开始解读' : '前往设置' }}
          </button>
        </div>
      </div>

      <!-- 追问功能 -->
      <div v-if="aiReading" class="gold-border p-6 rounded-lg mb-8" style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h3 class="text-gold-400 text-lg mb-4">💬 继续追问</h3>
        <div class="flex gap-4">
          <input 
            v-model="userQuestion"
            type="text"
            placeholder="输入您的问题..."
            class="input-mystical flex-1 rounded"
            @keyup.enter="askQuestion"
          />
          <button @click="askQuestion" class="btn-mystical" :disabled="!userQuestion.trim() || isAsking">
            {{ isAsking ? '思考中...' : '追问' }}
          </button>
        </div>
        
        <!-- 追问结果 -->
        <div v-if="followUpAnswer" class="mt-6 p-4 rounded bg-mystic-900/50">
          <p class="text-gold-200/80 whitespace-pre-wrap">{{ followUpAnswer }}</p>
        </div>
      </div>

      <!-- AI生成配图 -->
      <div class="text-center mb-8">
        <button 
          @click="generateImage" 
          class="btn-mystical"
          :disabled="isGeneratingImage || !aiReading"
        >
          <span v-if="isGeneratingImage">🎨 创作中...</span>
          <span v-else>🎨 AI生成配图</span>
        </button>
        
        <div v-if="generatedImage" class="mt-6">
          <img :src="generatedImage" alt="塔罗牌配图" class="max-w-md mx-auto rounded-lg border-2 border-gold-500/50" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center gap-4">
        <button @click="$router.push('/reading')" class="btn-mystical">
          再次占卜
        </button>
        <button @click="$router.push('/')" class="btn-mystical bg-transparent">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/apiService'

const router = useRouter()

// 数据
const reading = ref(null)
const aiReading = ref(null)
const isLoading = ref(false)
const selectedDimension = ref('all')
const userQuestion = ref('')
const followUpAnswer = ref('')
const isAsking = ref(false)
const generatedImage = ref('')
const isGeneratingImage = ref(false)
const conversationHistory = ref([])

const dimensions = [
  { label: '综合解读', value: 'all' },
  { label: '💼 事业', value: 'career' },
  { label: '💕 感情', value: 'love' },
  { label: '📚 学业', value: 'study' },
  { label: '💰 财运', value: 'finance' }
]

// 检查是否已配置API密钥
const hasApiKey = computed(() => {
  const settings = JSON.parse(localStorage.getItem('tarot-settings') || '{}')
  return !!settings.apiKey && settings.apiKey.trim() !== ''
})

// 系统提示词
const systemPrompt = `你是专业的塔罗占卜师，精通78张塔罗牌的牌义和解读。
请用诗意的、神秘的语言风格进行解读。
始终保持温暖、鼓励的态度。
当用户追问时，请结合之前的解读继续深入回答。

塔罗牌解读格式：
1. 【核心解读】- 整体牌阵传达的主要信息
2. 【逐卡分析】- 每张牌在各自位置的含义
3. 【建议指引】- 对问卜者的指导建议

请确保解读内容有深度、有洞见，能真正帮助问卜者。`

// 获取卡片含义
const getCardMeaning = (card, dimension) => {
  const orientation = card.isReversed ? 'reversed' : 'upright'
  if (dimension === 'all') {
    return card.meaning[orientation].core
  }
  return card.meaning[orientation][dimension] || card.meaning[orientation].core
}

// 生成AI解读
const generateAIReading = async () => {
  if (!reading.value) return
  
  if (!hasApiKey.value) {
    router.push('/settings')
    return
  }
  
  isLoading.value = true
  
  const cardsDescription = reading.value.cards.map((card, index) => {
    return `第${index + 1}张【${card.position?.name}】: ${card.name}${card.isReversed ? '(逆位)' : ''} - ${getCardMeaning(card, selectedDimension.value)}`
  }).join('\n')

  const dimensionText = selectedDimension.value === 'all' ? '整体运势' : 
    dimensions.find(d => d.value === selectedDimension.value)?.label.replace(/[💼💕📚💰]/g, '')

  const settings = JSON.parse(localStorage.getItem('tarot-settings') || '{}')

  try {
    const response = await apiService.getTarotReading(cardsDescription, dimensionText, settings)
    aiReading.value = formatReading(response)
    conversationHistory.value = [
      { role: 'user', content: `请解读以下塔罗牌阵（${reading.value.spreadName}）：\n${cardsDescription}\n\n请从【${dimensionText}】维度进行解读。` },
      { role: 'assistant', content: response }
    ]
    
    // 更新历史记录，保存AI解读
    if (reading.value && reading.value.id) {
      const history = JSON.parse(localStorage.getItem('tarot-history') || '[]')
      const historyIndex = history.findIndex(h => h.id === reading.value.id)
      if (historyIndex !== -1) {
        history[historyIndex] = {
          ...history[historyIndex],
          aiReading: aiReading.value,
          conversationHistory: conversationHistory.value
        }
        localStorage.setItem('tarot-history', JSON.stringify(history))
      }
    }
  } catch (error) {
    console.error('AI解读失败:', error)
    aiReading.value = {
      sections: [
        {
          title: '⚠️ 解读暂时无法生成',
          content: `错误: ${error.message}\n\n请检查API设置是否正确，或稍后重试。`
        }
      ]
    }
  }
  
  isLoading.value = false
}

// 格式化解读
const formatReading = (text) => {
  return {
    sections: [
      {
        title: '✨ 命运指引',
        content: text
      }
    ]
  }
}

// 追问
const askQuestion = async () => {
  if (!userQuestion.value.trim()) return
  
  isAsking.value = true
  
  const systemPrompt = `你是专业的塔罗占卜师，精通78张塔罗牌的牌义和解读。
请用诗意的、神秘的语言风格进行解读。
始终保持温暖、鼓励的态度。
当用户追问时，请结合之前的解读继续深入回答。

塔罗牌解读格式：
1. 【核心解读】- 整体牌阵传达的主要信息
2. 【逐卡分析】- 每张牌在各自位置的含义
3. 【建议指引】- 对问卜者的指导建议

请确保解读内容有深度、有洞见，能真正帮助问卜者。`

  const settings = JSON.parse(localStorage.getItem('tarot-settings') || '{}')

  try {
    const response = await apiService.chatWithAI(systemPrompt, userQuestion.value, conversationHistory.value, settings)
    followUpAnswer.value = response
    conversationHistory.value.push(
      { role: 'user', content: userQuestion.value },
      { role: 'assistant', content: response }
    )
    userQuestion.value = ''
  } catch (error) {
    followUpAnswer.value = '抱歉，回应暂时无法生成，请稍后重试。'
  }
  
  isAsking.value = false
}

// 生成配图
const generateImage = async () => {
  if (!reading.value) return
  
  isGeneratingImage.value = true
  
  const mainCard = reading.value.cards[0]
  const theme = mainCard.isReversed ? 'mysterious dark' : 'mystical bright'
  
  const prompt = `A mystical tarot card illustration in vintage classical style, featuring ${mainCard.name} symbolism, ${theme} atmosphere, golden ornate borders, aged parchment texture, dark emerald and deep purple colors with gold accents, intricate details, ethereal and magical mood, tarot card art style`

  const settings = JSON.parse(localStorage.getItem('tarot-settings') || '{}')

  try {
    const imageUrl = await apiService.generateTarotImage(prompt, settings)
    generatedImage.value = imageUrl
  } catch (error) {
    console.error('图像生成失败:', error)
    // 出错时使用 Pollinations 作为备用
    generatedImage.value = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&n=1&seed=${Date.now()}`
  }
  
  isGeneratingImage.value = false
}

onMounted(() => {
  // 从路由状态或localStorage获取结果
  if (history.state?.reading) {
    reading.value = history.state.reading
  } else {
    const currentReading = JSON.parse(localStorage.getItem('tarot-current-reading') || '{}')
    if (currentReading && currentReading.id) {
      reading.value = currentReading
    }
  }
})
</script>

<style scoped>
.result-page {
  background: radial-gradient(ellipse at center, rgba(45, 31, 21, 0.8) 0%, rgba(26, 20, 16, 0.95) 100%);
  min-height: calc(100vh - 80px);
}

.ai-reading-content p {
  font-family: 'Noto Serif SC', serif;
}
</style>
