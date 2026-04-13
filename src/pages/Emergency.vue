<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-2">Emergency SOS</h1>
    <p class="text-text-mid text-sm mb-12 text-center max-w-md">Press the button below to send an emergency alert to nearby doctors.</p>

    <button @click="sendSOS"
      class="w-44 h-44 rounded-full flex items-center justify-center transition-all duration-300"
      :class="sent ? 'bg-brand-green scale-95 shadow-icon' : 'bg-danger hover:scale-105 active:scale-95 shadow-[0_8px_40px_-4px_rgba(230,57,70,0.4)]'">
      <ExclamationTriangleIcon v-if="!sent" class="w-16 h-16 text-white" />
      <CheckIcon v-else class="w-16 h-16 text-white" />
    </button>

    <p class="mt-8 text-sm font-bold" :class="sent ? 'text-brand-green' : 'text-text-mid'">
      {{ sent ? '✓ Alert sent to nearby doctors' : 'Tap to send SOS' }}
    </p>

    <button v-if="sent" @click="resetSOS" class="mt-4 text-xs text-text-mid underline hover:text-brand-dark">Reset</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/vue/24/solid'
const sent = ref(false)

const sendSOS = () => { 
  sent.value = true
  localStorage.setItem('sos_alert', JSON.stringify({
    id: Date.now(),
    patient: 'Current Patient',
    time: 'Just now',
    location: 'Current Location'
  }))
}

const resetSOS = () => {
  sent.value = false
  localStorage.removeItem('sos_alert')
}
</script>
