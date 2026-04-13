<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-xl font-semibold text-sm transition-all duration-200 px-5 py-2.5 cursor-pointer',
      variant === 'doctor' ? 'bg-brand-dark text-white hover:bg-brand-mid shadow-btn' : '',
      variant === 'patient' ? 'bg-brand-green text-white hover:bg-brand-mid shadow-btn' : '',
      variant === 'admin' ? 'bg-brand-dark text-white hover:bg-brand-mid shadow-btn' : '',
      variant === 'secondary' ? 'bg-cream text-text-dark border border-brand-pale hover:bg-cream-dark' : '',
      variant === 'danger' ? 'bg-danger text-white hover:brightness-110 shadow-sm' : '',
      variant === 'success' ? 'bg-brand-green text-white hover:bg-brand-mid shadow-sm' : '',
      block ? 'w-full' : '',
      disabled ? 'opacity-50 pointer-events-none' : ''
    ]"
    v-bind="$attrs"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>
<script setup>
defineProps({
  variant: { type: String, default: 'patient' },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
</script>
