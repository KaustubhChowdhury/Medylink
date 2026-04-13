<template>
  <div>
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1">Past Patients</h1>
    <p class="text-text-mid text-sm mb-6">Previous consultations</p>

    <div class="space-y-3">
      <Card v-for="pt in pastPatients" :key="pt.id" class="!p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold text-sm shadow-icon">
              {{ pt.name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ pt.name }}</h4>
              <p class="text-xs text-text-mid">Last visit: {{ pt.lastVisit }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-brand-dark font-semibold">{{ pt.contact }}</p>
            <p class="text-[10px] text-text-mid mt-0.5">Contact</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup>
import Card from '../components/Card.vue'
const pastPatients = [
  { id: 1, name: 'Elena Vance', lastVisit: 'Oct 5, 2025', contact: '+91 98765 43210' },
  { id: 2, name: 'Arthur Morgan', lastVisit: 'Oct 3, 2025', contact: '+91 87654 32109' },
  { id: 3, name: 'Sarah Connor', lastVisit: 'Sep 28, 2025', contact: '+91 76543 21098' },
  { id: 4, name: 'James Wilson', lastVisit: 'Sep 20, 2025', contact: '+91 65432 10987' },
]
</script>
