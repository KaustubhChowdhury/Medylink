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
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-icon"
              :class="med.taken ? 'bg-brand-pale/30' : 'bg-warn/15'">
              <CheckCircleIcon v-if="med.taken" class="w-6 h-6 text-brand-green" />
              <BellIcon v-else class="w-6 h-6 text-warn" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark" :class="{ 'line-through opacity-50': med.taken }">{{ med.name }}</h4>
              <p class="text-xs text-text-mid">{{ med.period }} · {{ med.time || 'No time set' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button v-if="!med.taken" @click="markTaken(i)"
              class="text-xs font-semibold text-brand-green bg-brand-pale/20 px-3 py-1.5 rounded-lg hover:bg-brand-pale/40 transition-colors">
              ✓ Taken
            </button>
            <span v-else class="text-[10px] font-bold text-brand-green uppercase tracking-wider">Done</span>
            <button @click="removeReminder(i)" class="text-danger hover:underline text-xs font-semibold">Remove</button>
          </div>
        </div>
      </Card>
      <p v-if="!reminders.length" class="text-center text-text-mid text-sm py-10">No reminders yet</p>
    </div>

    <!-- Alarm notification popup -->
    <Teleport to="body">
      <transition name="alarm-fade">
        <div v-if="alarmActive" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center anim-fade-up border-4 border-warn/40">
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-warn to-yellow-500 flex items-center justify-center mx-auto mb-5 shadow-icon alarm-ring">
              <BellAlertIcon class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">💊 Medication Time!</h2>
            <p class="text-text-mid text-sm mb-1">It's time to take:</p>
            <p class="text-xl font-bold text-brand-dark mb-4">{{ alarmMed?.name }}</p>
            <p class="text-xs text-text-mid mb-6">{{ alarmMed?.period }} · {{ alarmMed?.time }}</p>
            <div class="flex gap-3 justify-center">
              <button @click="dismissAlarm(true)"
                class="bg-gradient-to-r from-brand-dark to-brand-mid text-white font-bold rounded-xl px-6 py-3 text-sm hover:brightness-110 transition-all shadow-btn active:scale-[0.98]">
                ✓ Mark as Taken
              </button>
              <button @click="dismissAlarm(false)"
                class="bg-cream border-2 border-brand-pale/40 text-text-mid font-bold rounded-xl px-6 py-3 text-sm hover:border-brand-green transition-all">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { BellIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { BellAlertIcon } from '@heroicons/vue/24/solid'

const form = ref({ name: '', period: '', time: '' })
const reminders = ref([])
const alarmActive = ref(false)
const alarmMed = ref(null)
let alarmInterval = null
let alarmAudio = null

// Load saved reminders
onMounted(() => {
  const saved = localStorage.getItem('medlink_medications')
  if (saved) {
    try {
      reminders.value = JSON.parse(saved)
    } catch (e) {
      reminders.value = []
    }
  }

  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }

  // Start alarm checker — runs every 15 seconds
  alarmInterval = setInterval(checkAlarms, 15000)
  // Also check immediately
  checkAlarms()
})

onUnmounted(() => {
  clearInterval(alarmInterval)
  if (alarmAudio) {
    alarmAudio.pause()
    alarmAudio = null
  }
})

// Persist reminders on every change
watch(reminders, (newVal) => {
  localStorage.setItem('medlink_medications', JSON.stringify(newVal))
}, { deep: true })

const addReminder = () => {
  if (!form.value.name || !form.value.period) return
  // Auto-assign time based on period if not set
  let time = form.value.time
  if (!time) {
    if (form.value.period === 'Morning') time = '08:00'
    else if (form.value.period === 'Afternoon') time = '13:00'
    else if (form.value.period === 'Evening') time = '20:00'
    else time = '12:00'
  }
  reminders.value.push({ name: form.value.name, period: form.value.period, time, taken: false, lastAlarmDate: '' })
  form.value = { name: '', period: '', time: '' }
}

const removeReminder = (index) => {
  reminders.value.splice(index, 1)
}

const markTaken = (index) => {
  reminders.value[index].taken = true
}

const checkAlarms = () => {
  if (alarmActive.value) return // Don't stack alarms

  const now = new Date()
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
  const today = now.toISOString().split('T')[0]

  for (let i = 0; i < reminders.value.length; i++) {
    const med = reminders.value[i]
    if (med.taken) continue
    if (med.lastAlarmDate === today) continue // Already alerted today
    if (!med.time) continue

    // Check if current time matches (within 1 minute window)
    const [medH, medM] = med.time.split(':').map(Number)
    const [nowH, nowM] = currentTime.split(':').map(Number)
    const medTotal = medH * 60 + medM
    const nowTotal = nowH * 60 + nowM

    if (nowTotal >= medTotal && nowTotal <= medTotal + 1) {
      // TRIGGER ALARM
      triggerAlarm(med, i)
      break
    }
  }
}

const triggerAlarm = (med, index) => {
  alarmMed.value = { ...med, index }
  alarmActive.value = true

  // Mark so we don't re-trigger today
  reminders.value[index].lastAlarmDate = new Date().toISOString().split('T')[0]

  // Play alarm sound using Web Audio API
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const playBeep = (freq, startTime, duration) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }
    // Play 3 pleasant beeps
    const now = audioCtx.currentTime
    playBeep(880, now, 0.3)
    playBeep(1100, now + 0.4, 0.3)
    playBeep(880, now + 0.8, 0.5)
    // Repeat after 2 seconds
    playBeep(880, now + 2, 0.3)
    playBeep(1100, now + 2.4, 0.3)
    playBeep(880, now + 2.8, 0.5)
  } catch (e) {
    console.log('Audio not supported')
  }

  // Also send browser notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('💊 MedyLink Medication Reminder', {
      body: `Time to take ${med.name} (${med.period})`,
      icon: '/favicon.ico',
      tag: 'med-reminder'
    })
  }
}

const dismissAlarm = (markAsTaken) => {
  if (markAsTaken && alarmMed.value) {
    reminders.value[alarmMed.value.index].taken = true
  }
  alarmActive.value = false
  alarmMed.value = null
}
</script>
<style scoped>
.alarm-ring {
  animation: ring 0.5s ease-in-out infinite alternate;
}
@keyframes ring {
  0% { transform: rotate(-8deg) scale(1); }
  100% { transform: rotate(8deg) scale(1.05); }
}
.alarm-fade-enter-active, .alarm-fade-leave-active { transition: opacity 0.3s ease; }
.alarm-fade-enter-from, .alarm-fade-leave-to { opacity: 0; }
</style>
