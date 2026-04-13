<template>
  <div class="bg-white rounded-2xl shadow-card border border-brand-pale/20 p-5 relative overflow-hidden transition-all duration-300 hover:shadow-card-hover group">
    <!-- Decorative corner accent -->
    <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-pale/20 to-transparent rounded-bl-[40px] pointer-events-none transition-opacity duration-300 group-hover:opacity-60"></div>
    <div class="relative z-10"><slot></slot></div>
  </div>
</template>
<script setup>
defineProps({ glass: { type: Boolean, default: false } })
</script>
