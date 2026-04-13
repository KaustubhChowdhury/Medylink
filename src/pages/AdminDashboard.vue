<template>
  <div>
    <!-- Artistic Header -->
    <div class="relative mb-10">
      <div class="absolute -top-8 -left-8 w-40 h-40 bg-gray-200/20 rounded-full blur-3xl"></div>
      <div class="absolute top-0 right-1/4 w-32 h-32 bg-brand-dark/5 rounded-full blur-2xl"></div>
      <div class="relative">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.2em] mb-2 anim-fade-up">Admin Command Center</p>
        <h1 class="text-4xl font-serif font-bold text-brand-dark mb-1 anim-fade-up anim-delay-1">System Overview</h1>
        <p class="text-text-mid text-sm anim-fade-up anim-delay-2">Monitor network health and manage personnel</p>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card class="!p-5 bg-gradient-to-br from-brand-dark to-brand-mid !border-0 text-white anim-fade-up">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <UserGroupIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">1,204</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">Total Patients</p>
          </div>
        </div>
      </Card>
      
      <Card class="!p-5 bg-gradient-to-br from-brand-green to-brand-light !border-0 text-brand-dark anim-fade-up anim-delay-1">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center">
            <ShieldCheckIcon class="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">89</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">Active Doctors</p>
          </div>
        </div>
      </Card>

      <Card class="!p-5 bg-gradient-to-br from-warn to-yellow-400 !border-0 text-white anim-fade-up anim-delay-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ClockIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">{{ doctors.filter(d => d.status === 'Pending').length }}</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">Pending Approvals</p>
          </div>
        </div>
      </Card>

      <Card class="!p-5 bg-gradient-to-br from-gray-700 to-gray-600 !border-0 text-white anim-fade-up anim-delay-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-icon icon-pulse">
            <ServerIcon class="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <p class="text-2xl font-bold leading-tight line-clamp-1">99.9%</p>
            <p class="text-[10px] uppercase tracking-wider font-semibold opacity-80">System Health</p>
          </div>
        </div>
      </Card>
    </div>

    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-brand-dark">Doctor Registrations</h2>
      <button class="text-xs font-bold text-brand-green hover:underline">View All Network</button>
    </div>

    <!-- Doctor Approvals List -->
    <div class="space-y-3">
      <Card v-for="(doc, i) in doctors" :key="doc.id" class="!p-4 anim-fade-up" :class="`anim-delay-${(i % 3) + 1}`">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center font-bold text-brand-dark shadow-sm">
              {{ doc.name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ doc.name }}</h4>
              <p class="text-xs text-text-mid">{{ doc.specialty }} · ID: {{ doc.id }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border"
              :class="{
                'bg-warn/10 text-warn border-warn/20': doc.status === 'Pending',
                'bg-brand-green/10 text-brand-green border-brand-green/20': doc.status === 'Approved',
                'bg-danger/10 text-danger border-danger/20': doc.status === 'Rejected',
              }">{{ doc.status }}</span>
            <template v-if="doc.status === 'Pending'">
              <div class="flex gap-2">
                <button @click="doc.status = 'Approved'" class="p-1.5 rounded-lg bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white transition-colors">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="doc.status = 'Rejected'" class="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
import { UserGroupIcon, ShieldCheckIcon, ClockIcon, ServerIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const doctors = ref([
  { id: 'MD-84920', name: 'Dr. Sarah Connor', specialty: 'Neurology', status: 'Pending' },
  { id: 'MD-11234', name: 'Dr. James Wilson', specialty: 'Oncology', status: 'Pending' },
  { id: 'MD-55821', name: 'Dr. Allison Cameron', specialty: 'Immunology', status: 'Pending' },
  { id: 'MD-99120', name: 'Dr. Robert Chase', specialty: 'Surgery', status: 'Approved' },
  { id: 'MD-33012', name: 'Dr. Lisa Cuddy', specialty: 'Endocrinology', status: 'Rejected' },
])
</script>
