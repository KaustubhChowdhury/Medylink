<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-4 -right-8 w-32 h-32 bg-brand-light/15 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Book Appointment</h1>
      <p class="text-text-mid text-sm relative">Find a doctor and pick a time</p>
    </div>

    <!-- Step 1: Doctor List -->
    <div v-if="step === 1">
      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-4">Nearby Doctors</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card v-for="(doc, i) in doctors" :key="doc.id"
          class="!p-5 cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all anim-fade-up"
          :class="[!doc.available ? 'opacity-40 pointer-events-none' : '', `anim-delay-${i+1}`]"
          @click="selectDoctor(doc)">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center shadow-icon text-white font-bold font-serif text-lg icon-float" :style="`animation-delay: ${i * 0.3}s`">
              {{ doc.name.split(' ')[1][0] }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-brand-dark">{{ doc.name }}</h3>
              <p class="text-xs text-text-mid">{{ doc.specialization }}</p>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg"
              :class="doc.available ? 'bg-brand-pale/40 text-brand-dark' : 'bg-cream-dark text-text-light'">
              {{ doc.available ? '● Available' : 'Busy' }}
            </span>
          </div>
        </Card>
      </div>
    </div>

    <!-- Step 2: Date + Slider -->
    <div v-if="step === 2" class="anim-fade-up">
      <button @click="step = 1" class="text-sm text-brand-green font-semibold mb-5 flex items-center gap-1 hover:underline">← Back</button>

      <Card class="!p-5 mb-6 !border-brand-green/20">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center shadow-icon text-white font-bold font-serif text-lg icon-pulse">
            {{ selectedDoctor.name.split(' ')[1][0] }}
          </div>
          <div>
            <p class="font-bold text-brand-dark text-lg">{{ selectedDoctor.name }}</p>
            <p class="text-xs text-text-mid">{{ selectedDoctor.specialization }}</p>
          </div>
        </div>
      </Card>

      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Select Date</p>
      <div class="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <div v-for="(d, i) in dates" :key="d.value" @click="selectedDate = d.value"
          class="shrink-0 w-[76px] py-4 rounded-2xl text-center cursor-pointer border-2 transition-all anim-fade-up"
          :style="`animation-delay: ${i * 0.04}s`"
          :class="selectedDate === d.value
            ? 'bg-brand-dark text-white border-brand-dark shadow-btn scale-105'
            : 'bg-white border-brand-pale/30 hover:border-brand-green text-text-dark'">
          <p class="text-[10px] font-bold uppercase tracking-wider" :class="selectedDate === d.value ? 'text-brand-pale' : 'text-text-light'">{{ d.day }}</p>
          <p class="text-xl font-bold mt-1">{{ d.num }}</p>
        </div>
      </div>

      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Pick a Time Slot</p>
      <Card class="!p-6 mb-2">
        <div class="flex items-center justify-between mb-5">
          <span class="text-xs text-text-light font-semibold">09:00</span>
          <div class="flex flex-col items-center">
            <span class="text-3xl font-serif font-bold text-brand-dark">{{ currentSlotLabel }}</span>
            <span class="text-[10px] text-text-light mt-1">Selected slot</span>
          </div>
          <span class="text-xs text-text-light font-semibold">17:00</span>
        </div>
        <input type="range" :min="0" :max="slots.length - 1" v-model.number="slotIndex"
          class="w-full h-2.5 rounded-full appearance-none cursor-pointer"
          style="background: linear-gradient(to right, #1B4332, #2D6A4F, #40916C, #74C69D, #B7E4C7);" />
        <div class="flex justify-between mt-3 text-[10px] text-text-light font-bold uppercase tracking-wider">
          <span>Morning</span><span>Noon</span><span>Afternoon</span><span>Evening</span>
        </div>
      </Card>
      <p class="text-xs text-text-light mb-8 ml-1">Each slot is 10 minutes · Slide to choose</p>

      <Button variant="patient" @click="confirmBooking" class="!px-10 !py-3 !text-sm">Confirm Booking</Button>
    </div>

    <!-- Step 3 -->
    <div v-if="step === 3" class="text-center py-16 anim-fade-up">
      <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center mx-auto mb-6 shadow-icon icon-pulse">
        <CheckCircleIcon class="w-12 h-12 text-white" />
      </div>
      <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">Appointment Booked!</h2>
      <p class="text-text-mid text-sm mb-1">{{ selectedDoctor.name }} · {{ currentSlotLabel }}</p>
      <p class="text-text-mid text-sm mb-8">Token: <span class="font-bold text-brand-green text-2xl">#{{ Math.floor(Math.random() * 15) + 1 }}</span></p>
      <router-link to="/patient/tracking">
        <Button variant="patient" class="!px-8">Track Appointment →</Button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const step = ref(1)
const selectedDoctor = ref(null)
const selectedDate = ref(null)
const slotIndex = ref(6)

const doctors = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/doctors?available=1')
    if (res.ok) {
      const { data } = await res.json()
      doctors.value = data.map(d => ({
        id: d.id,
        name: 'Dr. ' + d.name,
        specialization: d.specialty || 'General',
        available: true
      }))
    }
  } catch (err) {
    console.error('Failed to load doctors:', err)
  }
})

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i)
  return { value: d.toISOString().split('T')[0], day: d.toLocaleDateString('en', { weekday: 'short' }), num: d.getDate() }
})

const slots = (() => {
  const s = []
  for (let m = 540; m < 1020; m += 10) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const min = (m % 60).toString().padStart(2, '0')
    s.push(`${h}:${min}`)
  }
  return s
})()
const currentSlotLabel = computed(() => slots[slotIndex.value] || '09:00')
const selectDoctor = (doc) => { selectedDoctor.value = doc; selectedDate.value = dates[0].value; step.value = 2 }
const confirmBooking = () => { step.value = 3 }
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px; height: 28px; border-radius: 50%;
  background: #1B4332; border: 4px solid #B7E4C7;
  box-shadow: 0 4px 16px rgba(27,67,50,0.35); cursor: pointer;
}
</style>
