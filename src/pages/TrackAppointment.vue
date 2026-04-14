<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-6 left-1/4 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Track Appointment</h1>
      <p class="text-text-mid text-sm relative">Live queue status</p>
    </div>

    <!-- No appointments state -->
    <div v-if="!appointment" class="text-center py-16 anim-fade-up">
      <div class="w-20 h-20 rounded-3xl bg-cream flex items-center justify-center mx-auto mb-4">
        <ClockIcon class="w-10 h-10 text-text-light" />
      </div>
      <h2 class="text-xl font-serif font-bold text-brand-dark mb-2">No Active Appointment</h2>
      <p class="text-text-mid text-sm mb-6">Book an appointment to start tracking</p>
      <router-link to="/patient/book">
        <Button variant="patient">Book Appointment →</Button>
      </router-link>
    </div>

    <!-- Active appointment tracking -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card class="!p-6 anim-fade-up">
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">Appointment Details</p>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-text-mid">Appointment ID</span>
              <span class="text-sm font-bold text-brand-dark bg-cream px-3 py-1 rounded-lg">APT-{{ 1000 + appointment.id }}</span>
            </div>
            <div class="flex justify-between"><span class="text-sm text-text-mid">Doctor</span><span class="text-sm font-semibold text-brand-dark">Dr. {{ appointment.doctor_name || 'Doctor' }}</span></div>
            <div class="flex justify-between"><span class="text-sm text-text-mid">Specialization</span><span class="text-sm font-semibold text-brand-dark">{{ appointment.doctor_specialty || 'General' }}</span></div>
            <div class="flex justify-between"><span class="text-sm text-text-mid">Date</span><span class="text-sm font-semibold text-brand-dark">{{ formatDate(appointment.date) }}</span></div>
            <div class="flex justify-between"><span class="text-sm text-text-mid">Time</span><span class="text-sm font-semibold text-brand-dark">{{ appointment.time }}</span></div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-text-mid">Status</span>
              <span class="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg bg-brand-pale/40 text-brand-dark">{{ appointment.status }}</span>
            </div>
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
              <p class="text-3xl font-bold text-brand-dark">#{{ myToken }}</p>
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
          <div v-for="n in totalTokens" :key="n"
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all"
            :class="n < currentNumber ? 'bg-brand-pale/20 text-text-light' :
                    n === currentNumber ? 'bg-gradient-to-br from-brand-green to-brand-mid text-white shadow-icon icon-pulse' :
                    n === myToken ? 'bg-brand-dark text-white shadow-icon' :
                    'bg-cream border border-brand-pale/30 text-text-mid'">
            {{ n }}
          </div>
        </div>
      </Card>

      <!-- Cancel button -->
      <div class="mt-6 anim-fade-up anim-delay-3">
        <button @click="cancelAppointment" class="text-xs text-danger font-semibold hover:underline">Cancel this appointment</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

const appointment = ref(null)
const myToken = ref(1)
const currentNumber = ref(1)
const totalTokens = ref(10)
let interval = null

const waitTime = computed(() => {
  const d = myToken.value - currentNumber.value
  return d > 0 ? d * 10 : 0
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

const cancelAppointment = async () => {
  if (!appointment.value) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/appointments/${appointment.value.id}/cancel`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      appointment.value = null
    }
  } catch (e) {
    console.error('Cancel failed:', e)
  }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      const upcoming = (Array.isArray(data) ? data : []).filter(a => a.status === 'upcoming')
      if (upcoming.length > 0) {
        appointment.value = upcoming[0]
        // Simulate token position based on appointment id
        myToken.value = (appointment.value.id % 8) + 2
        currentNumber.value = 1
        totalTokens.value = Math.max(myToken.value + 3, 10)

        // Simulate queue progression
        interval = setInterval(() => {
          if (currentNumber.value < myToken.value) {
            currentNumber.value++
          } else {
            clearInterval(interval)
          }
        }, 8000)
      }
    }
  } catch (e) {
    console.error('Failed to load tracking:', e)
  }
})

onUnmounted(() => clearInterval(interval))
</script>
