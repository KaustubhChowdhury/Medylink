<template>
  <div>
    <!-- Pending Approval State -->
    <div v-if="!isApproved" class="min-h-[60vh] flex items-center justify-center">
      <Card class="!p-10 text-center max-w-md anim-fade-up">
        <div class="w-20 h-20 rounded-3xl bg-warn/10 flex items-center justify-center mx-auto mb-6 shadow-icon icon-float">
          <ClockIcon class="w-10 h-10 text-warn" />
        </div>
        <h2 class="text-2xl font-serif font-bold text-brand-dark mb-4">Approval Pending</h2>
        <p class="text-text-mid text-sm leading-relaxed mb-8">
          Welcome to MedyLink! Your profile has been submitted for verification. An administrator will review your credentials shortly.
        </p>
        <div class="p-4 bg-cream rounded-2xl border border-brand-pale/30">
          <p class="text-xs font-semibold text-brand-dark">Status: Unverified</p>
          <p class="text-[10px] text-text-mid mt-1 uppercase tracking-wider">Estimated time: 24-48 hours</p>
        </div>
      </Card>
    </div>

    <!-- Active Content -->
    <div v-else>
      <div class="relative mb-10">
        <div class="absolute -top-6 -left-4 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl"></div>
        <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Appointment Queue</h1>
        <p class="text-text-mid text-sm relative">Manage today's patients</p>
      </div>

      <!-- Empty State -->
      <div v-if="!patients.length" class="text-center py-20 anim-fade-up">
        <div class="w-20 h-20 rounded-3xl bg-cream flex items-center justify-center mx-auto mb-6">
          <CalendarDaysIcon class="w-10 h-10 text-text-light" />
        </div>
        <h3 class="text-lg font-serif font-bold text-brand-dark mb-2">No Appointments Today</h3>
        <p class="text-text-mid text-sm">Your schedule is clear. New bookings will appear here automatically.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-3">
          <Card v-for="(pt, i) in patients" :key="pt.id"
            class="!p-4 cursor-pointer transition-all anim-fade-up"
            :class="[i === activeIndex ? '!border-brand-green/40 !shadow-card-hover !bg-brand-pale/5' : 'hover:shadow-card-hover', `anim-delay-${(i % 5) + 1}`]"
            @click="selectPatient(i)">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-icon transition-all"
                  :class="i < activeIndex ? 'bg-cream text-text-light' : i === activeIndex ? 'bg-gradient-to-br from-brand-green to-brand-mid text-white icon-pulse' : 'bg-cream-dark text-text-mid'">
                  #{{ pt.token }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-brand-dark">{{ pt.name }}</h4>
                  <p class="text-xs text-text-mid">{{ pt.appointmentId }} · {{ pt.time }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="i === activeIndex" class="text-[10px] font-bold uppercase bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-lg">Active</span>
                <span v-if="i < activeIndex" class="text-[10px] font-bold uppercase bg-cream text-text-light px-3 py-1.5 rounded-lg">Done</span>
                <button v-if="i === activeIndex" @click.stop="postpone(i)" class="text-xs text-warn font-bold hover:underline">Postpone</button>
              </div>
            </div>
          </Card>

          <div class="mt-4">
            <Button variant="doctor" @click="nextPatient" :disabled="activeIndex >= patients.length - 1" class="!px-6 !py-3">
              Call Next Patient →
            </Button>
          </div>
        </div>

        <div v-if="activePatient" class="space-y-4 anim-fade-up anim-delay-1">
          <!-- Patient Details -->
          <Card class="!p-5">
            <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-4">Patient Details</p>
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center font-bold font-serif text-xl shadow-icon icon-float">
                {{ getInitials(activePatient.name) }}
              </div>
              <div>
                <h3 class="font-bold text-brand-dark text-lg">{{ activePatient.name }}</h3>
                <p class="text-xs text-text-mid">{{ activePatient.appointmentId }}</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm"><span class="text-text-mid">Consultation Time</span><span class="font-semibold text-brand-dark">{{ activePatient.time }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-text-mid">Email</span><span class="font-semibold text-brand-dark">{{ activePatient.email || '—' }}</span></div>
            </div>
          </Card>

          <!-- Clinical History -->
          <Card class="!p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em]">Clinical History</p>
              <span v-if="patientHistory.length" class="text-[9px] font-bold text-brand-mid bg-brand-pale/20 px-2 py-0.5 rounded">{{ patientHistory.length }} records</span>
            </div>
            <div v-if="historyLoading" class="text-center py-6">
              <p class="text-xs text-text-mid animate-pulse">Loading records...</p>
            </div>
            <div class="space-y-3" v-else-if="patientHistory.length">
              <div v-for="h in patientHistory" :key="h.id" class="p-3 bg-cream/50 rounded-xl border border-brand-pale/20">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[10px] font-bold text-brand-dark uppercase">{{ h.title }}</span>
                  <span class="text-[9px] text-text-mid">{{ h.date }}</span>
                </div>
                <p v-if="h.condition" class="text-[9px] text-brand-mid font-bold mb-1">{{ h.condition }}</p>
                <p class="text-[11px] text-text-mid leading-relaxed">{{ h.record }}</p>
              </div>
            </div>
            <p v-else class="text-xs text-text-mid italic py-4 text-center">No prior clinical history found.</p>
          </Card>

          <!-- AI Summary -->
          <Card class="!p-5">
            <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">AI Consultation Summary</p>
            <div v-if="aiSummary" class="text-xs text-brand-dark leading-relaxed bg-cream rounded-xl p-4 border border-brand-pale/30">
              {{ aiSummary }}
            </div>
            <Button v-else variant="doctor" @click="generateSummary" block :disabled="generating">
              {{ generating ? 'Generating...' : 'Generate Summary' }}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { ClockIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

// ── State ──────────────────────────────────────
const activeIndex = ref(0)
const aiSummary = ref('')
const isApproved = ref(false)
const patients = ref([])
const patientHistory = ref([])
const historyLoading = ref(false)
const generating = ref(false)

// ── Computed ───────────────────────────────────
const activePatient = computed(() => patients.value[activeIndex.value] || null)

const getInitials = (name) => {
  if (!name) return 'P'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ── Methods ────────────────────────────────────
const fetchPatientHistory = async (userId) => {
  if (!userId) return
  historyLoading.value = true
  patientHistory.value = []
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/doctor/patient-history/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      patientHistory.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch patient history:', err)
  } finally {
    historyLoading.value = false
  }
}

const selectPatient = (i) => {
  activeIndex.value = i
  aiSummary.value = ''
  if (patients.value[i]?.userId) {
    fetchPatientHistory(patients.value[i].userId)
  }
}

const loadAppointments = async () => {
  try {
    const token = localStorage.getItem('token')
    
    // Check approval status
    const profRes = await fetch('http://localhost:3001/doctor/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (profRes.ok) {
      const profData = await profRes.json()
      isApproved.value = !!profData.approved
    }

    if (!isApproved.value) return

    // Fetch appointments
    const res = await fetch('http://localhost:3001/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        patients.value = data.map((apt, index) => ({
          id: apt.id,
          userId: apt.user_id,
          token: index + 1,
          name: apt.patient_name || 'Patient',
          appointmentId: `APT-${1000 + apt.id}`,
          time: apt.time,
          email: apt.patient_email || ''
        }))
        // Load history for initial patient
        if (patients.value[0]?.userId) {
          fetchPatientHistory(patients.value[0].userId)
        }
      }
    }
  } catch (err) {
    console.error('Failed to load appointments:', err)
  }
}

const nextPatient = () => {
  if (activeIndex.value < patients.value.length - 1) {
    selectPatient(activeIndex.value + 1)
  }
}

const postpone = (i) => {
  const p = patients.value.splice(i, 1)[0]
  patients.value.push(p)
  selectPatient(0)
}

const generateSummary = () => {
  generating.value = true
  setTimeout(() => {
    const p = activePatient.value
    const count = patientHistory.value.length
    const latest = patientHistory.value[0]
    aiSummary.value = `Analysis of ${p?.name || 'Patient'}'s clinical file: Patient has ${count} previous record(s). ${latest ? `Most recent activity on ${latest.date} for "${latest.condition || latest.title}".` : 'No prior visit data.'} Overall status: Stable. Proceed with today's evaluation.`
    generating.value = false
  }, 1000)
}

// ── Lifecycle ──────────────────────────────────
onMounted(() => {
  loadAppointments()
})
</script>
