<template>
  <div 
    class="tarot-card-component cursor-pointer transition-all duration-300"
    :class="{ 
      'hover:scale-110': interactive,
      'card-flip': isFlipping 
    }"
    @click="handleClick"
  >
    <!-- 背面 -->
    <div 
      v-if="!isRevealed" 
      class="tarot-card tarot-card-back w-full h-full"
      :style="{ width: cardWidth, height: cardHeight }"
    >
    </div>
    
    <!-- 正面 -->
    <div 
      v-else 
      class="w-full h-full rounded-lg flex flex-col items-center justify-center p-3 border-2"
      :class="card.isReversed ? 'bg-indigo-900/80 border-indigo-400' : 'bg-gradient-to-br from-mystic-700 to-mystic-900 border-gold-500'"
      :style="{ width: cardWidth, height: cardHeight, transform: card.isReversed ? 'rotate(180deg)' : 'none' }"
    >
      <span class="text-2xl mb-1" :class="card.isReversed ? 'text-indigo-300' : 'text-gold-400'">
        {{ getCardSymbol() }}
      </span>
      <span class="text-xs text-center font-serif" :class="card.isReversed ? 'text-indigo-200' : 'text-gold-300'">
        {{ card.name }}
      </span>
      <span v-if="card.isReversed" class="text-xs text-indigo-300 mt-1">逆位</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  interactive: {
    type: Boolean,
    default: true
  },
  cardWidth: {
    type: String,
    default: '120px'
  },
  cardHeight: {
    type: String,
    default: '200px'
  }
})

const emit = defineEmits(['click', 'reveal'])

const isRevealed = ref(false)
const isFlipping = ref(false)

const getCardSymbol = () => {
  if (props.card.type === 'major') return '★'
  const symbols = { wands: '🔥', cups: '💧', swords: '⚔️', pentacles: '💰' }
  return symbols[props.card.suit] || '★'
}

const handleClick = () => {
  if (!props.interactive) return
  
  if (!isRevealed.value) {
    flipCard()
  }
  
  emit('click', props.card)
}

const flipCard = () => {
  isFlipping.value = true
  
  setTimeout(() => {
    isRevealed.value = !isRevealed.value
    isFlipping.value = false
    if (isRevealed.value) {
      emit('reveal', props.card)
    }
  }, 400)
}

const reveal = () => {
  if (!isRevealed.value) {
    flipCard()
  }
}

const hide = () => {
  if (isRevealed.value) {
    flipCard()
  }
}

defineExpose({ reveal, hide, flipCard })
</script>

<style scoped>
.tarot-card-component {
  transform-style: preserve-3d;
}
</style>
