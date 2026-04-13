<template>
  <div class="doctor-card">
    <!-- Top Section -->
    <div class="flex items-start justify-between mb-6">
      <!-- Avatar & Info -->
      <div class="flex items-center gap-4 flex-1">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-glow transition-shadow">
          {{ initials }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-serif font-bold text-lg text-slate-900 dark:text-white leading-tight">{{ doctor.name }}</h3>
          <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">{{ doctor.specialty }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">📍 {{ doctor.area_name || 'Area' }}</p>
        </div>
      </div>

      <!-- Rating Badge -->
      <div class="flex flex-col items-end gap-2 shrink-0">
        <span class="inline-flex items-center gap-1.5 badge-primary">
          <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <span class="font-bold text-sm">4.8</span>
        </span>
      </div>
    </div>

    <!-- Price & Availability -->
    <div class="flex items-center justify-between mb-6 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold font-mono bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">₹{{ doctor.price }}</span>
        <span class="text-xs text-slate-500 dark:text-slate-400">per consultation</span>
      </div>
      <span v-if="doctor.available" class="inline-flex items-center gap-1.5 badge-success">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Available
      </span>
      <span v-else class="inline-flex items-center gap-1.5 badge badge-danger">
        <span class="w-2 h-2 rounded-full bg-red-500"></span>
        Unavailable
      </span>
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
      <button @click="store.addToCompare(doctor)" :class="[
        'flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 border-2 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center justify-center gap-2'
      ]" title="Compare">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m0 0h4m0 0v18m0-18v18m0-18h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path></svg>
        <span class="hidden sm:inline">Compare</span>
      </button>
      <router-link :to="`/book?doctor=${doctor.id}`" class="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2" v-if="doctor.available">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="hidden sm:inline">Book</span>
      </router-link>
      <button v-else disabled class="flex-1 py-2.5 rounded-xl font-semibold cursor-not-allowed opacity-50 bg-slate-100 dark:bg-slate-800 text-slate-400">
        Unavailable
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../store'

const props = defineProps({
  doctor: Object
})

const initials = computed(() => {
  return props.doctor.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})
</script>
