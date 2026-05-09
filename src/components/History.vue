<template>
  <div class="history-page min-h-full p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 返回首页按钮 -->
      <div class="flex justify-between items-center mb-6">
        <button @click="$router.push('/')" class="btn-mystical text-sm py-2 px-4">
           返回首页
        </button>
        <button @click="$router.push('/reading')" class="btn-mystical text-sm py-2 px-4">
          🔮 开始占卜
        </button>
      </div>
      
      <h1 class="text-ornate text-3xl text-gold-400 text-center mb-8">✧ 占卜历史 ✧</h1>
      
      <!-- 空状态 -->
      <div v-if="history.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4 text-gold-400/30">📜</div>
        <p class="text-gold-300/60 mb-4">暂无占卜记录</p>
        <button @click="$router.push('/reading')" class="btn-mystical">
          开始占卜
        </button>
      </div>

      <!-- 历史列表 -->
      <div v-else class="space-y-6">
        <div 
          v-for="(item, index) in history" 
          :key="item.id || index"
          class="gold-border rounded-lg p-6"
          style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-gold-400 text-lg">{{ item.spreadName }}</h3>
              <span class="text-gold-300/50 text-sm">{{ formatDate(item.timestamp) }}</span>
            </div>
            <button 
              @click="deleteHistory(index)"
              class="text-gold-400/40 hover:text-red-400 transition-colors"
            >
              🗑️
            </button>
          </div>

          <!-- 牌阵预览 -->
          <div class="flex flex-wrap gap-3 mb-4">
            <div 
              v-for="(card, cardIndex) in item.cards" 
              :key="cardIndex"
              class="px-3 py-2 rounded bg-mystic-900/50 border border-gold-500/30"
            >
              <span class="text-gold-400/60 text-xs">{{ card.position?.name }}</span>
              <p class="text-gold-300 text-sm">
                {{ card.name }}
                <span v-if="card.isReversed" class="text-indigo-400 text-xs ml-1">逆</span>
              </p>
            </div>
          </div>

          <!-- AI解读摘要 -->
          <div v-if="item.aiReading" class="mb-4 p-4 rounded-lg bg-gold-500/10 border border-gold-500/30">
            <h4 class="text-gold-400 text-sm mb-2 font-serif">✨ 核心解读</h4>
            <p class="text-gold-300/80 text-sm leading-relaxed">
              {{ getAISummary(item.aiReading) }}
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3">
            <button 
              @click="viewDetail(item)"
              class="btn-mystical text-sm py-2 px-4"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>

      <!-- 详情弹窗 -->
      <div 
        v-if="selectedReading"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="selectedReading = null"
      >
        <div class="gold-border-ornate rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-auto"
             style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-ornate text-2xl text-gold-400">{{ selectedReading.spreadName }}</h2>
              <span class="text-gold-300/60">{{ formatDate(selectedReading.timestamp) }}</span>
            </div>
            <button @click="selectedReading = null" class="text-gold-400/60 hover:text-gold-400 text-2xl">
              ×
            </button>
          </div>

          <!-- AI解读 - 放在最前面，更重要 -->
          <div v-if="selectedReading.aiReading" class="mb-8 p-6 rounded-lg bg-gold-500/5 border border-gold-500/30">
            <h3 class="text-ornate text-xl text-gold-400 mb-4">✨ AI完整解读</h3>
            <div v-for="(section, index) in selectedReading.aiReading.sections" :key="index" class="mb-6 last:mb-0">
              <h4 class="text-gold-300 text-lg mb-2 font-serif">{{ section.title }}</h4>
              <p class="text-gold-300/80 whitespace-pre-line leading-relaxed">{{ section.content }}</p>
            </div>
          </div>

          <!-- 牌阵详情 -->
          <div class="space-y-4 mb-6">
            <h3 class="text-ornate text-xl text-gold-400 mb-4">🎴 牌阵详情</h3>
            <div 
              v-for="(card, index) in selectedReading.cards" 
              :key="index"
              class="gold-border p-4 rounded-lg"
            >
              <div class="flex items-center gap-3 mb-3">
                <span class="text-gold-500">{{ index + 1 }}</span>
                <div>
                  <h3 class="text-gold-400 font-serif">{{ card.name }}</h3>
                  <span class="text-gold-300/50 text-sm">{{ card.nameEn }}</span>
                </div>
                <span v-if="card.isReversed" class="ml-auto px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs rounded">
                  逆位
                </span>
              </div>
              <p class="text-gold-300/60 text-sm mb-2">
                <span class="text-gold-400">位置:</span> {{ card.position?.name }}
              </p>
              <p class="text-gold-300/80">
                {{ card.meaning?.upright?.core }}
              </p>
            </div>
          </div>

          <button @click="selectedReading = null" class="btn-mystical w-full">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const history = ref([])
const selectedReading = ref(null)

// 加载历史记录
const loadHistory = () => {
  history.value = JSON.parse(localStorage.getItem('tarot-history') || '[]')
}

loadHistory()

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 查看详情
const viewDetail = (item) => {
  selectedReading.value = item
}

// 删除记录
const deleteHistory = (index) => {
  if (confirm('确定要删除这条记录吗？')) {
    history.value.splice(index, 1)
    localStorage.setItem('tarot-history', JSON.stringify(history.value))
  }
}

// 获取AI解读摘要
const getAISummary = (aiReading) => {
  if (!aiReading || !aiReading.sections || aiReading.sections.length === 0) {
    return '暂无AI解读，请点击"查看详情"查看完整解读'
  }
  
  // 优先找"整体解读"或"核心解读"相关的section
  const keywordSections = ['整体', '核心', '总', '概述', '总结']
  for (const section of aiReading.sections) {
    for (const keyword of keywordSections) {
      if (section.title.includes(keyword)) {
        return section.content.length > 200 ? section.content.substring(0, 200) + '...' : section.content
      }
    }
  }
  
  // 如果没有找到关键词，返回第一个section的内容
  const firstSection = aiReading.sections[0]
  return firstSection.content.length > 200 ? firstSection.content.substring(0, 200) + '...' : firstSection.content
}
</script>

<style scoped>
.history-page {
  background: radial-gradient(ellipse at center, rgba(45, 31, 21, 0.8) 0%, rgba(26, 20, 16, 0.95) 100%);
  min-height: calc(100vh - 80px);
}
</style>
