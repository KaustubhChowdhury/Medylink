<template>
  <div class="space-y-8 pb-10">
    <!-- Header -->
    <div class="space-y-6">
      <div>
        <h1 class="heading-1">Discover Specialists</h1>
        <p class="subtext mt-2 text-lg">Book appointments or compare doctors in your area</p>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-300/20 to-accent-300/20 rounded-2xl blur-2xl -z-10"></div>
        <div class="relative flex items-center">
          <svg class="w-6 h-6 absolute left-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search by doctor name or specialty..." 
            class="input w-full text-lg py-5 pl-14 pr-6 shadow-premium"
          />
        </div>
      </div>
    </div>

    <!-- Filters ---->
    <div class="card bg-gradient-light dark:bg-slate-800/50 p-6 sticky top-20 z-40 shadow-premium">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Area Filter -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Area</label>
          <select v-model="filters.area" class="input w-full text-sm py-2">
            <option value="">All Areas</option>
            <option v-for="a in store.areas" :key="a.id" :value="a.name">{{ a.name }}</option>
          </select>
        </div>

        <!-- Specialty Filter -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Specialty</label>
          <select v-model="filters.specialty" class="input w-full text-sm py-2">
            <option value="">All Specialties</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gynecologist">Gynecologist</option>
          </select>
        </div>

        <!-- Price Filter -->
        <div class="space-y-3">
          <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block flex items-center justify-between">
            <span>Max Price</span>
            <span class="badge-primary">₹{{ filters.maxPrice || 'Any' }}</span>
          </label>
          <input type="range" v-model="filters.maxPrice" min="100" max="2000" step="100" class="w-full cursor-pointer accent-primary-600" />
        </div>

        <!-- Availability Filter -->
        <div class="space-y-2 flex flex-col justify-end">
          <label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
            <input type="checkbox" v-model="filters.availableOnly" class="rounded-md w-5 h-5 accent-primary-600 cursor-pointer" />
            <span class="font-semibold text-slate-900 dark:text-slate-200">Available only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="filteredDoctors.length > 0" class="space-y-4">
      <p class="subtext-sm font-semibold">{{ filteredDoctors.length }} doctor<span v-if="filteredDoctors.length !== 1">s</span> found</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 blur-in">
        <DoctorCard v-for="doc in filteredDoctors" :key="doc.id" :doctor="doc" />
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="card text-center py-16 border-dashed">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="heading-3 mb-2">No doctors found</h3>
      <p class="subtext max-w-sm mx-auto mb-6">Try adjusting your filters or visit the shortage map to find alternatives in other areas.</p>
      <div class="flex gap-3 justify-center flex-wrap">
        <button @click="resetFilters" class="btn-outline px-6 py-2.5">Reset Filters</button>
        <router-link to="/shortage" class="btn-primary px-6 py-2.5">View Shortage Map</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import DoctorCard from '../components/DoctorCard.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')

const filters = reactive({
  area: '',
  specialty: '',
  maxPrice: '',
  availableOnly: false
})

const resetFilters = () => {
  filters.area = ''
  filters.specialty = ''
  filters.maxPrice = ''
  filters.availableOnly = false
  searchQuery.value = ''
}

watch(filters, () => {
  store.fetchDoctors(filters)
}, { deep: true })

const filteredDoctors = computed(() => {
  if (!searchQuery.value) return store.doctors
  const q = searchQuery.value.toLowerCase()
  return store.doctors.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.specialty.toLowerCase().includes(q)
  )
})

onMounted(() => {
  store.fetchAreas()
  store.fetchDoctors(filters)
})
</script>
