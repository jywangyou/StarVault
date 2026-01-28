<script setup lang="ts">
import { ref } from 'vue'
import TymeCalendar from './components/TymeCalendar.vue'
import Sidebar from './components/Sidebar.vue'

const sidebarPosition = ref<'left' | 'right'>('right')
</script>

<template>
  <div 
    class="h-screen w-screen flex overflow-hidden bg-zinc-50 dark:bg-dark-bg transition-colors duration-300"
    :class="[sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row']"
  >
    <!-- Sidebar -->
    <Sidebar @update:position="(pos) => sidebarPosition = pos" />

    <!-- Main Content -->
    <main class="flex-1 overflow-auto flex justify-center w-full relative">
      <TymeCalendar />
    </main>
  </div>
</template>

<style scoped>
</style>
