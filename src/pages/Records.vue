<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-4 -left-6 w-28 h-28 bg-brand-light/15 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">My Reports</h1>
      <p class="text-text-mid text-sm relative">Upload and view medical documents</p>
    </div>

    <Card class="!p-5 mb-6 anim-fade-up">
      <label class="flex items-center justify-center gap-4 cursor-pointer py-8 border-2 border-dashed border-brand-pale rounded-2xl hover:border-brand-green transition-colors bg-cream/40">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center shadow-icon icon-float">
          <ArrowUpTrayIcon class="w-7 h-7 text-white" />
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark">Click to upload</p>
          <p class="text-xs text-text-light">PDF or Image files</p>
        </div>
        <input type="file" class="hidden" @change="handleUpload" accept="image/*,.pdf" />
      </label>
    </Card>

    <div class="space-y-3">
      <Card v-for="(report, i) in reports" :key="i" class="!p-4 anim-fade-up" :class="`anim-delay-${i+1}`">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold shadow-icon"
              :class="report.type === 'PDF' ? 'bg-gradient-to-br from-danger to-red-400 text-white' : 'bg-gradient-to-br from-brand-green to-brand-mid text-white'">
              {{ report.type }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ report.name }}</h4>
              <p class="text-xs text-text-mid">Uploaded: {{ report.date }}</p>
            </div>
          </div>
          <Button variant="secondary" class="!text-xs !px-4 !py-2" @click="viewFile(report)">View</Button>
        </div>
      </Card>
    </div>

    <div v-if="viewing" class="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="viewing = null">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto shadow-card-hover anim-fade-up">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-brand-dark">{{ viewing.name }}</h3>
          <button @click="viewing = null" class="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-text-mid hover:bg-cream-dark text-lg">&times;</button>
        </div>
        <div v-if="viewing.url" class="rounded-2xl overflow-hidden border border-brand-pale/30">
          <img v-if="viewing.type === 'Image'" :src="viewing.url" class="w-full" />
          <div v-else class="p-8 text-center text-text-mid text-sm">PDF preview not available. <a :href="viewing.url" target="_blank" class="text-brand-green underline">Open file</a></div>
        </div>
        <div v-else class="p-8 text-center text-text-mid text-sm">No preview available</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
const viewing = ref(null)
const reports = ref([
  { name: 'Complete Blood Count (CBC)', type: 'PDF', date: 'Oct 14, 2025', url: '' },
  { name: 'MRI Spinal Cluster', type: 'Image', date: 'Sep 28, 2025', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80' },
  { name: 'Neurological Assessment Notes', type: 'PDF', date: 'Aug 10, 2025', url: '' },
])
const handleUpload = (e) => {
  const file = e.target.files[0]; if (!file) return
  reports.value.unshift({ name: file.name, type: file.type.startsWith('image') ? 'Image' : 'PDF', date: 'Just now', url: URL.createObjectURL(file) })
}
const viewFile = (r) => { viewing.value = r }
</script>
