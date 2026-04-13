<template>
  <div class="space-y-8 pb-10 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="heading-1">Medical History</h1>
        <p class="subtext mt-2 text-lg">Your personal health records timeline</p>
      </div>
      <button v-if="!showAdd" @click="showAdd = true" class="btn-primary shrink-0 px-6 py-3">+ Add Record</button>
    </div>

    <!-- Add Record Form -->
    <div v-if="showAdd" class="card-premium p-8 border-l-4 border-l-accent-500">
      <h3 class="heading-4 mb-6">Add New Record</h3>
      <form @submit.prevent="submitRecord" class="space-y-4">
        <!-- Row 1: Title & Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Title</label>
            <input type="text" v-model="newRecord.title" class="input w-full" placeholder="e.g., Annual Checkup" required />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Date</label>
            <input type="date" v-model="newRecord.date" class="input w-full" required />
          </div>
        </div>

        <!-- Row 2: Condition -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Condition (Optional)</label>
          <input type="text" v-model="newRecord.condition" class="input w-full" placeholder="e.g., Hypertension" />
        </div>

        <!-- Row 3: Notes -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Notes / Details</label>
          <textarea v-model="newRecord.record" class="input w-full min-h-[120px] resize-none" placeholder="Write your medical notes..." required></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-end pt-2">
          <button type="button" @click="showAdd = false" class="btn-outline px-6 py-2.5">Cancel</button>
          <button type="submit" class="btn-primary px-6 py-2.5" :disabled="loading">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg>
              Saving...
            </span>
            <span v-else>Save Record</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Timeline -->
    <div class="relative pl-8 space-y-4 blur-in">
      <!-- Timeline Line -->
      <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 via-accent-400 to-transparent"></div>

      <!-- Empty State -->
      <div v-if="store.history.length === 0" class="text-center py-16 text-slate-500 dark:text-slate-400">
        <div class="text-5xl mb-4">📋</div>
        <p class="subtext text-lg">No medical records yet</p>
      </div>

      <!-- Timeline Items -->
      <div v-for="(record, index) in store.history" :key="record.id" class="timeline-item">
        <div class="card-premium p-6 hover:shadow-hover transition-all duration-300">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2">{{ formatDate(record.date) }}</p>
              <h4 class="heading-4">{{ record.title }}</h4>
            </div>
            <span v-if="record.condition && record.condition !== 'None'" class="badge-warning shrink-0">
              {{ record.condition }}
            </span>
          </div>
          
          <p class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{{ record.record }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { store } from '../store'
import { api } from '../api'

const showAdd = ref(false)
const loading = ref(false)

const newRecord = reactive({
  title: '',
  date: new Date().toISOString().split('T')[0],
  condition: '',
  record: ''
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  store.fetchHistory()
})

const submitRecord = async () => {
  loading.value = true
  try {
    await api.history.add({ ...newRecord })
    await store.fetchHistory()
    showAdd.value = false
    newRecord.title = ''
    newRecord.condition = ''
    newRecord.record = ''
    newRecord.date = new Date().toISOString().split('T')[0]
  } catch (e) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>
