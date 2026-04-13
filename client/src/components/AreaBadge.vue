<template>
  <div class="med-card !p-3 !py-2 flex items-center justify-between min-w-[200px] shrink-0">
    <div class="flex items-center gap-3">
      <div :class="[
        'w-3 h-3 rounded-full', 
        area.shortage ? 'bg-red-500 animate-pulse' : 'bg-green-500'
      ]"></div>
      <span class="font-medium text-sm">{{ area.name }}</span>
    </div>
    <span class="text-xs text-slate-500">{{ area.doctor_count }} doc<span v-if="area.doctor_count !== 1">s</span></span>
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
