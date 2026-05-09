<template>
  <div class="reading-page min-h-full p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 步骤1: 选择牌阵 -->
      <div v-if="step === 1" class="text-center">
        <!-- 返回首页按钮 -->
        <div class="flex justify-end mb-6">
          <button @click="router.push('/')" class="btn-mystical text-sm py-2 px-4">
            返回首页
          </button>
        </div>
        <h1 class="text-ornate text-3xl text-gold-400 mb-8">选择牌阵</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            v-for="(spread, key) in spreads" 
            :key="key"
            class="gold-border-ornate p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
            :class="selectedSpread === key ? 'bg-emerald-mystical/20 border-gold-400' : 'bg-mystic-950/80'"
            style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
            @click="selectSpread(key)"
          >
            <h3 class="text-ornate text-xl text-gold-400 mb-2">{{ spread.name }}</h3>
            <p class="text-gold-300/60 text-sm mb-4">{{ spread.nameEn }}</p>
            <p class="text-gold-300/70 text-sm">{{ spread.description }}</p>
            <div class="mt-4 text-gold-400/50 text-sm">
              {{ spread.positions.length }} 张牌
            </div>
          </div>
        </div>

        <button 
          v-if="selectedSpread"
          @click="startReading"
          class="btn-mystical"
        >
          开始洗牌
        </button>
      </div>

      <!-- 步骤2-3: 洗牌和抽牌 (扇形动画) -->
      <div v-if="step >= 2 && step <= 3" class="text-center">
        <h1 v-if="step === 2" class="text-ornate text-3xl text-gold-400 mb-4">集中意念，洗涤牌面</h1>
        <h1 v-if="step === 3" class="text-ornate text-3xl text-gold-400 mb-4">请抽取 {{ spread.positions.length }} 张牌</h1>
        <p v-if="step === 2" class="text-gold-300/70 mb-8">请在心中默念您的问题...</p>
        <p v-if="step === 3" class="text-gold-300/70 mb-8">从扇形牌堆中选择您的塔罗牌</p>
        
        <!-- 扇形牌面容器 -->
        <div 
          class="tarot-container relative mx-auto mb-4"
          ref="tarotContainer"
          style="width: 100%; height: 450px;"
        >
          <div 
            v-for="(card, index) in displayCards" 
            :key="'fan-' + card.id + '-' + index"
            class="tarot-card"
            :style="getCardStyle(card, index)"
            :class="{ 
              'card-hover': step === 3 && !drawnCardIds.includes(card.id)
            }"
            @click="step === 3 && !drawnCardIds.includes(card.id) && handleDrawCard(card, index)"
          >
            <!-- 牌背面 -->
            <div class="card-back">
              <div class="tarot-card-inner">
                <div class="tarot-card-inner-inner">
                  <svg class="tarot-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L14 9L21 9L16 14L18 21L12 17L6 21L8 14L3 9L10 9L12 2Z"/>
                  </svg>
                </div>
              </div>
            </div>
            <!-- 牌正面 -->
            <div class="card-front">
              <div class="w-full h-full flex flex-col items-center justify-center p-3">
                <span class="text-2xl mb-2">{{ card.type === 'major' ? '★' : getSuitSymbol(card.suit) }}</span>
                <span class="text-sm text-center font-serif">{{ card.name }}</span>
                <span v-if="card.isReversed" class="text-xs mt-1">逆位</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 已抽牌展示区域 -->
        <div v-if="step === 3 && drawnCards.length > 0" class="flex justify-center gap-4 mb-4" style="margin-top: -60px;">
          <div 
            v-for="(card, index) in drawnCards" 
            :key="'drawn-' + card.id + '-' + index"
            class="drawn-card"
            :style="{ 
              background: 'linear-gradient(135deg, #8b6340 0%, #5c3c25 100%)',
              border: '3px solid #d4af37',
              borderRadius: '8px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              transition: `opacity 0.5s ease ${index * 0.2}s`,
              opacity: index >= 0 ? 1 : 0
            }"
          >
            <!-- 内容层（永远正向显示，绝对不旋转） -->
            <div class="relative z-10 w-full h-full flex flex-col items-center justify-center p-2" style="transform: none !important;">
              <span class="text-gold-300 text-2xl mb-2">{{ card.type === 'major' ? '★' : getSuitSymbol(card.suit) }}</span>
              <span class="text-gold-300 text-sm text-center font-serif leading-tight">{{ card.name }}</span>
              <span class="text-gold-400/60 text-xs font-serif italic mb-1">{{ card.nameEn }}</span>
              <span v-if="card.isReversed" class="text-gold-400/80 text-xs">逆位</span>
            </div>
          </div>
        </div>

        <!-- 信息显示 -->
        <div v-if="step === 2" class="text-gold-400/70 mb-8 text-lg">
          洗牌次数: <span class="text-gold-400">{{ shuffleCount }}</span> / 3
          <span v-if="shuffleCount >= 3" class="ml-4 text-gold-500 animate-pulse">✓ 牌已洗好</span>
        </div>
        <div v-if="step === 3" class="text-gold-400/70 mb-8 text-lg">
          已抽取: <span class="text-gold-400">{{ drawnCards.length }}</span> / {{ spread.positions.length }}
        </div>

        <!-- 按钮区域 -->
        <div class="flex justify-center gap-4" style="margin-top: 40px;">
          <button @click="goBack" class="btn-mystical bg-transparent">返回</button>
          <button 
            v-if="step === 2 && shuffleCount >= 3"
            @click="enterDrawPhase"
            class="btn-mystical scale-in"
          >
            开始抽牌
          </button>
          <button 
            v-if="step === 3 && drawnCards.length >= spread.positions.length"
            @click="goToResult"
            class="btn-mystical scale-in"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span class="loading-spinner w-5 h-5"></span>
              保存中...
            </span>
            <span v-else>查看解读</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCards, spreads as spreadsData } from '@/data/tarot'

