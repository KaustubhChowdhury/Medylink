<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Compare Doctors</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Review specialists side-by-side to make the best choice.</p>
      </div>
      <button @click="clear" class="btn-ghost" v-if="store.compareList.length > 0">Clear List</button>
    </header>

    <div v-if="store.compareList.length === 0" class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
      <div class="text-4xl mb-4">⚖️</div>
      <h3 class="text-lg font-semibold">Nothing to compare</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto">Go to the Discovery page and click "+ Compare" on up to 3 doctors.</p>
      <router-link to="/discover" class="btn-primary mt-6 inline-flex">Find Doctors</router-link>
    </div>

    <div v-else class="overflow-x-auto w-full border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
      <table class="w-full min-w-[600px] text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <th class="p-4 font-medium text-slate-500 dark:text-slate-400 w-1/4">Feature</th>
            <th class="p-4 w-1/4 border-l border-slate-200 dark:border-slate-700 text-center relative group" v-for="doc in store.compareList" :key="'h' + doc.id">
              <button @click="store.removeFromCompare(doc.id)" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
              <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-lg font-bold mx-auto mb-2 shrink-0">
                {{ doc.name.split(' ').map(w => w[0]).join('').substring(0,2) }}
              </div>
              <h3 class="font-semibold text-base">{{ doc.name }}</h3>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr>
            <td class="p-4 font-medium text-slate-700 dark:text-slate-300">Specialty</td>
            <td class="p-4 border-l border-slate-200 dark:border-slate-700 text-center text-sm" v-for="doc in store.compareList" :key="'s' + doc.id">{{ doc.specialty }}</td>
          </tr>
          <tr>
            <td class="p-4 font-medium text-slate-700 dark:text-slate-300">Area</td>
            <td class="p-4 border-l border-slate-200 dark:border-slate-700 text-center text-sm" v-for="doc in store.compareList" :key="'a' + doc.id">{{ doc.area_name }}</td>
          </tr>
          <tr>
            <td class="p-4 font-medium text-slate-700 dark:text-slate-300">Price</td>
            <td class="p-4 border-l border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-lg" 
              :class="doc.price === minPrice ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''"
              v-for="doc in store.compareList" :key="'p' + doc.id">
              ₹{{ doc.price }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-medium text-slate-700 dark:text-slate-300">Availability</td>
            <td class="p-4 border-l border-slate-200 dark:border-slate-700 text-center" v-for="doc in store.compareList" :key="'av' + doc.id">
              <span v-if="doc.available" class="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-800 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Available
              </span>
              <span v-else class="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Unavailable
              </span>
            </td>
          </tr>
          <tr>
            <td class="p-4 font-medium text-slate-700 dark:text-slate-300">Rating</td>
            <td class="p-4 border-l border-slate-200 dark:border-slate-700 text-center text-amber-500" v-for="doc in store.compareList" :key="'r' + doc.id">
              ★ 4.8
            </td>
          </tr>
          <tr>
            <td class="p-4 font-medium text-slate-700 dark:text-slate-300"></td>
            <td class="p-4 border-l border-slate-200 dark:border-slate-700 text-center" v-for="doc in store.compareList" :key="'b' + doc.id">
              <router-link :to="`/book?doctor=${doc.id}`" class="btn-primary flex justify-center text-sm py-1.5" v-if="doc.available">Book</router-link>
            </td>
          </tr>
        </tbody>
      </table>
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
