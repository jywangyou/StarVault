<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Trash2, ListChecks } from 'lucide-vue-next'

const props = defineProps<{
  selectedDate: Date
}>()

interface Task {
  id: string
  date: string
  time: string
  description: string
  createdAt: number
}

const tasks = ref<Task[]>([])

const currentDayTasks = computed(() => {
  const dateStr = dayjs(props.selectedDate).format('YYYY-MM-DD')
  return tasks.value
    .filter(t => t.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time))
})

function loadTasks() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['reminders'], (result) => {
      tasks.value = (result.reminders as Task[]) || []
    })
    
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.reminders) {
        tasks.value = (changes.reminders.newValue as Task[]) || []
      }
    })
  } else {
    // Local fallback
    tasks.value = JSON.parse(localStorage.getItem('reminders') || '[]')
    window.addEventListener('storage', (e) => {
      if (e.key === 'reminders') {
        tasks.value = JSON.parse(e.newValue || '[]')
      }
    })
  }
}

function deleteTask(id: string) {
  const newTasks = tasks.value.filter(t => t.id !== id)
  tasks.value = newTasks
  
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ reminders: newTasks })
    if (chrome.alarms) {
      chrome.alarms.clear(`reminder-${id}`)
    }
  } else {
    localStorage.setItem('reminders', JSON.stringify(newTasks))
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <transition name="fade">
    <div v-if="currentDayTasks.length > 0" class="w-full bg-white dark:bg-dark-bg rounded-2xl shadow p-[clamp(10px,2.2vw,16px)] transition-colors duration-300 h-fit">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
        <ListChecks :size="16" />
        今日代办 ({{ currentDayTasks.length }})
      </h3>
      <div class="space-y-2">
        <div 
          v-for="task in currentDayTasks" 
          :key="task.id"
          class="group flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 p-3 rounded-xl transition-all duration-300"
        >
          <!-- Time -->
          <div class="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span>{{ task.time.split(':')[0] }}</span>
            <span class="text-gray-300 dark:text-zinc-600">:</span>
            <span>{{ task.time.split(':')[1] }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">{{ task.description }}</div>
          </div>

          <!-- Actions -->
          <button 
            @click.stop="deleteTask(task.id)"
            class="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="删除"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
