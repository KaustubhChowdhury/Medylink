<template>
  <div class="space-y-8 pb-10">
    <!-- Header -->
    <div>
      <h1 class="heading-1">My Appointments</h1>
      <p class="subtext mt-2 text-lg">Manage your upcoming and past medical visits</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
      <button 
        @click="activeTab = 'upcoming'" 
        :class="[
          'pb-3 px-4 font-semibold text-lg tracking-wide transition-all duration-300 whitespace-nowrap border-b-[3px]',
          activeTab === 'upcoming' 
            ? 'border-b-primary-600 text-primary-600 dark:border-b-primary-400 dark:text-primary-400' 
            : 'border-b-transparent text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
        ]"
      >
        📅 Upcoming
      </button>
      <button 
        @click="activeTab = 'completed'" 
        :class="[
          'pb-3 px-4 font-semibold text-lg tracking-wide transition-all duration-300 whitespace-nowrap border-b-[3px]',
          activeTab === 'completed' 
            ? 'border-b-emerald-600 text-emerald-600 dark:border-b-emerald-400 dark:text-emerald-400' 
            : 'border-b-transparent text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
        ]"
      >
        ✓ Completed
      </button>
      <button 
        @click="activeTab = 'cancelled'" 
        :class="[
          'pb-3 px-4 font-semibold text-lg tracking-wide transition-all duration-300 whitespace-nowrap border-b-[3px]',
          activeTab === 'cancelled' 
            ? 'border-b-red-600 text-red-600 dark:border-b-red-400 dark:text-red-400' 
            : 'border-b-transparent text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
        ]"
      >
        ✕ Cancelled
      </button>
    </div>

    <!-- Appointments List -->
    <div class="space-y-4 blur-in">
      <div v-if="filteredAppointments.length === 0" class="card text-center py-16 border-dashed">
        <div class="text-5xl mb-4">📭</div>
        <p class="subtext font-semibold">No {{ activeTab }} appointments</p>
      </div>
      <AppointmentCard 
        v-for="appt in filteredAppointments" 
        :key="appt.id" 
        :appt="appt" 
        :role="store.currentUser?.role"
        @cancel="handleCancel" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { store } from '../store'
import { api } from '../api'
import AppointmentCard from '../components/AppointmentCard.vue'

const activeTab = ref('upcoming')

const filteredAppointments = computed(() => {
  return store.appointments.filter(a => a.status === activeTab.value)
})

onMounted(() => {
  store.fetchAppointments()
})

const handleCancel = async (id) => {
  if (confirm("Are you sure you want to cancel this appointment?")) {
    try {
      await api.appointments.cancel(id)
      await store.fetchAppointments()
    } catch (e) {
      alert(e.message)
    }
  }
}
</script>
