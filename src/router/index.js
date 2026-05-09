import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Reading from '@/components/Reading.vue'
import Result from '@/components/Result.vue'
import Dictionary from '@/components/Dictionary.vue'
import History from '@/components/History.vue'
import Settings from '@/components/Settings.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/reading', name: 'Reading', component: Reading },
  { path: '/result', name: 'Result', component: Result },
  { path: '/dictionary', name: 'Dictionary', component: Dictionary },
  { path: '/history', name: 'History', component: History },
  { path: '/settings', name: 'Settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
