<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-6 -left-4 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Appointment Queue</h1>
      <p class="text-text-mid text-sm relative">Manage today's patients</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-3">
        <Card v-for="(pt, i) in patients" :key="pt.id"
          class="!p-4 cursor-pointer transition-all anim-fade-up"
          :class="[i === activeIndex ? '!border-brand-green/40 !shadow-card-hover !bg-brand-pale/5' : 'hover:shadow-card-hover', `anim-delay-${i+1}`]"
          @click="activeIndex = i; aiSummary = ''">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-icon transition-all"
                :class="i < activeIndex ? 'bg-cream text-text-light' : i === activeIndex ? 'bg-gradient-to-br from-brand-green to-brand-mid text-white icon-pulse' : 'bg-cream-dark text-text-mid'">
                #{{ pt.token }}
              </div>
              <div>
                <h4 class="text-sm font-bold text-brand-dark">{{ pt.name }}</h4>
                <p class="text-xs text-text-mid">{{ pt.appointmentId }} · {{ pt.time }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="i === activeIndex" class="text-[10px] font-bold uppercase bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-lg">Active</span>
              <span v-if="i < activeIndex" class="text-[10px] font-bold uppercase bg-cream text-text-light px-3 py-1.5 rounded-lg">Done</span>
              <button v-if="i === activeIndex" @click.stop="postpone(i)" class="text-xs text-warn font-bold hover:underline">Postpone</button>
            </div>
          </div>
        </Card>

        <div class="mt-4">
          <Button variant="doctor" @click="nextPatient" :disabled="activeIndex >= patients.length - 1" class="!px-6 !py-3">
            Call Next Patient →
          </Button>
        </div>
      </div>

      <div v-if="activePatient" class="space-y-4 anim-fade-up anim-delay-1">
        <Card class="!p-5">
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-4">Patient Details</p>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center font-bold font-serif text-xl shadow-icon icon-float">
              {{ activePatient.name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <h3 class="font-bold text-brand-dark text-lg">{{ activePatient.name }}</h3>
              <p class="text-xs text-text-mid">{{ activePatient.appointmentId }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm"><span class="text-text-mid">Age</span><span class="font-semibold text-brand-dark">{{ activePatient.age }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-text-mid">Blood Group</span><span class="font-semibold text-brand-dark">{{ activePatient.blood }}</span></div>
          </div>
        </Card>

        <Card class="!p-5">
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Reports</p>
          <div class="space-y-2">
            <div v-for="rpt in activePatient.reports" :key="rpt" class="flex items-center gap-3 p-3 bg-cream rounded-xl">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-danger to-red-400 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">PDF</div>
              <span class="text-sm text-brand-dark font-medium">{{ rpt }}</span>
            </div>
          </div>
        </Card>

        <Card class="!p-5">
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Medical History</p>
          <ul class="space-y-2">
            <li v-for="h in activePatient.history" :key="h" class="text-sm text-text-mid flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-brand-light shrink-0"></span> {{ h }}
            </li>
          </ul>
        </Card>

        <Card class="!p-5">
          <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">AI Summary</p>
          <div v-if="aiSummary" class="text-sm text-brand-dark leading-relaxed bg-cream rounded-xl p-4 border border-brand-pale/30">{{ aiSummary }}</div>
          <Button v-else variant="doctor" @click="generateSummary" block>Generate Summary</Button>
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
const activeIndex = ref(0)
const aiSummary = ref('')
const patients = ref([
  { id: 1, token: 1, name: 'Elena Vance', appointmentId: 'APT-001', time: '09:00', age: 34, blood: 'O+', reports: ['Blood Count Report', 'MRI Scan'], history: ['Hypertension Stage I', 'Mild anemia'] },
  { id: 2, token: 2, name: 'Arthur Morgan', appointmentId: 'APT-002', time: '09:10', age: 45, blood: 'A+', reports: ['ECG Report'], history: ['Type 2 Diabetes'] },
  { id: 3, token: 3, name: 'Sarah Connor', appointmentId: 'APT-003', time: '09:20', age: 29, blood: 'B+', reports: ['X-Ray (Chest)'], history: ['No major conditions'] },
  { id: 4, token: 4, name: 'James Wilson', appointmentId: 'APT-004', time: '09:30', age: 52, blood: 'AB-', reports: ['Lipid Panel'], history: ['High cholesterol', 'Back pain'] },
])
const activePatient = computed(() => patients.value[activeIndex.value] || null)
const nextPatient = () => { if (activeIndex.value < patients.value.length - 1) { activeIndex.value++; aiSummary.value = '' } }
const postpone = (i) => { const p = patients.value.splice(i, 1)[0]; patients.value.push(p) }
const generateSummary = () => {
  const p = activePatient.value
  aiSummary.value = `Patient ${p.name}, age ${p.age}, blood group ${p.blood}. Known history: ${p.history.join(', ')}. ${p.reports.length} report(s) on file. Recommend reviewing latest reports and updating treatment plan.`
}
</script>
