<template>
  <div>
    <!-- Artistic Header -->
    <div class="relative mb-10">
      <div class="relative flex items-end justify-between">
        <div>
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.2em] mb-2 anim-fade-up">Patient Portal</p>
          <h1 class="text-4xl font-serif font-bold text-brand-dark mb-1 anim-fade-up anim-delay-1">Good {{ greeting }}, {{ firstName }} 👋</h1>
          <p class="text-text-mid text-sm anim-fade-up anim-delay-2">Here's your health overview for today</p>
        </div>
        <div class="anim-fade-up anim-delay-2">
          <router-link to="/patient/profile">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center shadow-icon cursor-pointer font-serif font-bold text-xl hover:scale-105 transition-transform">
              {{ initials }}
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card v-for="(stat, i) in stats" :key="stat.label" class="!p-4 anim-fade-up" :class="`anim-delay-${i+1}`">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" :class="stat.bg" :style="`animation-delay: ${i * 0.4}s`">
            <component :is="stat.icon" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-xl font-bold text-brand-dark leading-tight">{{ stat.value }}</p>
            <p class="text-[10px] text-text-light uppercase tracking-wider font-semibold">{{ stat.label }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Upcoming Appointments -->
    <div class="mb-8 anim-fade-up anim-delay-2">
      <div class="flex items-center justify-between mb-4">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em]">📅 Your Appointments</p>
        <router-link to="/patient/book" class="text-xs font-bold text-brand-green hover:underline">+ Book New</router-link>
      </div>

      <div class="space-y-3">
        <Card v-for="(apt, i) in appointments" :key="apt.id" class="!p-0 !overflow-hidden anim-fade-up" :class="`anim-delay-${i+1}`">
          <div class="flex items-stretch">
            <div class="w-20 shrink-0 flex flex-col items-center justify-center py-4" :class="apt.accent">
              <p class="text-[10px] font-bold text-white/80 uppercase">{{ apt.month }}</p>
              <p class="text-2xl font-bold text-white leading-tight">{{ apt.day }}</p>
              <p class="text-[10px] font-semibold text-white/70">{{ apt.weekday }}</p>
            </div>
            <div class="flex-1 p-4 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center shadow-sm font-bold text-brand-dark font-serif text-sm">
                  {{ apt.doctorInitial }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-brand-dark">{{ apt.doctor }}</h4>
                  <p class="text-xs text-text-mid">{{ apt.specialty }} · {{ apt.time }}</p>
                </div>
              </div>
              <div class="text-right">
                <div v-if="apt.status === 'upcoming'">
                  <p class="text-[10px] text-text-light uppercase tracking-wider font-semibold mb-1">Token</p>
                  <p class="text-xl font-bold" :class="apt.tokenColor">#{{ apt.token }}</p>
                </div>
                <div v-else>
                  <p class="inline-block px-3 py-1 bg-brand-green/10 text-brand-green rounded-lg text-xs font-bold uppercase tracking-wide">✓ Completed</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <p v-if="!appointments.length" class="text-center text-text-mid text-sm py-8">No appointments found. <router-link to="/patient/book" class="text-brand-green font-semibold hover:underline">Book one now →</router-link></p>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="mb-10">
      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">⚡ Quick Actions</p>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <router-link v-for="(link, i) in quickLinks" :key="link.to" :to="link.to" class="block anim-fade-up" :class="`anim-delay-${i+1}`">
          <div class="bg-white rounded-2xl p-4 shadow-card border border-brand-pale/20 text-center hover:shadow-card-hover hover:-translate-y-2 transition-all cursor-pointer group">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-icon group-hover:scale-110 transition-transform" :class="link.gradient" :style="`animation-delay: ${i * 0.3}s`">
              <component :is="link.icon" class="w-7 h-7 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark leading-tight">{{ link.label }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Health Tips -->
    <div class="anim-fade-up anim-delay-3">
      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">💡 Daily Health Tips</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card v-for="(tip, i) in healthTips" :key="i" class="!p-5 anim-fade-up" :class="`anim-delay-${i+1}`">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-icon shrink-0" :style="`animation-delay: ${i * 0.6}s`" :class="tip.gradient">
              <component :is="tip.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark mb-1">{{ tip.title }}</h4>
              <p class="text-xs text-text-mid leading-relaxed">{{ tip.desc }}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, markRaw, onMounted } from 'vue'
import Card from '../components/Card.vue'
import {
  CalendarIcon, ClockIcon, FolderIcon, BellIcon, ExclamationTriangleIcon,
  UserCircleIcon, HeartIcon, SunIcon, BeakerIcon, DocumentTextIcon, FireIcon
} from '@heroicons/vue/24/outline'

const userName = ref('Patient')
const appointments = ref([])

onMounted(async () => {
  // Load user name from localStorage
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userName.value = user.name || 'Patient'
    }
  } catch (e) {}

  // Fetch real upcoming appointments
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      const accentColors = [
        'bg-gradient-to-b from-brand-dark to-brand-mid',
        'bg-gradient-to-b from-brand-green to-brand-light',
        'bg-gradient-to-b from-brand-mid to-brand-green',
      ]
      const tokenColors = ['text-brand-green', 'text-brand-mid', 'text-brand-dark']
      const filtered = (Array.isArray(data) ? data : []).filter(a => a.status === 'upcoming' || a.status === 'completed')
      appointments.value = filtered.map((apt, i) => {
        const d = new Date(apt.date)
        const doctorName = apt.doctor_name ? 'Dr. ' + apt.doctor_name : 'Doctor'
        const nameParts = doctorName.split(' ')
        return {
          id: apt.id,
          doctor: doctorName,
          doctorInitial: nameParts.length > 1 ? nameParts[1][0] : 'D',
          specialty: apt.doctor_specialty || 'General',
          time: apt.time,
          month: d.toLocaleDateString('en', { month: 'short' }).toUpperCase(),
          day: d.getDate().toString().padStart(2, '0'),
          weekday: d.toLocaleDateString('en', { weekday: 'short' }),
          token: i + 1,
          accent: accentColors[i % accentColors.length],
          tokenColor: tokenColors[i % tokenColors.length],
          status: apt.status
        }
      })
    }
  } catch (e) {
    console.error('Failed to load appointments:', e)
  }
})

