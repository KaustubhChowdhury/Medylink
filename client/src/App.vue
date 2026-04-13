<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 bg-brand-bg dark:bg-slate-900 transition-colors duration-200">
    <NavBar v-if="!isAuthPage" />
    <main class="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
const isAuthPage = computed(() => ['/login', '/signup'].includes(route.path))
</script>
