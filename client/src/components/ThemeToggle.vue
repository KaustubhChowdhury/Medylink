<template>
  <button @click="store.toggleDarkMode()" class="btn-outline !px-3 !py-3 rounded-xl border-2 border-primary-200 dark:border-primary-800 shadow-card hover:shadow-hover transition-all duration-300 group" aria-label="Toggle Dark Mode">
    <span v-if="store.darkMode" class="text-xl group-hover:scale-110 transition-transform">🌙</span>
    <span v-else class="text-xl group-hover:scale-110 transition-transform">☀️</span>
  </button>
</template>

<script setup>
import { store } from '../store'
</script>
