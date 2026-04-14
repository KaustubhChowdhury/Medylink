<template>
  <div>
    <div class="relative mb-10">
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">My Reports</h1>
      <p class="text-text-mid text-sm relative">Upload and view medical documents</p>
    </div>

    <Card class="!p-5 mb-6 anim-fade-up">
      <label class="flex items-center justify-center gap-4 cursor-pointer py-8 border-2 border-dashed border-brand-pale rounded-2xl hover:border-brand-green transition-colors bg-cream/40">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center shadow-icon transition-transform hover:scale-105">
          <ArrowUpTrayIcon class="w-7 h-7 text-white" />
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark">{{ uploading ? 'Uploading...' : 'Click to upload' }}</p>
          <p class="text-xs text-text-light">PDF or Image files</p>
        </div>
        <input type="file" class="hidden" @change="handleUpload" accept="image/*,.pdf" :disabled="uploading" />
      </label>
    </Card>

    <div class="space-y-3">
      <Card v-for="(report, i) in reports" :key="report.id || i" class="!p-4 anim-fade-up" :class="`anim-delay-${(i % 5) + 1}`">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold shadow-icon"
              :class="report.type === 'PDF' ? 'bg-gradient-to-br from-danger to-red-400 text-white' : 'bg-gradient-to-br from-brand-green to-brand-mid text-white'">
              {{ report.type }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ report.name }}</h4>
              <p class="text-xs text-text-mid">Uploaded: {{ report.date }}</p>
              <p v-if="report.uploader_name" class="text-[9px] text-brand-mid font-bold">by {{ report.uploader_name }}</p>
            </div>
          </div>
          <Button variant="secondary" class="!text-xs !px-4 !py-2" @click="viewFile(report)">View</Button>
        </div>
      </Card>
    </div>

    <div v-if="!reports.length && !loading" class="text-center py-16 text-text-mid text-sm italic">
      No reports uploaded yet. Upload your first document above.
    </div>

    <!-- Viewer Modal -->
    <div v-if="viewing" class="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="viewing = null">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto shadow-card-hover anim-fade-up">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-brand-dark">{{ viewing.name }}</h3>
          <button @click="viewing = null" class="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-text-mid hover:bg-cream-dark text-lg">&times;</button>
        </div>
        <div v-if="viewing.data" class="rounded-2xl overflow-hidden border border-brand-pale/30">
          <img v-if="viewing.type === 'Image'" :src="viewing.data" class="w-full" />
          <embed v-else-if="viewing.type === 'PDF'" :src="viewing.data" type="application/pdf" class="w-full h-[500px]" />
        </div>
        <div v-else class="p-8 text-center text-text-mid text-sm">No preview available</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'

const viewing = ref(null)
const reports = ref([])
const loading = ref(true)
const uploading = ref(false)

const fetchReports = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/patient-reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      reports.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch reports:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReports()
})

const handleUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true

  const reader = new FileReader()
  reader.onload = async (event) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3001/patient-reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type.startsWith('image') ? 'Image' : 'PDF',
          date: new Date().toISOString().split('T')[0],
          data: event.target.result
        })
      })
      if (res.ok) {
        fetchReports()
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      uploading.value = false
    }
  }
  reader.readAsDataURL(file)
}

const viewFile = (r) => { viewing.value = r }
</script>
