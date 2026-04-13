<template>
  <div>
    <!-- Artistic Header -->
    <div class="relative mb-10">
      <div class="absolute -top-8 -left-8 w-40 h-40 bg-brand-pale/20 rounded-full blur-3xl"></div>
      <div class="absolute -top-4 right-1/4 w-24 h-24 bg-warn/10 rounded-full blur-2xl"></div>
      <div class="relative flex items-end justify-between">
        <div>
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.2em] mb-2 anim-fade-up">Patient Portal</p>
          <h1 class="text-4xl font-serif font-bold text-brand-dark mb-1 anim-fade-up anim-delay-1">Good {{ greeting }}, Elena 👋</h1>
          <p class="text-text-mid text-sm anim-fade-up anim-delay-2">Here's your health overview for today</p>
        </div>
        <div class="anim-fade-up anim-delay-2">
          <router-link to="/patient/profile">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center shadow-icon icon-pulse cursor-pointer font-serif font-bold text-xl hover:scale-105 transition-transform">
              ER
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card v-for="(stat, i) in stats" :key="stat.label" class="!p-4 anim-fade-up" :class="`anim-delay-${i+1}`">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm icon-float" :class="stat.bg" :style="`animation-delay: ${i * 0.4}s`">
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
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em]">📅 Upcoming Appointments</p>
        <router-link to="/patient/book" class="text-xs font-bold text-brand-green hover:underline">+ Book New</router-link>
      </div>

      <div class="space-y-3">
        <Card v-for="(apt, i) in appointments" :key="apt.id" class="!p-0 !overflow-hidden anim-fade-up" :class="`anim-delay-${i+1}`">
          <div class="flex items-stretch">
            <!-- Date Stripe -->
            <div class="w-20 shrink-0 flex flex-col items-center justify-center py-4" :class="apt.accent">
              <p class="text-[10px] font-bold text-white/80 uppercase">{{ apt.month }}</p>
              <p class="text-2xl font-bold text-white leading-tight">{{ apt.day }}</p>
              <p class="text-[10px] font-semibold text-white/70">{{ apt.weekday }}</p>
            </div>
            <!-- Details -->
            <div class="flex-1 p-4 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center shadow-sm font-bold text-brand-dark font-serif text-sm" :class="i === 0 ? 'icon-pulse' : ''">
                  {{ apt.doctor.split(' ')[1][0] }}{{ apt.doctor.split(' ')[2]?.[0] || '' }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-brand-dark">{{ apt.doctor }}</h4>
                  <p class="text-xs text-text-mid">{{ apt.specialty }} · {{ apt.time }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-text-light uppercase tracking-wider font-semibold mb-1">Token</p>
                <p class="text-xl font-bold" :class="apt.tokenColor">#{{ apt.token }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="mb-10">
      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">⚡ Quick Actions</p>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <router-link v-for="(link, i) in quickLinks" :key="link.to" :to="link.to" class="block anim-fade-up" :class="`anim-delay-${i+1}`">
          <div class="bg-white rounded-2xl p-4 shadow-card border border-brand-pale/20 text-center hover:shadow-card-hover hover:-translate-y-2 transition-all cursor-pointer group">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-icon icon-float group-hover:scale-110 transition-transform" :class="link.gradient" :style="`animation-delay: ${i * 0.3}s`">
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
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-icon shrink-0 icon-float" :style="`animation-delay: ${i * 0.6}s`" :class="tip.gradient">
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
import { computed, markRaw } from 'vue'
import Card from '../components/Card.vue'
import {
  CalendarIcon, ClockIcon, FolderIcon, BellIcon, ExclamationTriangleIcon,
  UserCircleIcon, HeartIcon, SunIcon, BeakerIcon, DocumentTextIcon, FireIcon
} from '@heroicons/vue/24/outline'

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const stats = [
  { label: 'Heart Rate', value: '72 bpm', icon: markRaw(HeartIcon), bg: 'bg-gradient-to-br from-danger to-red-400' },
  { label: 'Blood O₂', value: '98%', icon: markRaw(FireIcon), bg: 'bg-gradient-to-br from-brand-green to-brand-mid' },
  { label: 'Reports', value: '3', icon: markRaw(DocumentTextIcon), bg: 'bg-gradient-to-br from-blue-400 to-blue-500' },
  { label: 'Reminders', value: '2', icon: markRaw(BellIcon), bg: 'bg-gradient-to-br from-warn to-yellow-500' },
]

const appointments = [
  { id: 1, doctor: 'Dr. Helena Vance', specialty: 'Cardiology', time: '09:30 AM', month: 'OCT', day: '06', weekday: 'Mon', token: 7, accent: 'bg-gradient-to-b from-brand-dark to-brand-mid', tokenColor: 'text-brand-green' },
  { id: 2, doctor: 'Dr. Raj Singh', specialty: 'Neurology', time: '02:00 PM', month: 'OCT', day: '12', weekday: 'Sun', token: 3, accent: 'bg-gradient-to-b from-brand-green to-brand-light', tokenColor: 'text-brand-mid' },
  { id: 3, doctor: 'Dr. Sarah Connor', specialty: 'General', time: '11:00 AM', month: 'OCT', day: '18', weekday: 'Sat', token: 5, accent: 'bg-gradient-to-b from-brand-mid to-brand-green', tokenColor: 'text-brand-dark' },
]

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
