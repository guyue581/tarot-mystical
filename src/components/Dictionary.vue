<template>
  <div class="dictionary-page min-h-full p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 返回首页按钮 -->
      <div class="flex justify-end mb-6">
        <button @click="$router.push('/')" class="btn-mystical text-sm py-2 px-4">
          返回首页
        </button>
      </div>
      
      <h1 class="text-ornate text-3xl text-gold-400 text-center mb-8">✧ 牌义词典 ✧</h1>
      
      <!-- 搜索和筛选 -->
      <div class="mb-8 flex flex-wrap gap-4 justify-center">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索牌名..."
          class="input-mystical w-full md:w-80 rounded"
        />
        
        <select v-model="filterType" @change="onFilterTypeChange" class="input-mystical rounded">
          <option value="all">全部牌</option>
          <option value="major">大阿卡那 (22张)</option>
          <option value="minor">小阿卡那 (56张)</option>
        </select>
        
        <select v-model="filterSuit" class="input-mystical rounded" v-if="filterType !== 'major'">
          <option value="all">全部花色</option>
          <option value="wands">权杖</option>
          <option value="cups">圣杯</option>
          <option value="swords">宝剑</option>
          <option value="pentacles">金币</option>
        </select>
      </div>

      <!-- 大阿卡那 -->
      <div v-if="filterType === 'all' || filterType === 'major'" class="mb-12">
        <h2 class="text-ornate text-2xl text-gold-400 mb-6 flex items-center gap-3">
          <span class="text-gold-500">★</span>
          大阿卡那 Major Arcana
          <span class="text-gold-500">★</span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="card in filteredMajorArcana" 
            :key="card.id"
            @click="selectCard(card)"
            class="gold-border p-4 rounded-lg cursor-pointer transition-all hover:scale-105"
            :class="{ 'bg-emerald-mystical/20': selectedCard?.id === card.id }"
            style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
          >
            <div class="flex items-center gap-3 mb-2">
              <span class="text-gold-500 text-lg">{{ card.id }}</span>
              <div>
                <h3 class="text-gold-400 font-serif">{{ card.name }}</h3>
                <span class="text-gold-300/50 text-xs">{{ card.nameEn }}</span>
              </div>
            </div>
            <p class="text-gold-300/60 text-sm line-clamp-2">{{ card.meaning.upright.core }}</p>
          </div>
        </div>
      </div>

      <!-- 小阿卡那 -->
      <div v-if="filterType === 'all' || filterType === 'minor'" class="mb-12">
        <div v-for="(suit, suitKey) in minorArcana" :key="suitKey" class="mb-8">
          <h2 class="text-ornate text-2xl text-gold-400 mb-4 flex items-center gap-3"
              v-if="filterSuit === 'all' || filterSuit === suitKey">
            <span class="text-2xl">{{ getSuitEmoji(suitKey) }}</span>
            {{ suit.name }} {{ suit.nameEn }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
               v-if="filterSuit === 'all' || filterSuit === suitKey">
            <div 
              v-for="card in filteredMinorArcana(suitKey)" 
              :key="card.id"
              @click="selectCard(card)"
              class="gold-border p-4 rounded-lg cursor-pointer transition-all hover:scale-105"
              :class="{ 'bg-emerald-mystical/20': selectedCard?.id === card.id }"
              style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);"
            >
              <h3 class="text-gold-400 font-serif mb-1">{{ card.name }}</h3>
              <span class="text-gold-300/50 text-xs">{{ card.nameEn }}</span>
              <p class="text-gold-300/60 text-sm mt-2 line-clamp-2">{{ card.meaning.upright.core }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 选中卡片详情弹窗 -->
      <div 
        v-if="selectedCard" 
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="selectedCard = null"
      >
        <div class="gold-border-ornate rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-auto"
             style="background: linear-gradient(135deg, #1a1410 0%, #2d1f15 100%);">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-ornate text-3xl text-gold-400">{{ selectedCard.name }}</h2>
              <span class="text-gold-300/60">{{ selectedCard.nameEn }}</span>
            </div>
            <button @click="selectedCard = null" class="text-gold-400/60 hover:text-gold-400 text-2xl">
              ×
            </button>
          </div>

          <!-- 牌面描述 -->
          <div v-if="selectedCard.description" class="mb-6">
            <h3 class="text-gold-400/80 text-lg mb-2">牌面</h3>
            <p class="text-gold-200/80">{{ selectedCard.description }}</p>
          </div>

          <!-- 元素 -->
          <div v-if="selectedCard.element" class="mb-6">
            <span class="text-gold-500/60">元素: {{ selectedCard.element }}</span>
          </div>

          <!-- 正位解读 -->
          <div class="mb-6">
            <h3 class="text-gold-400 text-lg mb-3 flex items-center gap-2">
              <span class="text-green-400">▲</span> 正位
            </h3>
            <div class="space-y-3">
              <div v-if="selectedCard.meaning?.upright?.core">
                <span class="text-gold-300/70">核心含义:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.upright.core }}</p>
              </div>
              <div v-if="selectedCard.meaning?.upright?.love" class="mt-2">
                <span class="text-gold-300/70">💕 感情:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.upright.love }}</p>
              </div>
              <div v-if="selectedCard.meaning?.upright?.career">
                <span class="text-gold-300/70">💼 事业:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.upright.career }}</p>
              </div>
              <div v-if="selectedCard.meaning?.upright?.finance">
                <span class="text-gold-300/70">💰 财运:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.upright.finance }}</p>
              </div>
              <div v-if="selectedCard.meaning?.upright?.health">
                <span class="text-gold-300/70">🏥 健康:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.upright.health }}</p>
              </div>
            </div>
          </div>

          <!-- 逆位解读 -->
          <div class="mb-6">
            <h3 class="text-indigo-400 text-lg mb-3 flex items-center gap-2">
              <span class="text-indigo-400">▼</span> 逆位
            </h3>
            <div class="space-y-3">
              <div v-if="selectedCard.meaning?.reversed?.core">
                <span class="text-gold-300/70">核心含义:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.reversed.core }}</p>
              </div>
              <div v-if="selectedCard.meaning?.reversed?.love" class="mt-2">
                <span class="text-gold-300/70">💕 感情:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.reversed.love }}</p>
              </div>
              <div v-if="selectedCard.meaning?.reversed?.career" class="mt-2">
                <span class="text-gold-300/70">💼 事业:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.reversed.career }}</p>
              </div>
              <div v-if="selectedCard.meaning?.reversed?.finance" class="mt-2">
                <span class="text-gold-300/70">💰 财运:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.reversed.finance }}</p>
              </div>
              <div v-if="selectedCard.meaning?.reversed?.health" class="mt-2">
                <span class="text-gold-300/70">🏥 健康:</span>
                <p class="text-gold-200/80">{{ selectedCard.meaning.reversed.health }}</p>
              </div>
            </div>
          </div>

          <!-- 收藏按钮 -->
          <div class="flex gap-4">
            <button 
              @click="toggleFavorite(selectedCard)"
              class="btn-mystical flex-1"
            >
              {{ isFavorite(selectedCard) ? '★ 已收藏' : '☆ 收藏' }}
            </button>
            <button @click="selectedCard = null" class="btn-mystical bg-transparent flex-1">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { majorArcana, minorArcana, getAllMinorArcana } from '@/data/tarot'

