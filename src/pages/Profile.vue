<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-6 -left-4 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">My Profile</h1>
      <p class="text-text-mid text-sm relative">Your personal & medical information</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <Card class="!p-6 md:col-span-1 anim-fade-up text-center">
        <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center mx-auto mb-4 shadow-icon icon-pulse text-white font-serif font-bold text-3xl">
          ER
        </div>
        <h2 class="text-xl font-bold text-brand-dark mb-0.5">Elena Rossi</h2>
        <p class="text-xs text-text-mid mb-4">Patient ID: MED-982-A</p>
        <div class="inline-flex items-center gap-1.5 bg-brand-pale/30 text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
          <span class="w-2 h-2 rounded-full bg-brand-green"></span> Active Member
        </div>
      </Card>

      <!-- Personal Info -->
      <Card class="!p-6 md:col-span-2 anim-fade-up anim-delay-1">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">Personal Information</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in personalFields" :key="field.label">
            <label class="block text-xs text-text-light mb-1">{{ field.label }}</label>
            <input v-model="field.value" :type="field.type || 'text'"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green transition-colors" />
          </div>
        </div>
        <div class="mt-5">
          <Button variant="patient" @click="saveProfile">Save Changes</Button>
        </div>
      </Card>
    </div>

    <!-- Medical Info -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <Card class="!p-5 anim-fade-up anim-delay-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-danger to-red-400 flex items-center justify-center shadow-icon icon-float">
            <HeartIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-text-light uppercase tracking-wider font-bold">Blood Group</p>
            <p class="text-xl font-bold text-brand-dark">O Positive</p>
          </div>
        </div>
      </Card>

      <Card class="!p-5 anim-fade-up anim-delay-3">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center shadow-icon icon-float" style="animation-delay: 0.5s">
            <ShieldCheckIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-text-light uppercase tracking-wider font-bold">Allergies</p>
            <p class="text-sm font-semibold text-brand-dark">Penicillin, Dust</p>
          </div>
        </div>
      </Card>

      <Card class="!p-5 anim-fade-up anim-delay-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-warn to-yellow-500 flex items-center justify-center shadow-icon icon-float" style="animation-delay: 1s">
            <ClipboardDocumentListIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-text-light uppercase tracking-wider font-bold">Conditions</p>
            <p class="text-sm font-semibold text-brand-dark">Hypertension (Stage I)</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Emergency Contact -->
    <Card class="!p-6 mt-6 anim-fade-up anim-delay-5">
      <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-4">Emergency Contact</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-text-light mb-1">Name</label>
          <input v-model="emergencyContact.name" class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green" />
        </div>
        <div>
          <label class="block text-xs text-text-light mb-1">Relationship</label>
          <input v-model="emergencyContact.relation" class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green" />
        </div>
        <div>
          <label class="block text-xs text-text-light mb-1">Phone</label>
          <input v-model="emergencyContact.phone" class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green" />
        </div>
      </div>
    </Card>

    <!-- Saved Toast -->
    <div v-if="saved" class="fixed bottom-6 right-6 bg-brand-dark text-white px-6 py-3 rounded-2xl shadow-icon anim-fade-up text-sm font-semibold z-50">
      ✓ Profile saved successfully
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import { HeartIcon, ShieldCheckIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'

const saved = ref(false)

const personalFields = ref([
  { label: 'Full Name', value: 'Elena Rossi' },
  { label: 'Date of Birth', value: '1991-03-15', type: 'date' },
  { label: 'Email', value: 'elena.rossi@email.com', type: 'email' },
  { label: 'Phone', value: '+91 98765 43210', type: 'tel' },
  { label: 'Address', value: '42 Green Valley, Mumbai' },
  { label: 'Gender', value: 'Female' },
])

const emergencyContact = ref({
  name: 'Marco Rossi',
  relation: 'Spouse',
  phone: '+91 98765 12345',
})

const saveProfile = () => {
  saved.value = true
  setTimeout(() => saved.value = false, 2500)
}
</script>
