<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-brand-pale/30 relative z-50">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
      <h2 class="text-sm font-semibold text-text-dark">
        {{ portal === 'doctor' ? 'Doctor Portal' : portal === 'admin' ? 'Admin Portal' : 'Patient Portal' }}
      </h2>
    </div>
    <div class="flex items-center gap-4">
      <div class="relative">
        <button @click="toggleNotifications" class="focus:outline-none relative">
          <BellIcon class="w-5 h-5 text-text-mid hover:text-brand-dark transition-colors" />
          <span v-if="notifCount > 0" class="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-danger rounded-full flex items-center justify-center">
            <span class="text-[9px] font-bold text-white leading-none">{{ notifCount > 9 ? '9+' : notifCount }}</span>
          </span>
        </button>
        <div v-if="showNotifications" class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-card border border-brand-pale/20 z-50 overflow-hidden">
          <div class="px-4 py-3 border-b border-brand-pale/20 flex items-center justify-between">
            <p class="text-xs font-bold text-brand-dark uppercase tracking-wider">Notifications</p>
            <button v-if="notifications.length" @click="clearAll" class="text-[10px] text-text-light hover:text-danger font-semibold">Clear All</button>
          </div>
          <div class="max-h-72 overflow-y-auto">
            <div v-for="(n, i) in notifications" :key="i"
              class="px-4 py-3 border-b border-brand-pale/10 last:border-0 hover:bg-cream/50 transition-colors flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm mt-0.5"
                :class="n.type === 'med' ? 'bg-warn/20' : n.type === 'apt' ? 'bg-brand-pale/30' : 'bg-danger/15'">
                <BellIcon v-if="n.type === 'med'" class="w-4 h-4 text-warn" />
                <CalendarIcon v-else-if="n.type === 'apt'" class="w-4 h-4 text-brand-dark" />
                <ExclamationTriangleIcon v-else class="w-4 h-4 text-danger" />
              </div>
              <div>
                <p class="text-xs font-semibold text-brand-dark">{{ n.title }}</p>
                <p class="text-[11px] text-text-mid mt-0.5">{{ n.body }}</p>
                <p class="text-[9px] text-text-light mt-1">{{ n.time }}</p>
              </div>
            </div>
            <div v-if="!notifications.length" class="px-4 py-8 text-center">
              <p class="text-xs text-text-light">No new notifications</p>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <button @click="showDropdown = !showDropdown; showNotifications = false" class="w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-icon focus:outline-none transition-transform hover:scale-105">
          {{ userInitials }}
        </button>
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-brand-pale/20 py-2 z-50 shadow-lg">
          <div class="px-4 py-2 border-b border-brand-pale/20 mb-1">
            <p class="text-xs font-bold text-brand-dark truncate">{{ userName }}</p>
            <p class="text-[10px] text-text-light truncate">{{ userEmail }}</p>
          </div>
          <router-link v-if="portal !== 'doctor'" @click="showDropdown = false" to="/patient/profile" class="block py-2 px-4 text-sm text-text-dark hover:bg-brand-pale/20 hover:text-brand-dark transition-colors text-left">Profile</router-link>
          <router-link v-if="portal === 'doctor'" @click="showDropdown = false" to="/doctor/profile" class="block py-2 px-4 text-sm text-text-dark hover:bg-brand-pale/20 hover:text-brand-dark transition-colors text-left">Profile</router-link>
          <router-link @click="showDropdown = false" to="/settings" class="block py-2 px-4 text-sm text-text-dark hover:bg-brand-pale/20 hover:text-brand-dark transition-colors text-left">Settings</router-link>
          <div class="border-t border-brand-pale/30 my-1"></div>
          <button @click="logout" class="w-full text-left py-2 px-4 text-sm text-danger font-semibold hover:bg-danger/10 transition-colors">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { BellIcon, CalendarIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps({ portal: { type: String, default: null } })

const showDropdown = ref(false)
const showNotifications = ref(false)
const notifications = ref([])
const router = useRouter()

const userName = ref('')
const userEmail = ref('')

const userInitials = computed(() => {
  if (!userName.value) return 'U'
  return userName.value.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const notifCount = computed(() => notifications.value.length)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showDropdown.value = false
}

const clearAll = () => {
  notifications.value = []
  localStorage.setItem('medlink_notifs_cleared', new Date().toISOString())
}

const buildNotifications = async () => {
  const notifs = []
  const clearedAt = localStorage.getItem('medlink_notifs_cleared')
  const clearedTime = clearedAt ? new Date(clearedAt).getTime() : 0

  // 1. Medication reminders due today
  try {
    const saved = localStorage.getItem('medlink_medications')
    if (saved) {
      const meds = JSON.parse(saved)
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      meds.forEach(med => {
        if (med.taken) return
        if (!med.time) return
        const [h, m] = med.time.split(':').map(Number)
        const medMinutes = h * 60 + m
        // Show reminder if it's within 30 min before or after the scheduled time
        if (currentMinutes >= medMinutes - 30 && currentMinutes <= medMinutes + 60) {
          notifs.push({
            type: 'med',
            title: `💊 ${med.name}`,
            body: `${med.period} dose — scheduled at ${med.time}`,
            time: 'Today',
            ts: Date.now()
          })
        }
      })
    }
  } catch (e) {}

  // 2. Upcoming appointments
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await fetch('http://localhost:3001/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const upcoming = (Array.isArray(data) ? data : []).filter(a => a.status === 'upcoming')
        upcoming.forEach(apt => {
          const aptDate = new Date(apt.date)
          const today = new Date()
          const diffDays = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24))
          let timeLabel = aptDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })
          if (diffDays <= 0) timeLabel = 'Today'
          else if (diffDays === 1) timeLabel = 'Tomorrow'

          notifs.push({
            type: 'apt',
            title: `📅 Appointment with Dr. ${apt.doctor_name || 'Doctor'}`,
            body: `${apt.doctor_specialty || 'General'} · ${apt.time} · ${timeLabel}`,
            time: timeLabel,
            ts: aptDate.getTime()
          })
        })
      }
    }
  } catch (e) {}

  // 3. SOS alerts (for doctors)
  try {
    const sosAlert = localStorage.getItem('sos_alert')
    if (sosAlert) {
      const sos = JSON.parse(sosAlert)
      if (!clearedAt || new Date(sos.time || 0).getTime() > clearedTime) {
        notifs.push({
          type: 'sos',
          title: '🚨 Emergency SOS Alert',
          body: sos.message || 'A patient has triggered an emergency alert',
          time: 'Just now',
          ts: Date.now()
        })
      }
    }
  } catch (e) {}

  // Filter out if notifications were cleared after they were created
  notifications.value = notifs.filter(n => n.ts > clearedTime)
}

let refreshInterval = null

onMounted(() => {
  // Load user info
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userName.value = user.name || ''
      userEmail.value = user.email || ''
    }
  } catch (e) {}

  buildNotifications()
  // Refresh notifications every 30 seconds
  refreshInterval = setInterval(buildNotifications, 30000)
})

onUnmounted(() => {
  clearInterval(refreshInterval)
})

const logout = () => {
  showDropdown.value = false
  showNotifications.value = false
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('medlink_notifs_cleared')
  router.push('/login')
}
</script>
