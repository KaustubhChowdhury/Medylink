<template>
  <div>
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1">Medication Reminders</h1>
    <p class="text-text-mid text-sm mb-6">Set alerts for your medicines</p>

    <Card class="!p-6 mb-6">
      <p class="text-xs font-semibold text-text-mid uppercase tracking-wider mb-4">Add Reminder</p>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label class="block text-xs text-text-mid mb-1">Medicine Name</label>
          <input v-model="form.name" type="text" placeholder="e.g. Metformin"
            class="w-full bg-cream border-2 border-brand-pale/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
        </div>
        <div>
          <label class="block text-xs text-text-mid mb-1">When</label>
          <select v-model="form.period"
            class="w-full bg-cream border-2 border-brand-pale/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green">
            <option value="">Select</option>
            <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Custom</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-text-mid mb-1">Exact Time</label>
          <input v-model="form.time" type="time"
            class="w-full bg-cream border-2 border-brand-pale/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
        </div>
        <Button variant="patient" @click="addReminder" :disabled="!form.name || !form.period">Add</Button>
      </div>
    </Card>

    <div class="space-y-3">
      <Card v-for="(med, i) in reminders" :key="i" class="!p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-warn/15 flex items-center justify-center shadow-icon">
              <BellIcon class="w-6 h-6 text-warn" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ med.name }}</h4>
              <p class="text-xs text-text-mid">{{ med.period }} · {{ med.time || 'No time set' }}</p>
            </div>
          </div>
          <button @click="removeReminder(i)" class="text-danger hover:underline text-xs font-semibold">Remove</button>
        </div>
      </Card>
      <p v-if="!reminders.length" class="text-center text-text-mid text-sm py-10">No reminders yet</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { BellIcon } from '@heroicons/vue/24/outline'

const form = ref({ name: '', period: '', time: '' })
const reminders = ref([
  { name: 'Metformin 500mg', period: 'Morning', time: '08:00' },
  { name: 'Atorvastatin 10mg', period: 'Evening', time: '21:00' },
])

onMounted(() => {
  const saved = localStorage.getItem('medlink_medications')
  if (saved) {
    reminders.value = JSON.parse(saved)
  }
})

watch(reminders, (newVal) => {
  localStorage.setItem('medlink_medications', JSON.stringify(newVal))
}, { deep: true })

const addReminder = () => {
  if (!form.value.name || !form.value.period) return
  reminders.value.push({ ...form.value })
  form.value = { name: '', period: '', time: '' }
}

const removeReminder = (index) => {
  reminders.value.splice(index, 1)
}
</script>
