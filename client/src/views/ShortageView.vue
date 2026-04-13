<template>
  <div class="space-y-10 pb-10">
    <!-- Header -->
    <div class="space-y-3">
      <h1 class="heading-1">Healthcare Access Map</h1>
      <p class="subtext text-lg">Identifying areas with physician shortages</p>
    </div>

    <!-- Shortage Alert Banner -->
    <div v-if="shortageCount > 0" class="card bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-900/5 border border-red-200 dark:border-red-800/30 p-8 shadow-premium">
      <div class="flex items-start gap-6">
        <div class="text-5xl shrink-0">⚠️</div>
        <div class="flex-1">
          <h3 class="heading-3 text-red-700 dark:text-red-400 mb-2">{{ shortageCount }} Area<span v-if="shortageCount !== 1">s</span> Experiencing Shortages</h3>
          <p class="text-red-600 dark:text-red-400 mb-3 leading-relaxed">Patients in these regions face limited access to healthcare services. We're showing nearest alternatives to connect them with available doctors.</p>
          <div class="flex flex-wrap gap-3">
            <span class="badge-danger">Limited doctors available</span>
            <span class="badge-warning">Priority area for expansion</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Area Grid -->
    <div class="space-y-4">
      <h2 class="heading-4 text-slate-600 dark:text-slate-400 uppercase tracking-widest">{{ store.areas.length }} Regions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 blur-in">
        <div v-for="area in store.areas" :key="area.id" class="card-premium p-8 relative overflow-hidden group hover:shadow-hover transition-all duration-300">
          <!-- Background Decoration -->
          <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" :class="getStatusColor(area.doctor_count, area.shortage)"></div>
          
          <!-- Content -->
          <div class="relative z-10">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 mb-6">
              <div>
                <h3 class="heading-4">{{ area.name }}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">{{ area.doctor_count }} licensed physician<span v-if="area.doctor_count !== 1">s</span></p>
              </div>
              <span :class="['badge shrink-0 font-bold', getStatusClasses(area.doctor_count, area.shortage)]">
                {{ getStatusText(area.doctor_count, area.shortage) }}
              </span>
            </div>

            <!-- Doctor Count -->
            <div class="flex items-end gap-3 mb-8 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
              <span class="text-5xl font-bold leading-none bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">{{ area.doctor_count }}</span>
              <span class="text-slate-500 dark:text-slate-400 mb-2 font-medium">registered</span>
            </div>

            <!-- Divider -->
            <div class="border-t border-slate-200/50 dark:border-slate-700/50 pt-6 mt-6">
              <!-- Shortage Info or Status -->
              <div v-if="area.shortage === 1">
                <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-4">Nearest Alternatives</h4>
                <div class="space-y-2">
                  <TransitionGroup name="list">
                    <div v-for="doc in store.doctors.filter(d => d.available && d.area_name !== area.name).slice(0, 2)" :key="doc.id" class="flex items-center justify-between p-3 bg-gradient-light dark:bg-slate-800/50 rounded-lg border border-primary-200/50 dark:border-primary-900/30 hover:shadow-card transition-all duration-200 group/doc">
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-slate-900 dark:text-white truncate">{{ doc.name }}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">📍 {{ doc.area_name }}</p>
                      </div>
                      <router-link :to="`/book?doctor=${doc.id}`" class="btn-primary !px-4 !py-2 !text-xs ml-2 shrink-0 opacity-0 group-hover/doc:opacity-100 transition-opacity">Book</router-link>
                    </div>
                  </TransitionGroup>
                </div>
              </div>

              <!-- Good Coverage Status -->
              <div v-else class="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                <span class="font-medium text-emerald-700 dark:text-emerald-400">Good healthcare coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="card p-6 bg-gradient-light dark:bg-slate-800/50">
      <h3 class="heading-4 mb-4 text-slate-700 dark:text-slate-300">Legend</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 rounded-full bg-red-500"></div>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">No doctors (0)</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 rounded-full bg-amber-500"></div>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Limited (1-2)</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Good coverage (3+)</span>
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
  return 'bg-emerald-500'
}

const getStatusClasses = (count, shortage) => {
  if (shortage === 1 || count === 0) return 'badge-danger'
  if (count <= 2) return 'badge-warning'
  return 'badge-success'
}

const getStatusText = (count, shortage) => {
  if (shortage === 1 || count === 0) return 'No Doctors'
  if (count <= 2) return 'Limited'
  return 'Good Coverage'
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
