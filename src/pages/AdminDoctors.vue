<template>
  <div class="p-6">
    <div class="relative mb-10 text-left">
      <div class="absolute -top-6 -left-4 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Medical Network</h1>
      <p class="text-text-mid text-sm relative">Manage all registered practitioners</p>
    </div>

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
          <Button variant="success" @click="toggleApproval(viewingDoc); selectedFile = null" v-if="!viewingDoc.approved">
            Approve Now
          </Button>
        </div>
      </div>
    </div>

    <Card class="mb-8">
      <div class="flex items-center gap-4 px-4 py-3 bg-cream/50 rounded-xl border border-brand-pale/20">
        <MagnifyingGlassIcon class="w-5 h-5 text-text-light" />
        <input v-model="search" type="text" placeholder="Search by name or specialty..." 
          class="bg-transparent border-none focus:outline-none text-sm text-brand-dark w-full" />
      </div>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="(doc, i) in filteredDoctors" :key="doc.id" class="!p-6 anim-fade-up overflow-hidden group" :class="`anim-delay-${(i % 5) + 1}`">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center font-serif font-bold text-xl shadow-icon uppercase transition-transform group-hover:scale-105">
            {{ (doc.name || 'D').split(' ').map(n => n[0]).join('') }}
          </div>
          <div>
            <h3 class="font-bold text-brand-dark">{{ doc.name }}</h3>
            <p class="text-xs text-text-mid">{{ doc.specialty }}</p>
            <div class="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider"
              :class="doc.approved ? 'bg-brand-green/10 text-brand-green' : 'bg-warn/10 text-warn'">
              {{ doc.approved ? 'Verified' : 'Pending Verification' }}
            </div>
          </div>
        </div>

        <div class="space-y-3 pt-4 border-t border-brand-pale/20">
          <div class="flex justify-between items-center text-xs">
            <span class="text-text-mid">Consultation Fee</span>
            <span class="font-bold text-brand-dark">₹{{ doc.price }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-text-mid">Medical ID</span>
            <span class="font-mono font-bold text-brand-dark">{{ doc.medical_id || 'N/A' }}</span>
          </div>
          <div v-if="doc.medical_id_file" class="pt-2">
            <button @click="viewId(doc)"
              class="w-full py-2 bg-cream hover:bg-brand-pale/20 text-brand-dark text-[10px] font-bold rounded-xl transition-all border border-brand-pale/30">
              View Document Attached
            </button>
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <Button variant="patient" class="flex-1 !py-2.5 !text-xs" @click="toggleApproval(doc)">
            {{ doc.approved ? 'Deactivate' : 'Approve' }}
          </Button>
          <Button variant="danger" class="flex-1 !py-2.5 !text-xs" @click="removeDoctor(doc.id)">
            Remove
          </Button>
        </div>
      </Card>
    </div>

    <div v-if="!filteredDoctors.length && !loading" class="text-center py-20">
      <p class="text-text-mid text-sm">No doctors found in the network</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { MagnifyingGlassIcon, TrashIcon, XMarkIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const doctors = ref([])
const loading = ref(true)
const search = ref('')
const selectedFile = ref(null)
const viewingDoc = ref(null)

const fetchAllDoctors = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/doctors?approved=all', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (res.ok) {
      const data = await res.json()
      doctors.value = Array.isArray(data) ? data : []
    }
  } catch (err) {
    console.error('Network error fetching doctors:', err)
  } finally {
    loading.value = false
  }
}

const filteredDoctors = computed(() => {
  if (!doctors.value) return []
  if (!search.value) return doctors.value
  
  const s = search.value.toLowerCase()
  return doctors.value.filter(d => {
    const name = (d.name || '').toLowerCase()
    const specialty = (d.specialty || '').toLowerCase()
    return name.includes(s) || specialty.includes(s)
  })
})

const viewId = (doc) => {
  viewingDoc.value = doc
  selectedFile.value = doc.medical_id_file
}

const toggleApproval = async (doc) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/admin/approve-doctor/${doc.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ approved: !doc.approved })
    })
    if (res.ok) {
      fetchAllDoctors()
    }
  } catch (err) {
    console.error('Toggle failed:', err)
  }
}

const removeDoctor = async (id) => {
  if (!confirm('Are you sure you want to remove this doctor from the network?')) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/admin/doctors/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      fetchAllDoctors()
    }
  } catch (err) {
    console.error('Remove failed:', err)
  }
}

onMounted(() => {
  fetchAllDoctors()
})
</script>
