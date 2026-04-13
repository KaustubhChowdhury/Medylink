<template>
  <div class="space-y-8 pb-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="heading-1">Compare Doctors</h1>
        <p class="subtext mt-2 text-lg">Side-by-side comparison to make the best choice</p>
      </div>
      <button v-if="store.compareList.length > 0" @click="clear" class="btn-outline mx-auto md:mx-0 px-8 py-3">Clear List</button>
    </div>

    <!-- Empty State -->
    <div v-if="store.compareList.length === 0" class="card text-center py-20 border-dashed">
      <div class="text-6xl mb-4">⚖️</div>
      <h3 class="heading-3 mb-2">Nothing to compare</h3>
      <p class="subtext max-w-sm mx-auto mb-8">Go to Discovery and click "Compare" on up to 3 doctors.</p>
      <router-link to="/discover" class="btn-primary inline-flex px-8 py-3">Find Doctors</router-link>
    </div>

    <!-- Comparison Table -->
    <div v-else class="space-y-4 blur-in">
      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <div v-for="doc in store.compareList" :key="doc.id" class="card">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="heading-4">{{ doc.name }}</h3>
              <p class="text-primary-600 dark:text-primary-400 font-semibold">{{ doc.specialty }}</p>
            </div>
            <button @click="store.removeFromCompare(doc.id)" class="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500 transition-colors">&times;</button>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-semibold text-slate-600 dark:text-slate-400">Area</span>
              <span class="text-slate-900 dark:text-white">{{ doc.area_name }}</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-semibold text-slate-600 dark:text-slate-400">Price</span>
              <span class="font-bold text-lg font-mono" :class="doc.price === minPrice ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded' : ''">₹{{ doc.price }}</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-semibold text-slate-600 dark:text-slate-400">Availability</span>
              <span v-if="doc.available" class="badge-success">Available</span>
              <span v-else class="badge">Unavailable</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold text-slate-600 dark:text-slate-400">Rating</span>
              <span class="text-amber-500 font-bold">★ 4.8</span>
            </div>
            <router-link v-if="doc.available" :to="`/book?doctor=${doc.id}`" class="btn-primary w-full mt-3">Book Appointment</router-link>
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block card overflow-hidden border-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gradient-light dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                <th class="p-6 font-semibold text-slate-900 dark:text-white w-1/4">Feature</th>
                <th v-for="doc in store.compareList" :key="'h' + doc.id" class="p-6 border-l border-slate-200/50 dark:border-slate-700/50">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 text-white flex items-center justify-center text-sm font-bold mb-3 shadow-lg">
                        {{ doc.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() }}
                      </div>
                      <h4 class="font-serif font-bold text-lg">{{ doc.name }}</h4>
                    </div>
                    <button @click="store.removeFromCompare(doc.id)" class="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500 transition-colors">&times;</button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-6 font-semibold text-slate-900 dark:text-white">Specialty</td>
                <td class="p-6 border-l border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-medium" v-for="doc in store.compareList" :key="'s' + doc.id">{{ doc.specialty }}</td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-6 font-semibold text-slate-900 dark:text-white">Area</td>
                <td class="p-6 border-l border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-medium" v-for="doc in store.compareList" :key="'a' + doc.id">{{ doc.area_name }}</td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-6 font-semibold text-slate-900 dark:text-white">Price</td>
                <td class="p-6 border-l border-slate-200/50 dark:border-slate-700/50" v-for="doc in store.compareList" :key="'p' + doc.id">
                  <span class="text-2xl font-bold font-mono" :class="doc.price === minPrice ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg inline-block' : 'text-slate-900 dark:text-white'">
                    ₹{{ doc.price }}
                  </span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-6 font-semibold text-slate-900 dark:text-white">Availability</td>
                <td class="p-6 border-l border-slate-200/50 dark:border-slate-700/50" v-for="doc in store.compareList" :key="'av' + doc.id">
                  <span v-if="doc.available" class="badge-success">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Available
                  </span>
                  <span v-else class="badge">
                    <span class="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                    Unavailable
                  </span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-6 font-semibold text-slate-900 dark:text-white">Rating</td>
                <td class="p-6 border-l border-slate-200/50 dark:border-slate-700/50 text-amber-500 font-bold" v-for="doc in store.compareList" :key="'r' + doc.id">
                  ★ 4.8
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-6 font-semibold text-slate-900 dark:text-white"></td>
                <td class="p-6 border-l border-slate-200/50 dark:border-slate-700/50" v-for="doc in store.compareList" :key="'b' + doc.id">
                  <router-link :to="`/book?doctor=${doc.id}`" class="btn-primary block text-center py-2.5" v-if="doc.available">Book Now</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../store'

const minPrice = computed(() => {
  if (store.compareList.length === 0) return null
  return Math.min(...store.compareList.map(d => d.price))
})

const clear = () => {
  store.compareList = []
}
</script>
