<template>
  <div class="space-y-10">
    <header>
      <h1 class="text-4xl font-serif tracking-tight">Hi {{ store.currentUser?.name || 'there' }}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Let's find a doctor for you.</p>
    </header>

    <!-- Banner mimicking the "Go Premium" card in the design -->
    <div class="rounded-3xl bg-[#98A2FF] text-white p-8 flex items-center justify-between shadow-soft overflow-hidden relative">
      <div class="relative z-10">
        <h2 class="text-2xl font-serif mb-2">Go Premium<br>for Better Care</h2>
        <button class="bg-[#1C1C1E] text-white rounded-full px-5 py-2.5 text-sm font-medium mt-4">Update now</button>
      </div>
      <!-- Decorative icon/mascot placeholder -->
      <div class="opacity-80 absolute -right-4 -bottom-4 md:static md:right-auto md:bottom-auto">
        <div class="w-32 h-32 bg-[#FCE0A2] rounded-[40px] flex items-center justify-center transform rotate-12">
          <span class="text-5xl">🦷</span>
        </div>
      </div>
    </div>

    <!-- Stat cards mimicking "Categories" -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Overview</h3>
        <span class="text-sm font-medium text-slate-400">View all</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="med-card flex flex-col items-center justify-center text-center p-6 bg-[#F4F5FF] shadow-none !border-0 dark:bg-slate-800">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 text-xl font-bold mb-3 shadow-sm">&bull;</div>
          <h3 class="font-medium text-slate-800 dark:text-slate-200">Appointments</h3>
          <p class="text-xl font-bold mt-1">{{ countUpcoming }}</p>
        </div>
        <div class="med-card flex flex-col items-center justify-center text-center p-6 bg-[#F4F5FF] shadow-none !border-0 dark:bg-slate-800">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 text-xl font-bold mb-3 shadow-sm">&plus;</div>
          <h3 class="font-medium text-slate-800 dark:text-slate-200">Total Doctors</h3>
          <p class="text-xl font-bold mt-1">{{ store.doctors.length }}</p>
        </div>
        <div class="med-card flex flex-col items-center justify-center text-center p-6 bg-[#F4F5FF] shadow-none !border-0 dark:bg-slate-800">
           <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 text-xl font-bold mb-3 shadow-sm">!</div>
          <h3 class="font-medium text-slate-800 dark:text-slate-200">Shortage Areas</h3>
          <p class="text-xl font-bold mt-1 text-red-600 dark:text-red-400">{{ countShortage }}</p>
        </div>
        <div class="med-card flex flex-col items-center justify-center text-center p-6 bg-[#F4F5FF] shadow-none !border-0 dark:bg-slate-800">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 text-xl font-bold mb-3 shadow-sm">&equiv;</div>
          <h3 class="font-medium text-slate-800 dark:text-slate-200">Records</h3>
          <p class="text-xl font-bold mt-1">{{ store.history.length }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSearch" class="relative">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Search doctors by name or specialty..." 
        class="input w-full text-lg py-4 pl-12 shadow-sm rounded-2xl"
      />
      <svg class="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </form>

    <div v-if="nextAppt" class="med-card border-l-4 border-l-blue-600 dark:border-l-blue-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">Next Appointment</h3>
          <p class="font-bold text-lg mt-1">{{ nextAppt.doctor_name }} <span class="text-slate-400 font-normal text-base ml-2">{{ nextAppt.doctor_specialty }}</span></p>
          <div class="flex items-center gap-3 mt-2 text-sm">
            <span class="flex items-center gap-1 text-slate-600 dark:text-slate-300"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ nextAppt.date }}</span>
            <span class="flex items-center gap-1 text-slate-600 dark:text-slate-300"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ nextAppt.time }}</span>
            <span class="badge bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 capitalize">{{ nextAppt.status }}</span>
          </div>
        </div>
        <router-link to="/appointments" class="btn-ghost shrink-0">View All</router-link>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">Area Availability</h3>
      <div class="flex overflow-x-auto pb-4 gap-3 snap-x">
        <AreaBadge v-for="area in store.areas" :key="area.id" :area="area" class="snap-start" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import AreaBadge from '../components/AreaBadge.vue'

const router = useRouter()
const searchQuery = ref('')

const greeting = computed(() => {
  const hr = new Date().getHours()
  if (hr < 12) return 'Good morning,'
  if (hr < 18) return 'Good afternoon,'
  return 'Good evening,'
})

const countUpcoming = computed(() => store.appointments.filter(a => a.status === 'upcoming').length)
const countShortage = computed(() => store.areas.filter(a => a.shortage === 1).length)
const nextAppt = computed(() => store.appointments.find(a => a.status === 'upcoming'))

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/discover', query: { q: searchQuery.value } })
  }
}

onMounted(async () => {
  store.fetchDoctors()
  store.fetchAreas()
  store.fetchAppointments()
  store.fetchHistory()
})
</script>
