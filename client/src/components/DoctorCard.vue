<template>
  <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 flex items-center justify-between shadow-soft hover:shadow-lg transition-all duration-300">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-[1.5rem] bg-[#E6E9FF] dark:bg-blue-900 text-[#98A2FF] flex items-center justify-center text-xl font-bold shrink-0">
        {{ initials }}
      </div>
      <div>
        <h3 class="font-serif text-xl font-semibold">{{ doctor.name }}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{{ doctor.specialty }}</p>
      </div>
    </div>
    
    <div class="flex flex-col items-end gap-2 shrink-0">
      <div class="flex items-center gap-1 text-sm">
        <span class="text-amber-400 font-bold">★ {{ (Math.random() * (5 - 4.5) + 4.5).toFixed(1) }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="store.addToCompare(doctor)" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors" title="Compare">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
        <router-link :to="`/book?doctor=${doctor.id}`" class="rounded-full bg-[#1C1C1E] dark:bg-white text-white dark:text-gray-900 px-4 py-1.5 text-sm font-medium hover:bg-black dark:hover:bg-gray-100 transition-colors" v-if="doctor.available">Book</router-link>
      </div>
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
  return props.doctor.name.split(' ').map(w => w[0]).join('').substring(0, 2)
})
</script>
