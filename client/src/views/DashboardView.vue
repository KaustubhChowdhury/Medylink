<template>
  <div class="space-y-10 pb-10">
    <!-- Hero Section -->
    <div class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h1 class="heading-1">Hi, {{ store.currentUser?.name?.split(' ')[0] || 'there' }}! 👋</h1>
          <p class="subtext mt-2 text-lg">{{ greeting }} Let's get you better care today.</p>
        </div>
        <div class="text-5xl" v-if="getGreetingEmoji()">{{ getGreetingEmoji() }}</div>
      </div>
    </div>

    <!-- Premium Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-premium text-white p-8 md:p-12 shadow-premium hover:shadow-hover transition-all duration-300">
      <div class="absolute inset-0 opacity-10">
        <svg class="absolute right-0 top-0 w-96 h-96" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" opacity="0.1"/></svg>
      </div>
      <div class="relative z-10 flex items-center justify-between gap-8">
        <div class="flex-1">
          <h2 class="text-3xl md:text-4xl font-serif font-bold mb-3 leading-tight">Premium Healthcare Access</h2>
          <p class="text-blue-100 text-lg mb-6 max-w-md">Get priority appointments, exclusive doctor rates, and personalized recommendations.</p>
          <button class="btn bg-white text-primary-600 hover:bg-blue-50 font-bold px-8 py-3.5 shadow-lg">Upgrade Now</button>
        </div>
        <div class="hidden md:flex items-center justify-center w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm">
          <svg class="w-20 h-20 text-accent-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div>
      <h3 class="heading-3 mb-6">Your Overview</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-box">
          <svg class="w-8 h-8 mx-auto mb-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <div class="stat-number">{{ countUpcoming }}</div>
          <div class="stat-label">Appointments</div>
        </div>

        <div class="stat-box">
          <svg class="w-8 h-8 mx-auto mb-3 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.697M21 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <div class="stat-number">{{ store.doctors.length }}</div>
          <div class="stat-label">Doctors</div>
        </div>

        <div class="stat-box">
          <svg class="w-8 h-8 mx-auto mb-3 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div class="stat-number">{{ countShortage }}</div>
          <div class="stat-label">Areas in Need</div>
        </div>

        <div class="stat-box">
          <svg class="w-8 h-8 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div class="stat-number">{{ store.history.length }}</div>
          <div class="stat-label">Records</div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <form @submit.prevent="handleSearch" class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-300/20 to-accent-300/20 rounded-2xl blur-2xl -z-10"></div>
      <div class="relative flex items-center">
        <svg class="w-6 h-6 absolute left-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search doctors by name or specialty..." 
          class="input w-full text-lg py-5 pl-14 pr-6 shadow-premium"
        />
      </div>
    </form>

    <!-- Next Appointment -->
    <div v-if="nextAppt" class="appointment-card">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Next Appointment</h3>
          <p class="heading-3 mt-2">{{ nextAppt.doctor_name }}</p>
          <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">{{ nextAppt.doctor_specialty }}</p>
          <div class="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <span class="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ nextAppt.date }}
            </span>
            <span class="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ nextAppt.time }}
            </span>
            <span class="badge-primary capitalize">{{ nextAppt.status }}</span>
          </div>
        </div>
        <router-link to="/appointments" class="btn-outline shrink-0 px-6 py-3">View All</router-link>
      </div>
    </div>

    <!-- Area Availability -->
    <div class="space-y-4">
      <h3 class="heading-3">Healthcare Availability</h3>
      <div class="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
        <AreaBadge v-for="area in store.areas" :key="area.id" :area="area" class="snap-start shrink-0" />
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
  if (hr < 12) return 'Good morning'
  if (hr < 18) return 'Good afternoon'
  return 'Good evening'
})

const getGreetingEmoji = () => {
  const hr = new Date().getHours()
  if (hr < 12) return '🌅'
  if (hr < 18) return '☀️'
  return '🌙'
}

const countUpcoming = computed(() => store.appointments.filter(a => a.status === 'upcoming').length)
const countShortage = computed(() => store.areas.filter(a => a.shortage === 1).length)
const nextAppt = computed(() => store.appointments.find(a => a.status === 'upcoming'))

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/discover', query: { q: searchQuery.value } })
  }
}

onMounted(async () => {
  await Promise.all([
    store.fetchDoctors(),
    store.fetchAreas(),
    store.fetchAppointments(),
    store.fetchHistory()
  ])
})
</script>
