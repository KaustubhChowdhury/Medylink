<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-brand-pale/30">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
      <h2 class="text-sm font-semibold text-text-dark">
        {{ portal === 'doctor' ? 'Doctor Portal' : portal === 'admin' ? 'Admin Portal' : 'Patient Portal' }}
      </h2>
    </div>
    <div class="flex items-center gap-4">
      <div class="relative">
        <BellIcon class="w-5 h-5 text-text-mid hover:text-brand-dark cursor-pointer transition-colors" />
        <span class="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
      </div>
      <div class="w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-icon">
        {{ portal === 'doctor' ? 'Dr' : portal === 'admin' ? 'AD' : 'PT' }}
      </div>
    </div>
  </header>
</template>
<script setup>
import { BellIcon } from '@heroicons/vue/24/outline'
defineProps({ portal: { type: String, default: null } })
</script>
