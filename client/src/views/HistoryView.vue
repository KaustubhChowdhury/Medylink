<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Medical History</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Your personal health records timeline.</p>
      </div>
      <button @click="showAdd = true" class="btn-primary" v-if="!showAdd">+ Add Record</button>
    </header>

    <div v-if="showAdd" class="med-card bg-slate-50 dark:bg-slate-800/50">
      <h3 class="font-semibold mb-4 text-lg">New Record</h3>
      <form @submit.prevent="submitRecord" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input type="text" v-model="newRecord.title" class="input w-full" placeholder="e.g. Annual Checkup" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input type="date" v-model="newRecord.date" class="input w-full" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Condition</label>
          <input type="text" v-model="newRecord.condition" class="input w-full" placeholder="e.g. Hypertension (Optional)" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Notes / Record Details</label>
          <textarea v-model="newRecord.record" class="input w-full min-h-[100px]" required></textarea>
        </div>
        <div class="flex gap-2 justify-end mt-2">
          <button type="button" @click="showAdd = false" class="btn-ghost">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="loading">Save Record</button>
        </div>
      </form>
    </div>

    <div class="relative pl-6 mt-8">
      <div class="absolute top-0 bottom-0 left-[11px] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
      
      <div v-if="store.history.length === 0" class="text-slate-500 py-4">No medical records found.</div>
      
      <div v-for="(record, index) in store.history" :key="record.id" class="relative mb-8 last:mb-0">
        <div class="absolute -left-6 w-5 h-5 rounded-full bg-blue-100 border-4 border-slate-50 dark:bg-blue-900 dark:border-slate-900 dark:ring-slate-900 flex items-center justify-center mt-0.5">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
        </div>
        <div class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 ml-2">{{ record.date }}</div>
        <div class="med-card ml-2">
          <div class="flex items-start justify-between mb-3 gap-2">
            <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">{{ record.title }}</h3>
            <span v-if="record.condition && record.condition !== 'None'" class="badge bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800">{{ record.condition }}</span>
          </div>
          <p class="text-slate-600 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{{ record.record }}</p>
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
