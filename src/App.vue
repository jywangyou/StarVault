<script setup lang="ts">
import { ref } from 'vue'
import TymeCalendar from './components/TymeCalendar.vue'
import Sidebar from './components/Sidebar.vue'
import ReminderModal from './components/ReminderModal.vue'

interface Task {
  id: string
  date: string
  time: string
  description: string
  createdAt: number
}

const sidebarPosition = ref<'left' | 'right'>('right')
const selectedDate = ref(new Date())
const showReminderModal = ref(false)

function handleSaveReminder(task: Task) {
  // Save to Chrome storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['reminders'], (result) => {
      const reminders = (result.reminders as Task[]) || []
      reminders.push(task)
    chrome.storage.local.set({ reminders }, () => {
      scheduleAlarm(task)
    })
    })
  } else {
    // Fallback for dev environment
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]')
    reminders.push(task)
    localStorage.setItem('reminders', JSON.stringify(reminders))
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'reminders',
      newValue: JSON.stringify(reminders)
    }))
    console.log('Reminder saved locally:', task)
  }
  
  showReminderModal.value = false
}

function setupAlarm(task: Task) {
  if (typeof chrome !== 'undefined' && chrome.alarms) {
    const [year, month, day] = task.date.split('-').map(Number)
    const [hour, minute] = task.time.split(':').map(Number)
    
    if (year && month && day && hour !== undefined && minute !== undefined) {
      const alarmTime = new Date(year, month - 1, day, hour, minute).getTime()
      const when = Math.max(alarmTime, Date.now() + 1000)
      console.log('Creating alarm for task:', task.id, 'at', new Date(when))
      chrome.alarms.create(`reminder-${task.id}`, {
        when
      })
    }
  }
}

function scheduleAlarm(task: Task) {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: 'schedule_reminder', task }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        setupAlarm(task)
      }
    })
  } else {
    setupAlarm(task)
  }
}
</script>

<template>
  <div 
    class="h-screen w-screen flex overflow-hidden bg-zinc-50 dark:bg-dark-bg transition-colors duration-300"
    :class="[sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row']"
  >
    <!-- Sidebar -->
    <Sidebar 
      @update:position="(pos) => sidebarPosition = pos"
      @open:reminder="showReminderModal = true"
    />

    <!-- Main Content -->
    <main class="flex-1 overflow-auto flex justify-center items-start  w-full relative">
      <TymeCalendar @update:selectedDate="(date) => selectedDate = date" />
    </main>

    <!-- Reminder Modal -->
    <ReminderModal
      :show="showReminderModal"
      :initial-date="selectedDate"
      @close="showReminderModal = false"
      @save="handleSaveReminder"
    />
  </div>
</template>

<style scoped>
</style>
