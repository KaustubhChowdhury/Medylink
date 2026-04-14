<template>
  <div>
    <!-- Full Screen Preview -->
    <div v-if="selectedFile" class="fixed inset-0 z-[100] bg-brand-dark/95 flex flex-col items-center justify-center p-4 anim-fade-in backdrop-blur-md">
      <div class="w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl relative">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-serif font-bold text-brand-dark text-xl">Credential Verification: {{ viewingDoc.name }}</h3>
          <button @click="selectedFile = null" class="w-10 h-10 rounded-full bg-cream flex items-center justify-center hover:bg-brand-pale transition-colors">
            <XMarkIcon class="w-6 h-6 text-brand-dark" />
          </button>
        </div>
        
        <div class="bg-brand-cream rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center border-2 border-brand-pale/20">
          <template v-if="selectedFile.startsWith('data:application/pdf')">
            <embed :src="selectedFile" type="application/pdf" class="w-full h-[600px]" />
          </template>
          <template v-else>
            <img :src="selectedFile" class="max-w-full max-h-[70vh] object-contain shadow-glass rounded-lg" />
          </template>
        </div>
        
        <div class="mt-6 flex justify-end gap-3">
          <span class="text-xs text-text-mid flex-1 flex items-center gap-2">
            <ShieldCheckIcon class="w-4 h-4 text-brand-green" />
            Verify the authenticity of this document before approving the practitioner.
          </span>
          <Button variant="success" @click="handleApproval(viewingDoc.id, true); selectedFile = null">
            Approve Now
          </Button>
        </div>
      </div>
    </div>

    <!-- Artistic Header -->
    <div class="relative mb-10">
      <div class="absolute -top-8 -left-8 w-40 h-40 bg-gray-200/20 rounded-full blur-3xl"></div>
      <div class="absolute top-0 right-1/4 w-32 h-32 bg-brand-dark/5 rounded-full blur-2xl"></div>
      <div class="relative">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.2em] mb-2 anim-fade-up">Admin Command Center</p>
        <h1 class="text-4xl font-serif font-bold text-brand-dark mb-1 anim-fade-up anim-delay-1">System Overview</h1>
        <p class="text-text-mid text-sm anim-fade-up anim-delay-2">Monitor network health and manage personnel</p>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card class="!p-5 bg-gradient-to-br from-brand-dark to-brand-mid !border-0 text-white anim-fade-up">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <UserGroupIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">{{ stats.totalPatients }}</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">Total Patients</p>
          </div>
        </div>
      </Card>
      
      <Card class="!p-5 bg-gradient-to-br from-brand-green to-brand-light !border-0 text-brand-dark anim-fade-up anim-delay-1">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center">
            <ShieldCheckIcon class="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">{{ stats.totalDoctors }}</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">Active Doctors</p>
          </div>
        </div>
      </Card>

      <Card class="!p-5 bg-gradient-to-br from-warn to-yellow-400 !border-0 text-white anim-fade-up anim-delay-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ClockIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">{{ stats.pendingApprovals }}</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">Pending Approvals</p>
          </div>
        </div>
      </Card>

      <Card class="!p-5 bg-gradient-to-br from-gray-700 to-gray-600 !border-0 text-white anim-fade-up anim-delay-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-icon icon-pulse">
            <ServerIcon class="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">{{ stats.systemHealth }}</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">System Health</p>
          </div>
        </div>
      </Card>
    </div>

    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-brand-dark">Doctor Registrations</h2>
      <router-link to="/admin/doctors" class="text-xs font-bold text-brand-green hover:underline">View All Network</router-link>
    </div>

    <!-- Doctor Approvals List -->
    <div class="space-y-3">
      <Card v-for="(doc, i) in doctors" :key="doc.id" class="!p-4 anim-fade-up" :class="`anim-delay-${(i % 3) + 1}`">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center font-bold text-brand-dark shadow-sm uppercase">
              {{ (doc.name || 'D').split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ doc.name }}</h4>
              <p class="text-xs text-text-mid">{{ doc.specialty || 'General Physician' }} · ID: {{ doc.medical_id || doc.id }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button v-if="doc.medical_id_file" @click="viewId(doc)" class="text-[10px] font-bold text-brand-green hover:underline mr-4">View ID Attachment</button>
            <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border bg-warn/10 text-warn border-warn/20"
              v-if="!doc.approved">Pending</span>
            <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border bg-brand-green/10 text-brand-green border-brand-green/20"
              v-else>Approved</span>
            
            <template v-if="!doc.approved">
              <div class="flex gap-2">
                <button @click="handleApproval(doc.id, true)" class="p-1.5 rounded-lg bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white transition-colors">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="handleApproval(doc.id, false)" class="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </Card>
      <div v-if="!doctors.length && !loading" class="text-center py-10 text-text-mid text-sm">
        No pending registrations
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { UserGroupIcon, ShieldCheckIcon, ClockIcon, ServerIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const doctors = ref([])
const stats = ref({
  totalPatients: 0,
  totalDoctors: 0,
  pendingApprovals: 0,
  systemHealth: 'Loading...'
})
const loading = ref(true)
const selectedFile = ref(null)
const viewingDoc = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}` }
    
    // Fetch Stats
    const statsRes = await fetch('http://localhost:3001/admin/stats', { headers })
    if (statsRes.ok) {
      stats.value = await statsRes.json()
    }

    // Fetch Pending Doctors
    const doctorsRes = await fetch('http://localhost:3001/admin/pending-doctors', { headers })
    if (doctorsRes.ok) {
      doctors.value = await doctorsRes.json()
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
  } finally {
    loading.value = false
  }
}

const viewId = (doc) => {
  viewingDoc.value = doc
  selectedFile.value = doc.medical_id_file
}

const handleApproval = async (id, isApproved) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/admin/approve-doctor/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ approved: isApproved })
    })
    if (res.ok) {
      // Refresh both stats and list
      fetchData()
    }
  } catch (err) {
    console.error('Approval failed:', err)
  }
}

onMounted(() => {
  fetchData()
})
</script>
