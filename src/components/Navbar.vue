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
        <button @click="showNotifications = !showNotifications; showDropdown = false" class="focus:outline-none relative">
          <BellIcon class="w-5 h-5 text-text-mid hover:text-brand-dark transition-colors" />
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        <div v-if="showNotifications" class="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-card border border-brand-pale/20 p-4 z-50">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-warn text-white flex items-center justify-center shadow-sm">
              <BellIcon class="w-5 h-5" />
            </div>
            <div>
              <p class="text-lg font-bold text-brand-dark leading-tight">2</p>
              <p class="text-[10px] font-bold text-text-mid uppercase tracking-wide">Reminders</p>
            </div>
          </div>
          <div class="space-y-2 mt-4">
            <div class="text-xs text-text-dark bg-cream p-2 rounded-lg border border-brand-pale/40">Dr. Sarah Connor appointment tomorrow.</div>
            <div class="text-xs text-text-dark bg-cream p-2 rounded-lg border border-brand-pale/40">Take Vitamin D supplement at 8PM.</div>
          </div>
        </div>
      </div>
      <div class="relative">
        <button @click="showDropdown = !showDropdown; showNotifications = false" class="w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-icon focus:outline-none transition-transform hover:scale-105">
          {{ portal === 'doctor' ? 'Dr' : portal === 'admin' ? 'AD' : 'PT' }}
        </button>
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-brand-pale/20 py-2 z-50 shadow-lg">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BellIcon } from '@heroicons/vue/24/outline'

defineProps({ portal: { type: String, default: null } })

const showDropdown = ref(false)
const showNotifications = ref(false)
const router = useRouter()

const logout = () => {
  showDropdown.value = false
  showNotifications.value = false
  router.push('/login')
}
</script>
