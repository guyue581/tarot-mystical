<template>
  <div class="home-page min-h-full flex flex-col items-center justify-center p-8 relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-mystical/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主内容 -->
    <div class="relative z-10 text-center max-w-4xl">
      <!-- 标题 -->
      <div class="mb-12 fade-in-up">
        <div class="text-gold-400 text-4xl mb-4 animate-pulse">✧ ✦ ✧</div>
        <h1 class="text-ornate text-5xl md:text-6xl text-gold-400 mb-4 tracking-wider text-shimmer">
          塔罗牌 Mystical
        </h1>
        <p class="text-gold-300/70 text-lg font-serif">
          探索命运的奥秘，聆听星辰的低语
        </p>
        <div class="text-gold-400 text-4xl mt-4 animate-pulse">✧ ✦ ✧</div>
      </div>

      <!-- 今日运势卡片 -->
      <div v-if="dailyCard" class="mb-12 gold-border-ornate bg-mystic-950/80 backdrop-blur-sm p-8 rounded-lg" 
           style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
        <h2 class="text-ornate text-2xl text-gold-400 mb-6">✨ 今日运势</h2>
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- 直接展示牌面，不使用翻转动画避免文字镜像 -->
          <div class="w-32 h-48 flex-shrink-0 rounded-lg flex flex-col items-center justify-center p-4 border-2 border-gold-500 bg-gradient-to-br from-mystic-700 to-mystic-900 shadow-lg">
            <span class="text-gold-400 text-2xl mb-2">{{ dailyCard.type === 'major' ? '★' : getSuitSymbol(dailyCard.suit) }}</span>
            <span class="text-gold-300 text-sm text-center font-serif">{{ dailyCard.name }}</span>
            <span class="text-gold-500/60 text-xs mt-2">{{ dailyCard.nameEn }}</span>
          </div>
          <div class="text-left flex-1">
            <h3 class="text-xl text-gold-400 mb-3 font-serif">
              {{ dailyCard.name }}
              <span class="text-gold-300/60 text-base ml-2">{{ dailyCard.nameEn }}</span>
            </h3>
            <p class="text-gold-200/80 text-sm mb-4">
              {{ dailyCard.type === 'major' ? dailyCard.description : '小阿卡那 · ' + getSuitName(dailyCard.suit) }}
            </p>
            <p class="text-gold-300/70 text-sm italic">
              "{{ dailyCard.meaning?.upright?.core }}"
            </p>
          </div>
        </div>
        <button 
          @click="resetDailyCard"
          class="mt-6 text-gold-400/60 hover:text-gold-400 text-sm transition-colors"
        >
          重新抽取
        </button>
      </div>

      <!-- 功能入口卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- 开始占卜 -->
        <div class="magic-glow gold-border-ornate bg-mystic-950/80 backdrop-blur-sm p-8 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
             style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
             @click="$router.push('/reading')">
          <div class="text-4xl mb-4 text-gold-400">🔮</div>
          <h3 class="text-ornate text-xl text-gold-400 mb-2">开始占卜</h3>
          <p class="text-gold-300/70 text-sm">选择牌阵，开启命运的指引</p>
        </div>

        <!-- 牌义词典 -->
        <div class="magic-glow gold-border-ornate bg-mystic-950/80 backdrop-blur-sm p-8 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
             style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
             @click="$router.push('/dictionary')">
          <div class="text-4xl mb-4 text-gold-400">📜</div>
          <h3 class="text-ornate text-xl text-gold-400 mb-2">牌义词典</h3>
          <p class="text-gold-300/70 text-sm">探索78张塔罗牌的深层含义</p>
        </div>

        <!-- 历史记录 -->
        <div class="magic-glow gold-border-ornate bg-mystic-950/80 backdrop-blur-sm p-8 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
             style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
             @click="$router.push('/history')">
          <div class="text-4xl mb-4 text-gold-400">📚</div>
          <h3 class="text-ornate text-xl text-gold-400 mb-2">历史记录</h3>
          <p class="text-gold-300/70 text-sm">回顾过往的占卜历程</p>
        </div>

        <!-- 设置 -->
        <div class="magic-glow gold-border-ornate bg-mystic-950/80 backdrop-blur-sm p-8 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
             style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
             @click="$router.push('/settings')">
          <div class="text-4xl mb-4 text-gold-400">⚙️</div>
          <h3 class="text-ornate text-xl text-gold-400 mb-2">设置</h3>
          <p class="text-gold-300/70 text-sm">配置AI密钥与偏好</p>
        </div>
      </div>

      <!-- 底部引言 -->
      <div class="text-gold-300/70 text-base italic font-serif text-classical">
        <p>"牌面诉说着命运的诗篇，而你，是诗篇的执笔者。"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllCards } from '@/data/tarot'

const dailyCard = ref(null)
const showDailyCard = ref(false)

const getSuitSymbol = (suit) => {
  const symbols = { wands: '🔥', cups: '💧', swords: '⚔️', pentacles: '💰' }
  return symbols[suit] || '★'
}

const getSuitName = (suit) => {
  const names = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '金币' }
  return names[suit] || ''
}

const loadDailyCard = () => {
  const savedDaily = localStorage.getItem('tarot-daily-card')
  const savedDate = localStorage.getItem('tarot-daily-date')
  const today = new Date().toDateString()
  
  if (savedDaily && savedDate === today) {
    dailyCard.value = JSON.parse(savedDaily)
    setTimeout(() => showDailyCard.value = true, 100)
  } else {
    // 随机抽取一张牌
    const allCards = getAllCards()
    const randomIndex = Math.floor(Math.random() * allCards.length)
    dailyCard.value = allCards[randomIndex]
    localStorage.setItem('tarot-daily-card', JSON.stringify(dailyCard.value))
    localStorage.setItem('tarot-daily-date', today)
    setTimeout(() => showDailyCard.value = true, 100)
  }
}

const resetDailyCard = () => {
  showDailyCard.value = false
  setTimeout(() => {
    const allCards = getAllCards()
    const randomIndex = Math.floor(Math.random() * allCards.length)
    dailyCard.value = allCards[randomIndex]
    localStorage.setItem('tarot-daily-card', JSON.stringify(dailyCard.value))
    localStorage.setItem('tarot-daily-date', new Date().toDateString())
    setTimeout(() => showDailyCard.value = true, 100)
  }, 300)
}

onMounted(() => {
  loadDailyCard()
})
</script>

<style scoped>
.home-page {
  background: radial-gradient(ellipse at center, rgba(45, 31, 21, 0.8) 0%, rgba(26, 20, 16, 0.95) 100%);
}
</style>
