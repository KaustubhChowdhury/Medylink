<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-4xl font-serif tracking-tight">Our specialists</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Discover and book appointments with top doctors.</p>
      </div>
      
      <div class="relative w-full md:w-72">
         <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search..." 
          class="input w-full pl-10"
        />
        <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </header>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-end sticky top-20 z-40">
      <div class="w-full md:w-1/4">
        <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Area</label>
        <select v-model="filters.area" class="input w-full text-sm py-2">
          <option value="">All Areas</option>
          <option v-for="a in store.areas" :key="a.id" :value="a.name">{{ a.name }}</option>
        </select>
      </div>
      <div class="w-full md:w-1/4">
        <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Specialty</label>
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
      <div class="w-full md:w-1/4">
        <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Max Price: ₹{{ filters.maxPrice || 'Any' }}</label>
        <input type="range" v-model="filters.maxPrice" min="100" max="2000" step="100" class="w-full mt-2 cursor-pointer" />
      </div>
      <div class="w-full md:w-auto flex items-center mb-2 md:mb-0 gap-2">
        <input type="checkbox" id="avail" v-model="filters.availableOnly" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
        <label for="avail" class="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Available only</label>
      </div>
    </div>

    <!-- Grid -->
    <div v-if="filteredDoctors.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
      <DoctorCard v-for="doc in filteredDoctors" :key="doc.id" :doctor="doc" />
    </div>
    
    <div v-else class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
      <div class="text-4xl mb-4">🔍</div>
      <h3 class="text-lg font-semibold">No doctors found</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto">Try adjusting your filters or search query to find more doctors in this area.</p>
      <router-link to="/shortage" class="btn-ghost mt-6">View Shortage Map</router-link>
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
