<template>
  <div class="card group cursor-pointer p-4 flex items-center justify-between min-w-[220px] shrink-0 hover:shadow-hover transition-all duration-300">
    <div class="flex items-center gap-3">
      <div :class="[
        'w-3 h-3 rounded-full animate-pulse transition-all duration-300',
        area.shortage ? 'bg-red-500 scale-125' : 'bg-emerald-500'
      ]"></div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-slate-900 dark:text-white truncate">{{ area.name }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ area.doctor_count }} doctor<span v-if="area.doctor_count !== 1">s</span></p>
      </div>
    </div>
    <span v-if="area.shortage" class="text-lg ml-2">⚠️</span>
  </div>
</template>

<script setup>
defineProps({
  area: {
    type: Object,
    required: true
  }
})
</script>
