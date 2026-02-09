<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { X, Calendar as CalendarIcon, Save, Clock } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  initialDate: Date
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', task: Task): void
}>()

interface Task {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  description: string
  createdAt: number
}

// Form state
const selectedHour = ref(dayjs().format('HH'))
const selectedMinute = ref(dayjs().format('mm'))
const description = ref('')

const showTimePicker = ref(false)
const formattedDate = computed(() => dayjs(props.initialDate).format('YYYY年MM月DD日'))
const dateStr = computed(() => dayjs(props.initialDate).format('YYYY-MM-DD'))
const time = computed(() => `${selectedHour.value}:${selectedMinute.value}`)

function toggleTimePicker() {
  showTimePicker.value = !showTimePicker.value
}

  const hourList = ref<HTMLElement | null>(null)
  const minuteList = ref<HTMLElement | null>(null)
  function scrollIntoView() {
    requestAnimationFrame(() => {
      const hEl = hourList.value?.querySelector(`[data-hour="${selectedHour.value}"]`) as HTMLElement | null
      const mEl = minuteList.value?.querySelector(`[data-minute="${selectedMinute.value}"]`) as HTMLElement | null
      hEl?.scrollIntoView({ block: 'center' })
      mEl?.scrollIntoView({ block: 'center' })
    })
  }
  
  watch(showTimePicker, (open) => {
    if (open) scrollIntoView()
  })
  watch([selectedHour, selectedMinute], () => {
    if (showTimePicker.value) scrollIntoView()
  })
 
function selectHour(h: string) {
  selectedHour.value = h
}

function selectMinute(m: string) {
  selectedMinute.value = m
  showTimePicker.value = false
}

function handleSubmit() {
  if (!description.value.trim()) return

  const task: Task = {
    id: crypto.randomUUID(),
    date: dateStr.value,
    time: time.value,
    description: description.value,
    createdAt: Date.now()
  }

  emit('save', task)
  
  // Reset
  description.value = ''
  selectedHour.value = dayjs().format('HH')
  selectedMinute.value = dayjs().format('mm')
}
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative w-full max-w-md bg-white dark:bg-dark-bg rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 transform transition-all animate-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <span class="w-1 h-5 rounded-full bg-amber-400"></span>
            添加提醒
          </h2>
          <button 
            @click="$emit('close')"
            class="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Form -->
        <div class="space-y-5">
          <!-- Date & Time -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-400 uppercase tracking-wider">日期</label>
              <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 text-sm">
                <CalendarIcon :size="16" class="text-zinc-400" />
                {{ formattedDate }}
              </div>
            </div>

            <div class="space-y-1.5 relative">
              <label class="text-xs font-medium text-zinc-400 uppercase tracking-wider">时间</label>
              <button 
                type="button"
                @click="toggleTimePicker"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <Clock :size="16" class="text-zinc-400" />
                  {{ selectedHour }}:{{ selectedMinute }}
                </div>
                <i class="ri-arrow-down-s-line text-zinc-400" :class="{ 'rotate-180': showTimePicker }"></i>
              </button>

              <!-- Time Picker Popover -->
              <transition name="fade">
                <div v-if="showTimePicker" class="absolute top-full left-0 right-0 mt-2 z-20 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700 p-2">
                  <div class="flex gap-2 h-[200px]">
                    <!-- Hour Column -->
                    <div class="flex-1 flex flex-col rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                      <div class="text-[10px] text-center text-zinc-400 py-1 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">时</div>
                      <div class="flex-1 overflow-y-auto custom-scrollbar" ref="hourList">
                        <div 
                          v-for="h in Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))" 
                          :key="h"
                          @click.stop="selectHour(h)"
                          class="px-2 py-1.5 text-center text-sm cursor-pointer transition-colors"
                          :class="selectedHour === h ? 'bg-amber-400 text-white font-medium' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'"
                          :data-hour="h"
                        >
                          {{ h }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Separator -->
                    <div class="flex items-center text-zinc-300 font-bold">:</div>

                    <!-- Minute Column -->
                    <div class="flex-1 flex flex-col rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                      <div class="text-[10px] text-center text-zinc-400 py-1 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">分</div>
                      <div class="flex-1 overflow-y-auto custom-scrollbar" ref="minuteList">
                        <div 
                          v-for="m in Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))" 
                          :key="m"
                          @click.stop="selectMinute(m)"
                          class="px-2 py-1.5 text-center text-sm cursor-pointer transition-colors"
                          :class="selectedMinute === m ? 'bg-amber-400 text-white font-medium' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'"
                          :data-minute="m"
                        >
                          {{ m }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-zinc-400 uppercase tracking-wider">提醒内容</label>
            <textarea 
              v-model="description"
              rows="4"
              placeholder="写下需要提醒的事情..."
              class="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="pt-2">
            <button 
              @click="handleSubmit"
              :disabled="!description.trim()"
              class="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-medium shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save :size="18" />
              保存提醒
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
