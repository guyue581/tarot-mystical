<template>
  <div class="app-container h-full" :class="isDark ? 'dark-theme' : 'light-theme'">
    <!-- 羽毛动画装饰 -->
    <div class="feathers-container">
      <div v-for="i in 8" :key="i" class="feather" :style="getFeatherStyle(i)">
        ✦
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="nav-mystical fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3">
        <span class="text-2xl text-gold-400">✧</span>
        <span class="text-ornate text-xl text-gold-400 tracking-wider">塔罗牌 Mystical</span>
        <span class="text-2xl text-gold-400">✧</span>
      </router-link>
      
      <div class="flex items-center gap-6">
        <button @click="toggleTheme" class="text-gold-400 hover:text-gold-300 transition-colors">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="pt-20 h-full overflow-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :isDark="isDark" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isDark = ref(true)

// 从localStorage加载主题设置
onMounted(() => {
  const savedTheme = localStorage.getItem('tarot-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('tarot-theme', isDark.value ? 'dark' : 'light')
}

// 随机羽毛位置
const getFeatherStyle = (i) => {
  const positions = [
    { left: '10%', animationDelay: '0s', animationDuration: '15s' },
    { left: '25%', animationDelay: '2s', animationDuration: '18s' },
    { left: '40%', animationDelay: '4s', animationDuration: '12s' },
    { left: '55%', animationDelay: '1s', animationDuration: '20s' },
    { left: '70%', animationDelay: '3s', animationDuration: '16s' },
    { left: '85%', animationDelay: '5s', animationDuration: '14s' },
    { left: '5%', animationDelay: '6s', animationDuration: '17s' },
    { left: '92%', animationDelay: '7s', animationDuration: '13s' }
  ]
  return {
    left: positions[i - 1].left,
    animationDelay: positions[i - 1].animationDelay,
    animationDuration: positions[i - 1].animationDuration,
    fontSize: `${12 + Math.random() * 10}px`,
    color: i % 2 === 0 ? '#d4a84b' : '#966e20'
  }
}
</script>

<style scoped>
.app-container {
  background: linear-gradient(135deg, #1a1410 0%, #2d1f15 50%, #1a1410 100%);
  min-height: 100vh;
}

.light-theme {
  background: linear-gradient(135deg, #f4e4bc 0%, #e8d5a3 50%, #f4e4bc 100%);
}

.feathers-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.feather {
  position: absolute;
  top: -50px;
  opacity: 0.4;
  animation: feather-fall linear infinite;
}

@keyframes feather-fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
