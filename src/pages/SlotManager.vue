<template>
  <div>
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1">Slot Manager</h1>
    <p class="text-text-mid text-sm mb-6">Set your availability for today</p>

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
      <p class="text-xs font-semibold text-text-mid uppercase tracking-wider mb-3">Slots (10 min each) — click to toggle</p>
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
import { ref } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
const startTime = ref('09:00')
const endTime = ref('17:00')
const slots = ref([])
const generateSlots = () => {
  slots.value = []
  const [sh, sm] = startTime.value.split(':').map(Number)
  const [eh, em] = endTime.value.split(':').map(Number)
  let mins = sh * 60 + sm; const endMins = eh * 60 + em
  while (mins < endMins) {
    const h = Math.floor(mins / 60).toString().padStart(2, '0')
    const m = (mins % 60).toString().padStart(2, '0')
    slots.value.push({ time: `${h}:${m}`, enabled: true })
    mins += 10
  }
}
</script>
