<template>
  <div>
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1">Slot Manager</h1>
    <p class="text-text-mid text-sm mb-6">Set your availability for today</p>

    <!-- Success Message -->
    <div v-if="successMsg" class="mb-6 p-4 bg-brand-green/10 text-brand-green border border-brand-green/30 rounded-xl font-bold flex items-center gap-3 anim-fade-up">
      <CheckCircleIcon class="w-5 h-5" />
      {{ successMsg }}
    </div>

    <Card class="!p-6 mb-6">
      <p class="text-xs font-semibold text-text-mid uppercase tracking-wider mb-4">Working Hours</p>
      <div class="flex items-end gap-4 flex-wrap">
        <div>
          <label class="block text-xs text-text-mid mb-1">Start Time</label>
          <input v-model="startTime" type="time" class="bg-cream border-2 border-brand-pale/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
        </div>
        <div>
          <label class="block text-xs text-text-mid mb-1">End Time</label>
          <input v-model="endTime" type="time" class="bg-cream border-2 border-brand-pale/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
        </div>
        <Button variant="doctor" @click="generateSlots">Generate Slots</Button>
      </div>
    </Card>

    <div v-if="slots.length">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs font-semibold text-text-mid uppercase tracking-wider">Slots (10 min each) — click to toggle</p>
        <Button variant="success" @click="saveSlots" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Availability' }}
        </Button>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <button v-for="slot in slots" :key="slot.time" @click="slot.enabled = !slot.enabled"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
          :class="slot.enabled ? 'bg-white border-brand-green text-brand-dark shadow-sm' : 'bg-cream-dark border-cream-dark text-text-light line-through'">
          {{ slot.time }}
        </button>
      </div>
      <p class="text-xs text-text-mid">
        <span class="text-brand-green font-bold">{{ slots.filter(s => s.enabled).length }}</span> active ·
        <span class="text-text-light font-bold">{{ slots.filter(s => !s.enabled).length }}</span> disabled
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const startTime = ref('09:00')
const endTime = ref('17:00')
const slots = ref([])
const saving = ref(false)
const successMsg = ref('')

const fetchSlots = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/doctor/slots', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      slots.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch slots:', err)
  }
}

onMounted(() => {
  fetchSlots()
})

const generateSlots = () => {
  const newSlots = []
  const [sh, sm] = startTime.value.split(':').map(Number)
  const [eh, em] = endTime.value.split(':').map(Number)
  let mins = sh * 60 + sm; const endMins = eh * 60 + em
  while (mins < endMins) {
    const h = Math.floor(mins / 60).toString().padStart(2, '0')
    const m = (mins % 60).toString().padStart(2, '0')
    const time = `${h}:${m}`
    // Preserve enabled status if slot existed
    const existing = slots.value.find(s => s.time === time)
    newSlots.push({ time, enabled: existing ? !!existing.enabled : true })
    mins += 10
  }
  slots.value = newSlots
}

const saveSlots = async () => {
  saving.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/doctor/slots', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slots: slots.value })
    })
    if (res.ok) {
      successMsg.value = 'Availability slots updated successfully!'
      setTimeout(() => { successMsg.value = '' }, 3000)
    }
  } catch (err) {
    console.error('Failed to save slots:', err)
  } finally {
    saving.value = false
  }
}
</script>
