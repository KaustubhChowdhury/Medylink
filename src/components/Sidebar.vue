<template>
  <aside class="w-64 h-full flex flex-col bg-brand-dark shrink-0">
    <!-- Brand -->
    <div class="px-6 pt-8 pb-6">
      <div class="flex items-center gap-3">
        <svg class="w-8 h-8 text-brand-pale" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="square" stroke-linejoin="miter">
          <path d="M 35,50 L 35,25 L 50,10 L 65,25 L 65,65" />
          <path d="M 50,35 L 75,35 L 90,50 L 75,65 L 35,65" />
          <path d="M 65,50 L 65,75 L 50,90 L 35,75 L 35,35" />
          <path d="M 50,65 L 25,65 L 10,50 L 25,35 L 65,35" />
        </svg>
        <h1 class="text-2xl font-serif font-bold text-white tracking-tight">MedyLink</h1>
      </div>
      <p class="text-[10px] text-brand-pale uppercase tracking-[0.2em] font-semibold mt-1">
        {{ portal === 'doctor' ? 'Doctor Portal' : portal === 'admin' ? 'Admin Portal' : 'Patient Portal' }}
      </p>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
      <router-link v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-pale/80 transition-all hover:bg-white/10 hover:text-white"
        active-class="!bg-white/15 !text-white !font-semibold"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Logout -->
    <div class="px-3 pb-6">
      <button @click="logout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-pale/60 hover:bg-white/10 hover:text-white transition-colors">
        <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        Sign Out
      </button>
    </div>
  </aside>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeIcon, CalendarIcon, ClockIcon, FolderIcon, BellIcon,
  ExclamationTriangleIcon, QueueListIcon, Cog6ToothIcon,
  UserGroupIcon, ShieldCheckIcon, ArrowLeftOnRectangleIcon, UserIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({ portal: { type: String, default: null } })
const router = useRouter()

const patientNav = [
  { name: 'Dashboard', to: '/patient/dashboard', icon: HomeIcon },
  { name: 'Book Appointment', to: '/patient/book', icon: CalendarIcon },
  { name: 'Track Appointment', to: '/patient/tracking', icon: ClockIcon },
  { name: 'My Reports', to: '/patient/records', icon: FolderIcon },
  { name: 'Medications', to: '/patient/medications', icon: BellIcon },
  { name: 'SOS', to: '/patient/sos', icon: ExclamationTriangleIcon },
  { name: 'My Profile', to: '/patient/profile', icon: UserIcon },
]
const doctorNav = [
  { name: 'Queue', to: '/doctor/dashboard', icon: QueueListIcon },
  { name: 'Slot Manager', to: '/doctor/slots', icon: Cog6ToothIcon },
  { name: 'Past Patients', to: '/doctor/patients', icon: UserGroupIcon },
  { name: 'SOS Alerts', to: '/doctor/sos', icon: ExclamationTriangleIcon },
  { name: 'Profile', to: '/doctor/profile', icon: UserIcon },
]
const adminNav = [
  { name: 'Approvals', to: '/admin/dashboard', icon: ShieldCheckIcon },
  { name: 'Practitioners', to: '/admin/doctors', icon: UserGroupIcon },
]

const navItems = computed(() => {
  if (props.portal === 'doctor') return doctorNav
  if (props.portal === 'admin') return adminNav
  return patientNav
})
const logout = () => router.push('/login')
</script>
