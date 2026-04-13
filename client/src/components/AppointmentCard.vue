<template>
  <div class="med-card flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h3 class="font-semibold text-lg">{{ role === 'doctor' ? appt.patient_name : appt.doctor_name }}</h3>
      <p class="text-slate-500 text-sm" v-if="role === 'patient'">{{ appt.doctor_specialty }}</p>
      
      <div class="flex items-center gap-3 mt-3 text-sm">
        <span class="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 
          {{ appt.date }}
        </span>
        <span class="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
          {{ appt.time }}
        </span>
        <span :class="[
          'badge capitalize border',
          appt.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' : '',
          appt.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800' : '',
          appt.status === 'cancelled' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : ''
        ]">{{ appt.status }}</span>
      </div>
    </div>

    <div v-if="appt.status === 'upcoming' && role === 'patient'" class="shrink-0 mt-4 md:mt-0">
      <button @click="$emit('cancel', appt.id)" class="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400">Cancel</button>
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