const router = useRouter()
const spreads = reactive(spreadsData)

// 状态
const step = ref(1)
const selectedSpread = ref(null)
const deck = ref([])
const shuffleCount = ref(0)
const displayCards = ref([])
const drawnCards = ref([])
const drawnCardIds = ref([])
const isShuffling = ref(false)
const isLoading = ref(false)
const tarotContainer = ref(null)

const CARD_WIDTH = 120
const CARD_HEIGHT = 180

// 计算属性
const spread = computed(() => spreads[selectedSpread.value] || spreads.threeCards)

// 扇形排列核心公式
const calculateFanPosition = (index, totalCards) => {
  const container = tarotContainer.value
  const containerWidth = container ? container.offsetWidth : window.innerWidth
  const containerHeight = container ? container.offsetHeight : 450
  
  const centerX = containerWidth / 2
  const centerY = containerHeight * 0.7 // 往下调整扇形牌
  const radius = Math.min(containerWidth / 2 - 80, 240)
  const startAngle = -60
  const endAngle = 60
  const angleStep = (endAngle - startAngle) / (totalCards - 1)
  
  const angle = startAngle + index * angleStep
  const radian = (angle * Math.PI) / 180
  
  return {
    x: centerX + radius * Math.sin(radian),
    y: centerY - radius * Math.cos(radian),
    rotation: angle,
    zIndex: index
  }
}

// 获取牌样式
const getCardStyle = (card, index) => {
  if (card._drawAnimation) {
    return {
      ...card._drawAnimation.style,
      zIndex: card._drawAnimation.zIndex || 1000
    }
  }
  
  if (card._tempPosition) {
    return {
      position: 'absolute',
      left: `${card._tempPosition.x - CARD_WIDTH / 2}px`,
      top: `${card._tempPosition.y - CARD_HEIGHT / 2}px`,
      width: `${CARD_WIDTH}px`,
      height: `${CARD_HEIGHT}px`,
      transform: `rotate(${card._tempPosition.rotation}deg)`,
      zIndex: card._zIndex || 1,
      transition: card._transition || 'all 0.5s ease'
    }
  }
  
  const pos = calculateFanPosition(index, displayCards.value.length)
  return {
    position: 'absolute',
    left: `${pos.x - CARD_WIDTH / 2}px`,
    top: `${pos.y - CARD_HEIGHT / 2}px`,
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
    transform: `rotate(${pos.rotation}deg)`,
    zIndex: pos.zIndex,
    transition: card._transition || 'all 0.5s ease'
  }
}

// 方法
const selectSpread = (key) => {
  selectedSpread.value = key
}

const startReading = () => {
  deck.value = [...getAllCards()]
  shuffleDeck()
  displayCards.value = deck.value.slice(0, 15).map((card, i) => ({
    ...card,
    _index: i,
    _originalIndex: i
  }))
  
  nextTick(() => {
    step.value = 2
    shuffleCount.value = 0
    setTimeout(() => startShuffle(), 500)
  })
}

const shuffleDeck = () => {
  for (let i = deck.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck.value[i], deck.value[j]] = [deck.value[j], deck.value[i]]
  }
}

const shuffleArray = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const startShuffle = () => {
  if (shuffleCount.value >= 3) {
    return
  }
  
  isShuffling.value = true
  
  const container = tarotContainer.value
  const containerWidth = container ? container.offsetWidth : window.innerWidth
  const containerHeight = container ? container.offsetHeight : 450
  const centerX = containerWidth / 2
  const centerY = containerHeight * 0.75
  
  displayCards.value.forEach((card, index) => {
    setTimeout(() => {
      card._transition = 'all 0.3s ease-in-out'
      card._tempPosition = {
        x: centerX,
        y: centerY,
        rotation: 0
      }
      card._zIndex = index
    }, index * 30)
  })
  displayCards.value = [...displayCards.value]
  
  setTimeout(() => {
    shuffleCount.value++
    
    displayCards.value = shuffleArray(displayCards.value).map((card, i) => ({
      ...card,
      _index: i
    }))
    
    displayCards.value.forEach((card, index) => {
      setTimeout(() => {
        card._transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        delete card._tempPosition
        card._zIndex = null
      }, index * 40)
    })
    
    setTimeout(() => {
      isShuffling.value = false
      
      if (shuffleCount.value < 3) {
        setTimeout(() => startShuffle(), 800)
      }
    }, 1200)
  }, 800)
}

