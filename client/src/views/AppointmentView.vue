<template>
  <div class="max-w-xl mx-auto space-y-8">
    <header class="text-center pt-4">
      <h1 class="text-4xl font-serif tracking-tight">Appointment</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm uppercase tracking-widest font-medium" v-if="selectedDate">{{ new Date(selectedDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) }}</p>
      <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm uppercase tracking-widest font-medium" v-else>Select a date</p>
    </header>

    <div v-if="doctor" class="flex flex-col items-center justify-center text-center">
      <div class="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-3xl font-bold mb-4">
        {{ doctor.name.split(' ').map(w => w[0]).join('').substring(0,2) }}
      </div>
      <h3 class="font-serif text-2xl mb-1">{{ doctor.name }}</h3>
      <p class="text-slate-500 mb-2">{{ doctor.specialty }}</p>
      <div class="flex items-center gap-2 text-sm">
        <span class="text-amber-500 font-medium">★ 4.9</span>
        <span class="text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">₹{{ doctor.price }}</span>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-soft">
      <h3 class="font-medium mb-4 text-slate-800 dark:text-slate-200 text-lg">Appointment slot</h3>
      <div class="flex gap-3 overflow-x-auto pb-6 snap-x hide-scrollbar">
        <button 
          v-for="d in dates" :key="d.date"
          @click="selectedDate = d.date"
          :class="[
            'snap-start shrink-0 rounded-full p-2 w-14 h-20 flex flex-col items-center justify-center transition-all duration-300',
            selectedDate === d.date 
              ? 'bg-[#98A2FF] text-white shadow-md scale-105' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
          ]"
        >
          <div class="text-xs uppercase tracking-wider mb-2 font-medium" :class="selectedDate === d.date ? 'text-blue-100' : ''">{{ d.day.charAt(0) }}</div>
          <div class="text-lg font-medium">{{ d.dayNum }}</div>
        </button>
      </div>

      <div class="flex flex-wrap gap-3 mt-2">
        <button
          v-for="time in timeSlots" :key="time"
          @click="selectedTime = time"
          :class="[
            'py-2.5 px-5 rounded-full text-sm font-medium transition-all duration-300',
            selectedTime === time
              ? 'bg-[#98A2FF] text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700'
          ]"
        >
          {{ time }}
        </button>
      </div>

      <div class="mt-10">
        <button @click="confirmBooking" class="btn-primary w-full py-4 text-lg" :disabled="!selectedDate || !selectedTime || loading">
          <span v-if="loading">Confirming...</span>
          <span v-else>Book now</span>
        </button>
        <div v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</div>
      </div>
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
