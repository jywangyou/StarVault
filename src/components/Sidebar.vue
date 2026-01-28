<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Settings, User, Moon, Sun, PanelLeft, PanelRight } from 'lucide-vue-next'

// Types
type Position = 'left' | 'right'
type Theme = 'light' | 'dark'

interface Config {
  position: Position
  theme: Theme
}

const emit = defineEmits<{
  (e: 'update:position', position: Position): void
  (e: 'update:theme', theme: Theme): void
}>()

// State
const config = ref<Config>({
  position: 'right',
  theme: 'light'
})
const showSettings = ref(false)

// Storage helper
const storage = {
  async get(): Promise<Partial<Config>> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get(['sidebarConfig'])
        return result.sidebarConfig || {}
      }
    } catch (e) {
      console.warn('Chrome storage not available', e)
    }
    
    try {
      const local = localStorage.getItem('sidebarConfig')
      return local ? JSON.parse(local) : {}
    } catch (e) {
      return {}
    }
  },
  async set(value: Config) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ sidebarConfig: value })
      }
    } catch (e) {
      // Ignore
    }
    localStorage.setItem('sidebarConfig', JSON.stringify(value))
  }
}

// Initialize
onMounted(async () => {
  const saved = await storage.get()
  config.value = { ...config.value, ...saved }
  
  // Initial emit
  emit('update:position', config.value.position)
  emit('update:theme', config.value.theme)
  applyTheme(config.value.theme)
})

// Watchers
watch(() => config.value.theme, (newTheme) => {
  applyTheme(newTheme)
  saveConfig()
})

watch(() => config.value.position, (newPosition) => {
  emit('update:position', newPosition)
  saveConfig()
})

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  emit('update:theme', theme)
}

function saveConfig() {
  storage.set(config.value)
}

function toggleSettings() {
  showSettings.value = !showSettings.value
}

function setPosition(pos: Position) {
  config.value.position = pos
}

function setTheme(t: Theme) {
  config.value.theme = t
}
</script>

<template>
  <div 
    class="flex flex-col items-center justify-between w-[45px] py-4 bg-white dark:bg-dark-bg border-zinc-200 dark:border-zinc-800 transition-colors duration-300 shadow-sm h-full"
    :class="[config.position === 'right' ? 'border-l' : 'border-r']"
  >
    <!-- Top: Avatar -->
    <div class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all duration-300 cursor-pointer">
      <User :size="18" />
    </div>

    <!-- Bottom: Settings -->
    <div class="relative">
      <button 
        @click="toggleSettings"
        class="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all duration-300"
        :class="{ 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200': showSettings }"
      >
        <Settings :size="18" />
      </button>

      <!-- Settings Popover -->
      <div 
        v-if="showSettings"
        class="absolute bottom-10 p-3 bg-white dark:bg-dark-bg rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 min-w-[200px] z-50 animate-in fade-in zoom-in-95 duration-200"
        :class="[config.position === 'right' ? 'right-0 mr-12' : 'left-0 ml-12']"
      >
        <div class="space-y-4">
          <!-- Position Setting -->
          <div class="space-y-2">
            <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider">侧边栏位置</div>
            <div class="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button 
                @click="setPosition('left')"
                class="flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all duration-300"
                :class="config.position === 'left' ? 'bg-white dark:bg-dark-accent text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'"
              >
                <PanelLeft :size="14" class="mr-1.5" />
                左侧
              </button>
              <button 
                @click="setPosition('right')"
                class="flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all duration-300"
                :class="config.position === 'right' ? 'bg-white dark:bg-dark-accent text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'"
              >
                <PanelRight :size="14" class="mr-1.5" />
                右侧
              </button>
            </div>
          </div>

          <!-- Theme Setting -->
          <div class="space-y-2">
            <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider">主题模式</div>
            <div class="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button 
                @click="setTheme('light')"
                class="flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all duration-300"
                :class="config.theme === 'light' ? 'bg-white dark:bg-dark-accent text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'"
              >
                <Sun :size="14" class="mr-1.5" />
                明亮
              </button>
              <button 
                @click="setTheme('dark')"
                class="flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all duration-300"
                :class="config.theme === 'dark' ? 'bg-white dark:bg-dark-accent text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'"
              >
                <Moon :size="14" class="mr-1.5" />
                暗黑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure popover animation works */
@keyframes enter {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
