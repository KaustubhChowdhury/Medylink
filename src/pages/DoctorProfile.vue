<template>
  <div>
    <div class="relative mb-10">
      <div class="absolute -top-6 -left-4 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl"></div>
      <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1 relative">Doctor Profile</h1>
      <p class="text-text-mid text-sm relative">Professional and practice information</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <Card class="!p-6 md:col-span-1 anim-fade-up text-center">
        <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center mx-auto mb-4 shadow-icon icon-pulse text-white font-serif font-bold text-3xl">
          DR
        </div>
        <h2 class="text-xl font-bold text-brand-dark mb-0.5" v-if="profile">{{ profile.name }}</h2>
        <h2 class="text-xl font-bold text-brand-dark mb-0.5" v-else>Loading...</h2>
        <p class="text-xs text-text-mid mb-4">Doctor ID: {{ profile ? profile.id : '...' }}</p>
        <div class="inline-flex items-center gap-1.5 bg-brand-pale/30 text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
          <span class="w-2 h-2 rounded-full bg-brand-green"></span> Verified Practitioner
        </div>
      </Card>

      <!-- Professional Info -->
      <Card class="!p-6 md:col-span-2 anim-fade-up anim-delay-1">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-5">Professional Details</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="profile">
          <div>
            <label class="block text-xs text-text-light mb-1">Specialty</label>
            <input v-model="form.specialty" type="text"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green transition-colors" />
          </div>
          <div>
            <label class="block text-xs text-text-light mb-1">Fee (₹)</label>
            <input v-model="form.price" type="number"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green transition-colors" />
          </div>
          <div>
            <label class="block text-xs text-text-light mb-1">Area ID</label>
            <input v-model="form.area_id" type="number"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-2.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green transition-colors" />
          </div>
          <div>
            <label class="block text-xs text-text-light mb-1">Current Area</label>
            <input :value="profile.area_name || 'N/A'" disabled type="text"
              class="w-full bg-cream-dark border-2 border-transparent opacity-70 rounded-xl px-4 py-2.5 text-sm text-text-mid font-medium focus:outline-none cursor-not-allowed" />
          </div>
        </div>
        <div class="mt-5 flex gap-4 items-center">
          <Button variant="doctor" @click="saveProfile">Save Changes</Button>
        </div>
      </Card>
    </div>

    <!-- Saved Toast -->
    <div v-if="saved" class="fixed bottom-6 right-6 bg-brand-dark text-white px-6 py-3 rounded-2xl shadow-icon anim-fade-up text-sm font-semibold z-50">
      ✓ Profile updated successfully
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'

const saved = ref(false)
const profile = ref(null)
const auth = ref(null)

const form = ref({
  specialty: '',
  price: 0,
  area_id: 1
})

const fetchProfile = async () => {
  try {
    const res = await fetch('http://localhost:3001/doctor/me', {
      headers: {
        'Authorization': `Bearer ${auth.value?.token}`
      }
    })
    if (res.ok) {
      const { data } = await res.json()
      profile.value = data
      form.value = {
        specialty: data.specialty || '',
        price: data.price || 0,
        area_id: data.area_id || 1
      }
    }
  } catch (err) {
    console.error('Failed to fetch doctor profile', err)
  }
}

const saveProfile = async () => {
  try {
    const res = await fetch('http://localhost:3001/doctor/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.value?.token}`
      },
      body: JSON.stringify(form.value)
    })
    
    if (res.ok) {
      const { data } = await res.json()
      profile.value = data
      saved.value = true
      setTimeout(() => saved.value = false, 2500)
    }
  } catch (err) {
    console.error('Failed to update doctor profile', err)
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    auth.value = { token }
    fetchProfile()
  }
})
</script>
