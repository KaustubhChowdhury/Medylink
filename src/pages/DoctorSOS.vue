<template>
  <div>
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1">SOS Alerts</h1>
    <p class="text-text-mid text-sm mb-6">Manage your emergency availability</p>

    <Card class="!p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-icon"
            :class="available ? 'bg-brand-green/10 text-brand-green' : 'bg-cream text-text-light'">
            <ExclamationTriangleIcon class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-bold text-brand-dark">Available for Emergency</h3>
            <p class="text-xs text-text-mid mt-0.5">Receive SOS alerts from patients</p>
          </div>
        </div>
        <button @click="toggleAvailability"
          class="w-14 h-8 rounded-full transition-colors relative"
          :class="available ? 'bg-brand-green' : 'bg-cream-dark'">
          <div class="w-6 h-6 rounded-full bg-white shadow-sm absolute top-1 transition-all"
            :class="available ? 'left-7' : 'left-1'"></div>
        </button>
      </div>
    </Card>

    <div v-if="available">
      <p class="text-xs font-semibold text-text-mid uppercase tracking-wider mb-3">Incoming Alerts</p>
      <div class="space-y-3">
        <Card v-for="(alert, index) in alerts" :key="alert.id || index" class="!p-4 !border-danger/20 anim-fade-up">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 rounded-full bg-danger animate-pulse"></div>
              <div>
                <h4 class="text-sm font-bold text-brand-dark">{{ alert.patient }}</h4>
                <p class="text-xs text-text-mid">{{ alert.time }} · {{ alert.location }}</p>
              </div>
            </div>
            <Button variant="danger" class="!text-xs !px-4 !py-2" @click="respond(alert)">Respond</Button>
          </div>
        </Card>
        <p v-if="!alerts.length" class="text-center text-text-mid text-sm py-10">No active SOS alerts</p>
      </div>
    </div>
    <div v-else class="text-center text-text-mid text-sm py-16">Toggle availability ON to receive alerts</div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const available = ref(false)
const alerts = ref([])
let intervalId = null
const auth = ref(null)

const fetchAvailability = async () => {
  try {
    const res = await fetch('http://localhost:3001/doctor/me', {
      headers: {
        'Authorization': `Bearer ${auth.value?.token}`
      }
    })
    if (res.ok) {
      const { data } = await res.json()
      available.value = data.available === 1
    }
  } catch (err) {
    console.error('Failed to fetch availability', err)
  }
}

const toggleAvailability = async () => {
  const newStatus = !available.value
  available.value = newStatus
  try {
    await fetch('http://localhost:3001/doctor/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.value?.token}`
      },
      body: JSON.stringify({ available: newStatus })
    })
  } catch (err) {
    console.error('Failed to update availability', err)
    available.value = !newStatus // revert on fail
  }
}

const checkAlerts = () => {
  const sos = localStorage.getItem('sos_alert')
  if (sos) {
    alerts.value = [JSON.parse(sos)]
  } else {
    alerts.value = []
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    auth.value = { token }
    fetchAvailability()
  }
  
  checkAlerts()
  intervalId = setInterval(checkAlerts, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const respond = (alert) => {
  localStorage.removeItem('sos_alert')
  alerts.value = []
  window.alert(`You are now responding to ${alert.patient}'s emergency.`)
}
</script>
