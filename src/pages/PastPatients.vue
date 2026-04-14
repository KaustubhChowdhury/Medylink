<template>
  <div class="relative min-h-[600px]">
    <div class="relative mb-10">
      <div class="absolute -top-6 -left-4 w-32 h-32 bg-brand-pale/20 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Past Patients</h1>
      <p class="text-text-mid text-sm relative">Detailed consultation history and reporting</p>
    </div>

    <!-- Patient Selection List -->
    <div class="space-y-3" v-if="pastPatients.length && !selectedPatient">
      <Card v-for="pt in pastPatients" :key="pt.id" 
        class="!p-4 cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all group border-brand-pale/10 hover:border-brand-mid/30"
        @click="selectPatient(pt)">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center font-serif font-bold text-lg shadow-icon uppercase group-hover:scale-105 transition-transform">
              {{ (pt.name || 'P').split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark group-hover:text-brand-mid transition-colors">{{ pt.name }}</h4>
              <p class="text-[10px] text-text-mid uppercase font-bold tracking-wider">Last Visit: {{ pt.lastVisit }}</p>
            </div>
          </div>
          <div class="text-right">
             <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-cream rounded-lg text-[10px] font-bold text-brand-dark uppercase tracking-wider">
               View Records →
             </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Patient Detailed History Panel -->
    <div v-if="selectedPatient" class="anim-fade-up">
      <button @click="selectedPatient = null" class="text-xs font-bold text-brand-mid hover:underline mb-6 flex items-center gap-1">
        ← Back to Patient List
      </button>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- History List -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-serif font-bold text-brand-dark">Clinical Records: {{ selectedPatient.name }}</h2>
            <p class="text-[10px] font-bold text-text-light uppercase tracking-widest">{{ history.length }} Records Found</p>
          </div>

          <div class="space-y-4" v-if="history.length">
            <Card v-for="(rec, i) in history" :key="rec.id" class="!p-5 border-l-4 border-l-brand-mid anim-fade-up" :class="`anim-delay-${i+1}`">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-bold text-brand-dark">{{ rec.title }}</h4>
                  <p class="text-[10px] text-text-mid uppercase font-bold">{{ rec.date }}</p>
                </div>
                <div v-if="rec.condition" class="px-2 py-0.5 bg-brand-pale text-brand-dark rounded text-[9px] font-bold uppercase whitespace-nowrap">
                  {{ rec.condition }}
                </div>
              </div>
              <p class="text-xs text-text-mid leading-relaxed italic bg-cream/30 p-3 rounded-lg border border-brand-pale/20">{{ rec.record }}</p>
            </Card>
          </div>
          <div v-else class="text-center py-16 bg-cream/20 rounded-3xl border-2 border-dashed border-brand-pale/30">
            <p class="text-text-mid text-sm italic">No medical history available for this patient.</p>
          </div>
        </div>

        <!-- Add New Record Form -->
        <div class="lg:w-80">
          <Card class="!p-6 !border-brand-mid/20 shadow-xl bg-white sticky top-20">
            <h3 class="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
              <PlusCircleIcon class="w-5 h-5 text-brand-mid" />
              Add Consultation Report
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-bold text-text-mid uppercase mb-1.5">Consultation Title</label>
                <input v-model="newRecord.title" type="text" placeholder="e.g. Routine Checkup"
                  class="w-full bg-cream border border-brand-pale/30 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-mid transition-all" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-text-mid uppercase mb-1.5">Diagnosis / Condition</label>
                <input v-model="newRecord.condition" type="text" placeholder="e.g. Hypertension"
                  class="w-full bg-cream border border-brand-pale/30 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-mid transition-all" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-text-mid uppercase mb-1.5">Clinical Notes</label>
                <textarea v-model="newRecord.record" rows="4" placeholder="Enter patient observations and prescriptions..."
                  class="w-full bg-cream border border-brand-pale/30 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-mid transition-all resize-none"></textarea>
              </div>
              <Button variant="doctor" block :loading="saving" @click="saveNewRecord">
                Submit Record →
              </Button>
            </div>
            <p v-if="successMsg" class="text-[10px] text-brand-mid text-center mt-3 font-bold animate-bounce">{{ successMsg }}</p>
          </Card>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !pastPatients.length" class="text-center py-20">
      <div class="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
        <UsersIcon class="w-8 h-8 text-text-light" />
      </div>
      <p class="text-text-mid text-sm italic">No past consultations found in the network</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { PlusCircleIcon, UsersIcon } from '@heroicons/vue/24/outline'

const pastPatients = ref([])
const history = ref([])
const loading = ref(true)
const saving = ref(false)
const selectedPatient = ref(null)
const successMsg = ref('')

const newRecord = reactive({
  title: '',
  condition: '',
  record: '',
  date: new Date().toISOString().split('T')[0]
})

const fetchPastPatients = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/doctor/past-patients', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      pastPatients.value = data.map(p => ({
        id: p.id,
        user_id: p.id,  // u.id from query IS the user_id
        name: p.name,
        lastVisit: new Date(p.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        email: p.email
      }))
    }
  } catch (err) {
    console.error('Failed to fetch past patients:', err)
  } finally {
    loading.value = false
  }
}

const selectPatient = async (pt) => {
  selectedPatient.value = pt
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/doctor/patient-history/${pt.user_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      history.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch patient history:', err)
  } finally {
    loading.value = false
  }
}

const saveNewRecord = async () => {
  if (!newRecord.title || !newRecord.record) return
  saving.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/doctor/add-patient-record', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_user_id: selectedPatient.value.user_id,
        ...newRecord
      })
    })
    if (res.ok) {
      successMsg.value = 'Record successfully uploaded!'
      // Reset form
      newRecord.title = ''
      newRecord.condition = ''
      newRecord.record = ''
      
      // Refresh history
      selectPatient(selectedPatient.value)
      
      setTimeout(() => { successMsg.value = '' }, 3000)
    }
  } catch (err) {
    console.error('Failed to save record:', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchPastPatients()
})
</script>
