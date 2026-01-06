<script setup lang="ts">
import TymeCalendar from './components/TymeCalendar.vue'
</script>

<template>
  <div class="min-h-screen flex justify-center ">
    <TymeCalendar />
  </div>
  <!-- <div class="fixed inset-0 pointer-events-none flex items-center justify-center">
    <div class="text-[56px] sm:text-[88px] font-bold text-gray-200/50 select-none">{{ new Date().getFullYear() }}年{{ new Date().getMonth()+1 }}月</div>
  </div> -->
</template>

<style scoped>
</style>