const searchQuery = ref('')
const filterType = ref('all')
const filterSuit = ref('all')
const selectedCard = ref(null)
const favorites = ref([])

// 切换牌组类型时重置花色
const onFilterTypeChange = () => {
  filterSuit.value = 'all'
}

// 从localStorage加载收藏
const loadFavorites = () => {
  favorites.value = JSON.parse(localStorage.getItem('tarot-favorites') || '[]')
}

loadFavorites()

// 筛选大阿卡那
const filteredMajorArcana = computed(() => {
  let cards = majorArcana
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cards = cards.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.nameEn.toLowerCase().includes(query)
    )
  }
  return cards
})

// 筛选小阿卡那
const filteredMinorArcana = (suitKey) => {
  let cards = minorArcana[suitKey].suits
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cards = cards.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.nameEn.toLowerCase().includes(query)
    )
  }
  return cards
}

// 获取花色emoji
const getSuitEmoji = (suit) => {
  const emojis = { wands: '🔥', cups: '💧', swords: '⚔️', pentacles: '💰' }
  return emojis[suit] || '★'
}

// 选择卡片
const selectCard = (card) => {
  selectedCard.value = card
}

// 切换收藏
const toggleFavorite = (card) => {
  const id = card.id || card.name
  const index = favorites.value.findIndex(f => f.id === card.id || f.name === card.name)
  
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(card)
  }
  
  localStorage.setItem('tarot-favorites', JSON.stringify(favorites.value))
}

// 检查是否已收藏
const isFavorite = (card) => {
  return favorites.value.some(f => f.id === card.id || f.name === card.name)
}
</script>

<style scoped>
.dictionary-page {
  background: radial-gradient(ellipse at center, rgba(45, 31, 21, 0.8) 0%, rgba(26, 20, 16, 0.95) 100%);
  min-height: calc(100vh - 80px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
