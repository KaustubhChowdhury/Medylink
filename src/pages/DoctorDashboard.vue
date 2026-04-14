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
                <span v-if="pt.completed" class="text-[10px] font-bold uppercase bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-lg">✓ Completed</span>
                <span v-else-if="i === activeIndex" class="text-[10px] font-bold uppercase bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-lg">Active</span>
                <span v-else-if="i < activeIndex" class="text-[10px] font-bold uppercase bg-cream text-text-light px-3 py-1.5 rounded-lg">Waiting</span>
                <button v-if="i === activeIndex && !pt.completed" @click.stop="postpone(i)" class="text-xs text-warn font-bold hover:underline">Postpone</button>
              </div>
            </div>
          </Card>

          <div class="mt-4 flex items-center gap-3">
            <Button variant="doctor" @click="completeVisit" class="!px-6 !py-3" :disabled="!activePatient">
              ✓ Complete Visit
            </Button>
            <Button variant="doctor" @click="nextPatient" :disabled="activeIndex >= patients.length - 1" class="!px-6 !py-3 !bg-gradient-to-r !from-brand-mid !to-brand-green">
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

          <!-- Patient Reports -->
          <Card class="!p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em]">Patient Reports</p>
              <span v-if="patientReports.length" class="text-[9px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">{{ patientReports.length }} files</span>
            </div>
            <div v-if="reportsLoading" class="text-center py-4">
              <p class="text-xs text-text-mid animate-pulse">Loading reports...</p>
            </div>
            <div class="space-y-2" v-else-if="patientReports.length">
              <div v-for="rpt in patientReports" :key="rpt.id" class="flex items-center gap-3 p-3 bg-cream/50 rounded-xl border border-brand-pale/20 cursor-pointer hover:bg-cream transition-colors" @click="viewReport(rpt)">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0"
                  :class="rpt.type === 'PDF' ? 'bg-gradient-to-br from-danger to-red-400 text-white' : 'bg-gradient-to-br from-brand-green to-brand-mid text-white'">
                  {{ rpt.type }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-brand-dark truncate">{{ rpt.name }}</p>
                  <p class="text-[9px] text-text-mid">{{ rpt.date }} · by {{ rpt.uploader_name || 'Patient' }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-xs text-text-mid italic py-4 text-center">No reports on file.</p>
          </Card>

          <!-- Upload Report -->
          <Card class="!p-5">
            <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Upload Report for Patient</p>
            <div class="space-y-3">
              <input v-model="newReportName" type="text" placeholder="Report name (e.g. Blood Test Results)"
                class="w-full bg-cream border border-brand-pale/30 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-mid transition-all" />
              <label class="flex items-center justify-center gap-2 cursor-pointer py-4 border-2 border-dashed border-brand-pale/40 rounded-xl hover:border-brand-mid transition-colors bg-cream/30">
                <ArrowUpTrayIcon class="w-4 h-4 text-brand-mid" />
                <span class="text-xs text-text-mid font-semibold">{{ uploadFileName || 'Choose file (Image/PDF)' }}</span>
                <input type="file" class="hidden" @change="handleDoctorUpload" accept="image/*,.pdf" />
              </label>
              <Button variant="doctor" block :disabled="reportUploading || !uploadFileData" @click="submitReport">
                {{ reportUploading ? 'Uploading...' : 'Submit Report' }}
              </Button>
              <p v-if="reportSuccess" class="text-[9px] text-brand-green font-bold text-center animate-bounce">{{ reportSuccess }}</p>
            </div>
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

    <!-- Report Viewer Modal -->
    <div v-if="viewingReport" class="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="viewingReport = null">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto shadow-card-hover anim-fade-up">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-brand-dark">{{ viewingReport.name }}</h3>
          <button @click="viewingReport = null" class="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-text-mid hover:bg-cream-dark text-lg">&times;</button>
        </div>
        <div v-if="viewingReport.data" class="rounded-2xl overflow-hidden border border-brand-pale/30">
          <img v-if="viewingReport.type === 'Image'" :src="viewingReport.data" class="w-full" />
          <embed v-else-if="viewingReport.type === 'PDF'" :src="viewingReport.data" type="application/pdf" class="w-full h-[500px]" />
        </div>
        <div v-else class="p-8 text-center text-text-mid text-sm">No preview available for this file.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { ClockIcon, CalendarDaysIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline'

// ── State ──────────────────────────────────────
const activeIndex = ref(0)
const aiSummary = ref('')
const isApproved = ref(false)
const patients = ref([])
const patientHistory = ref([])
const historyLoading = ref(false)
const generating = ref(false)
const patientReports = ref([])
const reportsLoading = ref(false)
const viewingReport = ref(null)
const newReportName = ref('')
const uploadFileName = ref('')
const uploadFileData = ref('')
const uploadFileType = ref('')
const reportUploading = ref(false)
const reportSuccess = ref('')

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

const fetchPatientReports = async (userId) => {
  if (!userId) return
  reportsLoading.value = true
  patientReports.value = []
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/doctor/patient-reports/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      patientReports.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch patient reports:', err)
  } finally {
    reportsLoading.value = false
  }
}

const viewReport = (rpt) => {
  viewingReport.value = rpt
}

const handleDoctorUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadFileName.value = file.name
  uploadFileType.value = file.type.startsWith('image') ? 'Image' : 'PDF'
  if (!newReportName.value) newReportName.value = file.name
  const reader = new FileReader()
  reader.onload = (event) => {
    uploadFileData.value = event.target.result
  }
  reader.readAsDataURL(file)
}

const submitReport = async () => {
  if (!uploadFileData.value || !newReportName.value || !activePatient.value) return
  reportUploading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/doctor/upload-patient-report', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_user_id: activePatient.value.userId,
        name: newReportName.value,
        type: uploadFileType.value,
        date: new Date().toISOString().split('T')[0],
        data: uploadFileData.value
      })
    })
    if (res.ok) {
      reportSuccess.value = 'Report uploaded successfully!'
      newReportName.value = ''
      uploadFileName.value = ''
      uploadFileData.value = ''
      fetchPatientReports(activePatient.value.userId)
      setTimeout(() => { reportSuccess.value = '' }, 3000)
    }
  } catch (err) {
    console.error('Upload failed:', err)
  } finally {
    reportUploading.value = false
  }
}

const selectPatient = (i) => {
  activeIndex.value = i
  aiSummary.value = ''
  if (patients.value[i]?.userId) {
    fetchPatientHistory(patients.value[i].userId)
    fetchPatientReports(patients.value[i].userId)
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
          fetchPatientReports(patients.value[0].userId)
        }
      }
    }
  } catch (err) {
    console.error('Failed to load appointments:', err)
  }
}

const completeVisit = async () => {
  const pt = activePatient.value
  if (!pt) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/appointments/${pt.id}/complete`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      pt.completed = true
      // Auto-advance to next uncompleted patient
      const nextIdx = patients.value.findIndex((p, i) => i > activeIndex.value && !p.completed)
      if (nextIdx !== -1) {
        selectPatient(nextIdx)
      }
    }
  } catch (err) {
    console.error('Failed to complete visit:', err)
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