const firstName = computed(() => userName.value.split(' ')[0])
const initials = computed(() => {
  const parts = userName.value.split(' ')
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const medCount = computed(() => {
  try {
    const saved = localStorage.getItem('medlink_medications')
    if (saved) return JSON.parse(saved).length
  } catch (e) {}
  return 0
})

const stats = computed(() => [
  { label: 'Appointments', value: appointments.value.length.toString(), icon: markRaw(DocumentTextIcon), bg: 'bg-gradient-to-br from-blue-400 to-blue-500' },
  { label: 'Reminders', value: medCount.value.toString(), icon: markRaw(BellIcon), bg: 'bg-gradient-to-br from-warn to-yellow-500' },
])

const quickLinks = [
  { label: 'Book', to: '/patient/book', icon: markRaw(CalendarIcon), gradient: 'bg-gradient-to-br from-brand-green to-brand-mid' },
  { label: 'Track', to: '/patient/tracking', icon: markRaw(ClockIcon), gradient: 'bg-gradient-to-br from-brand-light to-brand-green' },
  { label: 'Reports', to: '/patient/records', icon: markRaw(FolderIcon), gradient: 'bg-gradient-to-br from-brand-dark to-brand-mid' },
  { label: 'Meds', to: '/patient/medications', icon: markRaw(BellIcon), gradient: 'bg-gradient-to-br from-warn to-yellow-500' },
  { label: 'SOS', to: '/patient/sos', icon: markRaw(ExclamationTriangleIcon), gradient: 'bg-gradient-to-br from-danger to-red-400' },
  { label: 'Profile', to: '/patient/profile', icon: markRaw(UserCircleIcon), gradient: 'bg-gradient-to-br from-gray-700 to-gray-500' },
]

const healthTips = [
  { title: 'Stay Hydrated', desc: 'Drink at least 8 glasses of water daily. Proper hydration improves energy and brain function.', icon: markRaw(BeakerIcon), gradient: 'bg-gradient-to-br from-blue-400 to-blue-500' },
  { title: 'Walk 30 Minutes', desc: 'A daily 30-minute walk reduces heart disease risk by 35% and boosts mood naturally.', icon: markRaw(HeartIcon), gradient: 'bg-gradient-to-br from-brand-green to-brand-mid' },
  { title: 'Get Sunlight', desc: 'Morning sunlight for 15 minutes helps regulate sleep and improves vitamin D levels.', icon: markRaw(SunIcon), gradient: 'bg-gradient-to-br from-warn to-yellow-500' },
]
</script>
