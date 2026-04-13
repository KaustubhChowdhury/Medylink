<template>
  <div class="max-w-2xl mx-auto pb-10">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="heading-1">Schedule Your Appointment</h1>
      <p class="subtext mt-3">{{ selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'}) : 'Choose a date and time' }}</p>
    </div>

    <!-- Doctor Summary Card -->
    <div v-if="doctor" class="card-premium p-8 text-center mb-10">
      <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-accent-500 text-white flex items-center justify-center text-5xl font-bold mx-auto mb-6 shadow-lg">
        {{ doctor.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() }}
      </div>
      <h3 class="heading-3">{{ doctor.name }}</h3>
      <p class="text-primary-600 dark:text-primary-400 font-semibold mt-2">{{ doctor.specialty }}</p>
      <div class="flex items-center justify-center gap-4 mt-5 text-lg font-semibold">
        <span class="flex items-center gap-1">
          <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          4.9
        </span>
        <span class="flex items-center gap-1 badge-primary">
          ₹{{ doctor.price }}
        </span>
      </div>
    </div>

    <!-- Booking Form -->
    <div class="card-premium p-8 space-y-8">
      <!-- Date Selection -->
      <div>
        <h3 class="heading-4 mb-5">Select Date</h3>
        <div class="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
          <button 
            v-for="d in dates" :key="d.date"
            @click="selectedDate = d.date"
            :class="[
              'snap-start shrink-0 rounded-2xl p-4 w-20 h-24 flex flex-col items-center justify-center transition-all duration-300 font-semibold border-2 shadow-card hover:shadow-hover',
              selectedDate === d.date 
                ? 'bg-gradient-premium text-white border-primary-600 scale-105' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'
            ]"
          >
            <div class="text-xs uppercase tracking-wider mb-2 opacity-75">{{ d.day.charAt(0) }}</div>
            <div class="text-2xl leading-none">{{ d.dayNum }}</div>
            <div class="text-xs mt-1 opacity-75">{{ d.month }}</div>
          </button>
        </div>
      </div>

      <!-- Time Selection -->
      <div>
        <h3 class="heading-4 mb-5">Select Time</h3>
        <div class="grid grid-cols-3 md:grid-cols-4 gap-3">
          <button
            v-for="time in timeSlots" :key="time"
            @click="selectedTime = time"
            :class="[
              'py-3 px-4 rounded-lg font-semibold transition-all duration-300 border-2',
              selectedTime === time
                ? 'bg-gradient-premium text-white border-primary-600 scale-105 shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:scale-105'
            ]"
          >
            {{ time }}
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
        <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Confirmation -->
      <div v-if="selectedDate && selectedTime" class="p-6 bg-gradient-light dark:bg-slate-800/50 rounded-2xl border border-primary-200/50 dark:border-primary-900/50">
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">Booking Summary</p>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-900 dark:text-white font-semibold">{{ selectedDate }}</p>
            <p class="text-primary-600 dark:text-primary-400 font-bold text-lg mt-1">{{ selectedTime }}</p>
          </div>
          <svg class="w-12 h-12 text-emerald-500 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
        </div>
      </div>

      <!-- Submit Button -->
      <button @click="confirmBooking" class="btn-primary w-full py-4 text-lg font-bold shadow-premium hover:shadow-hover" :disabled="!selectedDate || !selectedTime || loading">
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Confirming...
        </span>
        <span v-else>Book Now</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const router = useRouter()

const doctor = ref(null)
const dates = ref([])
const timeSlots = ref(['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'])
const selectedDate = ref('')
const selectedTime = ref('')
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  const docId = route.query.doctor
  if (!docId) {
    router.push('/discover')
    return
  }
  try {
    doctor.value = await api.doctors.get(docId)
  } catch(e) {
    console.error(e)
  }

  const tempDates = []
  for (let i=0; i<7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    tempDates.push({
      date: d.toISOString().split('T')[0],
      day: d.toLocaleString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleString('en-US', { month: 'short' })
    })
  }
  dates.value = tempDates
})

const confirmBooking = async () => {
  if (!selectedDate.value || !selectedTime.value || !doctor.value) return
  loading.value = true
  error.value = ''
  try {
    await api.appointments.book(doctor.value.id, selectedDate.value, selectedTime.value)
    router.push('/appointments')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
