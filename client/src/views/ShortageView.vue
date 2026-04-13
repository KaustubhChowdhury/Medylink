<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <header>
      <h1 class="text-3xl font-semibold tracking-tight">Areas with limited healthcare access</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Identifying and addressing physician shortages across regions.</p>
    </header>

    <div v-if="shortageCount > 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 md:p-6 text-red-800 dark:text-red-300 flex items-start gap-4">
      <div class="text-2xl mt-1">⚠️</div>
      <div>
        <h3 class="font-bold text-lg mb-1">{{ shortageCount }} area<span v-if="shortageCount !== 1">s</span> currently experience severe doctor shortages.</h3>
        <p>Patients in these areas may face long wait times. Showing nearest available alternatives automatically in search.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="area in store.areas" :key="area.id" class="med-card relative overflow-hidden flex flex-col justify-between h-full">
        <div class="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full opacity-10 dark:opacity-20 pointer-events-none" :class="getStatusColor(area.doctor_count, area.shortage)"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-xl">{{ area.name }}</h3>
            <span :class="['badge border px-3 py-1', getStatusClasses(area.doctor_count, area.shortage)]">
              {{ getStatusText(area.doctor_count, area.shortage) }}
            </span>
          </div>
          
          <div class="flex items-end gap-2 my-8">
            <span class="text-5xl font-bold tracking-tighter leading-none">{{ area.doctor_count }}</span>
            <span class="text-slate-500 dark:text-slate-400 mb-1 font-medium">registered doctor<span v-if="area.doctor_count !== 1">s</span></span>
          </div>
        </div>

        <div class="border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
          <div v-if="area.shortage === 1">
            <h4 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Nearest Alternatives</h4>
            <div class="space-y-2">
              <div v-for="doc in store.doctors.filter(d => d.available && d.area_name !== area.name).slice(0, 2)" :key="doc.id" class="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <div>
                  <div class="font-medium truncate max-w-[140px]">{{ doc.name }}</div>
                  <div class="text-xs text-slate-500 mt-0.5">{{ doc.area_name }}</div>
                </div>
                <router-link :to="`/book?doctor=${doc.id}`" class="text-blue-600 dark:text-blue-400 font-medium hover:underline shrink-0 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md">Book</router-link>
              </div>
            </div>
          </div>
          <div v-else class="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 py-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Adequate coverage
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { store } from '../store'

onMounted(() => {
  store.fetchAreas()
  if (store.doctors.length === 0) store.fetchDoctors()
})

const shortageCount = computed(() => store.areas.filter(a => a.shortage === 1).length)

const getStatusColor = (count, shortage) => {
  if (shortage === 1 || count === 0) return 'bg-red-500'
  if (count <= 2) return 'bg-amber-500'
  return 'bg-green-500'
}

const getStatusClasses = (count, shortage) => {
  if (shortage === 1 || count === 0) return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800'
  if (count <= 2) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800'
  return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-800'
}

const getStatusText = (count, shortage) => {
  if (shortage === 1 || count === 0) return 'No doctors'
  if (count <= 2) return 'Limited'
  return 'Good coverage'
}
</script>
