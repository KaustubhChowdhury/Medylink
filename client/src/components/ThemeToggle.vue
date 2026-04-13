<template>
  <button @click="store.toggleDarkMode()" class="btn-ghost !px-2.5 rounded-full" aria-label="Toggle Dark Mode">
    <span v-if="store.darkMode">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script setup>
import { store } from '../store'
</script>