const enterDrawPhase = () => {
  displayCards.value.forEach((card, i) => {
    card._transition = 'all 0.4s ease'
  })
  step.value = 3
}

const handleDrawCard = (card, index) => {
  if (drawnCards.value.length >= spread.value.positions.length) {
    return
  }
  
  drawnCardIds.value.push(card.id)
  
  const selectedCard = { ...deck.value.find(c => c.id === card.id) || card }
  selectedCard.isReversed = false
  selectedCard.position = spread.value.positions[drawnCards.value.length]
  drawnCards.value.push(selectedCard)
  
  card._drawAnimation = {
    style: {
      opacity: 0,
      pointerEvents: 'none'
    }
  }
  displayCards.value = [...displayCards.value]
}

const getSuitSymbol = (suit) => {
  const symbols = { wands: '🔥', cups: '💧', swords: '⚔️', pentacles: '💰' }
  return symbols[suit] || '★'
}

const goBack = () => {
  if (step.value === 2) {
    step.value = 1
  } else if (step.value === 3) {
    resetDrawPhase()
    step.value = 2
  }
}

const resetDrawPhase = () => {
  drawnCards.value = []
  drawnCardIds.value = []
  displayCards.value.forEach(card => {
    delete card._drawAnimation
  })
  displayCards.value = [...displayCards.value]
}

const goToResult = () => {
  isLoading.value = true
  
  const allCards = getAllCards()
  const cardsWithMeaning = drawnCards.value.map(drawnCard => {
    const fullCard = allCards.find(c => c.id === drawnCard.id)
    return {
      ...drawnCard,
      meaning: fullCard ? fullCard.meaning : drawnCard.meaning
    }
  })
  
  const reading = {
    id: Date.now(),
    spread: selectedSpread.value,
    spreadName: spread.value.name,
    cards: cardsWithMeaning,
    timestamp: new Date().toISOString()
  }
  
  const history = JSON.parse(localStorage.getItem('tarot-history') || '[]')
  history.unshift(reading)
  localStorage.setItem('tarot-history', JSON.stringify(history.slice(0, 50)))
  
  localStorage.setItem('tarot-current-reading', JSON.stringify(reading))
  
  setTimeout(() => {
    isLoading.value = false
    router.push({
      name: 'Result',
      query: { readingId: reading.id }
    })
  }, 500)
}
</script>

<style scoped>
.reading-page {
  background: radial-gradient(ellipse at center, rgba(45, 31, 21, 0.8) 0%, rgba(26, 20, 16, 0.95) 100%);
  min-height: calc(100vh - 80px);
}

.tarot-container {
  perspective: 1500px;
}

.tarot-card {
  position: absolute;
  width: 120px;
  height: 180px;
  background: linear-gradient(135deg, #1a4d3c 0%, #0f3026 100%);
  border: 3px solid #d4af37;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.5s ease;
}

.tarot-card.card-hover:hover {
  transform: translateY(-10px) scale(1.05) rotate(var(--rotation, 0deg)) !important;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  z-index: 1000 !important;
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 5px;
}

.card-back {
  background: linear-gradient(135deg, #1a4d3c 0%, #0f3026 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tarot-card-inner {
  width: 80%;
  height: 80%;
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tarot-card-inner-inner {
  width: 70%;
  height: 70%;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tarot-star {
  width: 30px;
  height: 30px;
  color: rgba(212, 175, 55, 0.9);
}

.card-front {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #2d1f15 0%, #1a1410 100%);
  color: #d4af37;
  border: 2px solid #d4af37;
}

.rotate-180 {
  transform: rotate(180deg);
}

.card-fly-in {
  animation: fly-in-from-top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

.drawn-card {
  width: 120px !important;
  height: 180px !important;
  position: relative !important;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.drawn-card .tarot-star {
  width: 16px !important;
  height: 16px !important;
}

@keyframes fly-in-from-top {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 抽到的牌 - 和扇形牌一样大，永远正向显示 */
.drawn-card {
  width: 120px !important;
  height: 180px !important;
  position: relative !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 抽到的牌淡入动画 - 仅使用opacity，完全避免transform和margin变化 */
@keyframes drawn-card-appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 确保抽到的牌内容永远正向 */
.drawn-card .z-10 {
  transform: none !important;
  transform-style: flat !important;
}
</style>
