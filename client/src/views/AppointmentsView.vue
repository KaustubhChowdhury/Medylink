<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-semibold tracking-tight">My Appointments</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Manage your upcoming and past medical visits.</p>
    </header>

    <div class="flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-2">
      <button @click="activeTab = 'upcoming'" :class="['pb-2 font-medium border-b-2 transition-colors px-1', activeTab === 'upcoming' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300']">Upcoming</button>
      <button @click="activeTab = 'completed'" :class="['pb-2 font-medium border-b-2 transition-colors px-1', activeTab === 'completed' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300']">Completed</button>
      <button @click="activeTab = 'cancelled'" :class="['pb-2 font-medium border-b-2 transition-colors px-1', activeTab === 'cancelled' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300']">Cancelled</button>
    </div>

    <div class="space-y-4">
      <div v-if="filteredAppointments.length === 0" class="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
        <p class="text-slate-500">No {{ activeTab }} appointments.</p>
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
