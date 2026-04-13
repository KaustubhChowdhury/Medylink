<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-6 left-1/4 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Track Appointment</h1>
      <p class="text-text-mid text-sm relative">Live queue status</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card class="!p-6 anim-fade-up">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">Appointment Details</p>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-mid">Appointment ID</span>
            <span class="text-sm font-bold text-brand-dark bg-cream px-3 py-1 rounded-lg">APT-20251006-07</span>
          </div>
          <div class="flex justify-between"><span class="text-sm text-text-mid">Doctor</span><span class="text-sm font-semibold text-brand-dark">Dr. Helena Vance</span></div>
          <div class="flex justify-between"><span class="text-sm text-text-mid">Specialization</span><span class="text-sm font-semibold text-brand-dark">Cardiology</span></div>
          <div class="flex justify-between"><span class="text-sm text-text-mid">Date</span><span class="text-sm font-semibold text-brand-dark">Oct 6, 2025</span></div>
        </div>
      </Card>

      <Card class="!p-6 anim-fade-up anim-delay-1">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">Live Queue</p>
        <div class="text-center space-y-6">
          <div>
            <p class="text-text-mid text-xs mb-2">Now Serving</p>
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center mx-auto shadow-icon icon-pulse">
              <p class="text-4xl font-bold text-white">{{ currentNumber }}</p>
            </div>
          </div>
          <div class="h-px bg-brand-pale/30"></div>
          <div>
            <p class="text-text-mid text-xs mb-1">Your Token</p>
            <p class="text-3xl font-bold text-brand-dark">#7</p>
          </div>
          <div class="h-px bg-brand-pale/30"></div>
          <div>
            <p class="text-text-mid text-xs mb-1">Estimated Wait</p>
            <p class="text-xl font-bold text-brand-dark">~{{ waitTime }} mins</p>
          </div>
        </div>
      </Card>
    </div>

    <Card class="!p-6 mt-6 anim-fade-up anim-delay-2">
      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-4">Queue Progress</p>
      <div class="flex gap-3 flex-wrap">
        <div v-for="n in 10" :key="n"
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all"
          :class="n < currentNumber ? 'bg-brand-pale/20 text-text-light' :
                  n === currentNumber ? 'bg-gradient-to-br from-brand-green to-brand-mid text-white shadow-icon icon-pulse' :
                  n === 7 ? 'bg-brand-dark text-white shadow-icon' :
                  'bg-cream border border-brand-pale/30 text-text-mid'">
          {{ n }}
        </div>
      </div>
    </Card>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Card from '../components/Card.vue'
const currentNumber = ref(4)
let interval = null
const waitTime = computed(() => { const d = 7 - currentNumber.value; return d > 0 ? d * 10 : 0 })
onMounted(() => { interval = setInterval(() => { if (currentNumber.value < 7) currentNumber.value++; else clearInterval(interval) }, 8000) })
onUnmounted(() => clearInterval(interval))
</script>
