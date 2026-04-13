<template>
  <div class="appointment-card">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex-1">
        <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">{{ role === 'doctor' ? 'Patient' : 'Doctor' }}</p>
        <h3 class="heading-4">{{ role === 'doctor' ? appt.patient_name : appt.doctor_name }}</h3>
        <p v-if="role === 'patient'" class="text-slate-600 dark:text-slate-400 font-medium mt-1">{{ appt.doctor_specialty }}</p>
        
        <div class="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium">
          <span class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            {{ appt.date }}
          </span>
          <span class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ appt.time }}
          </span>
          <span :class="[
            'badge capitalize font-semibold',
            appt.status === 'upcoming' ? 'badge-primary' : '',
            appt.status === 'completed' ? 'badge-success' : '',
            appt.status === 'cancelled' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' : ''
          ]">
            {{ appt.status }}
          </span>
        </div>
      </div>

      <div v-if="appt.status === 'upcoming' && role === 'patient'" class="shrink-0 mt-4 md:mt-0">
        <button @click="$emit('cancel', appt.id)" class="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 dark:text-red-400 px-6 py-2.5">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appt: Object,
  role: String
})
defineEmits(['cancel'])
</script>
