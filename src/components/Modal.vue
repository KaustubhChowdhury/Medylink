<template>
  <teleport to="body">
    <transition name="modal">
      <div v-show="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-primary-dark/80 backdrop-blur-sm" @click="$emit('close')"></div>
        <!-- Content -->
        <div class="relative bg-white rounded-[32px] p-8 max-w-lg w-full mx-4 shadow-2xl z-10 transform transition-all border border-white/20">
          <button @click="$emit('close')" class="absolute top-6 right-6 text-gray-400 hover:text-primary-dark transition-colors bg-off-white p-1 rounded-full">
            <XMarkIcon class="w-5 h-5" />
          </button>
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
defineProps({
  isOpen: { type: Boolean, default: false }
})
defineEmits(['close'])
</script>
<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative, .modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from .relative, .modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
