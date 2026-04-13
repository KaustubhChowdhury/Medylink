<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-cream px-4 relative overflow-hidden">
    <!-- Background Art -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-brand-green/8 rounded-full blur-[100px] animate-pulse" style="animation-duration:6s"></div>
      <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[120px] animate-pulse" style="animation-duration:8s"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-warn/5 rounded-full blur-[80px] animate-pulse" style="animation-duration:5s"></div>
    </div>

    <div class="z-10 w-full max-w-sm">
      <!-- Brand -->
      <div class="text-center mb-8 anim-fade-up">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-dark to-brand-mid text-white flex items-center justify-center mx-auto mb-5 shadow-icon icon-pulse">
          <span class="text-3xl font-serif font-bold">M</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-brand-dark">MedyLink</h1>
        <p class="text-text-mid text-sm mt-1">Healthcare, reimagined.</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-card p-8 border border-brand-pale/20 anim-fade-up anim-delay-1">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Role -->
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">I am a</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" v-for="r in roles" :key="r.value" @click="role = r.value"
                class="py-3 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all"
                :class="role === r.value
                  ? 'bg-brand-dark text-white border-brand-dark shadow-btn scale-[1.02]'
                  : 'bg-cream text-text-mid border-brand-pale/40 hover:border-brand-green'">
                {{ r.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">User ID</label>
            <input v-model="userId" type="text"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              placeholder="Enter your ID" required />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Password</label>
            <input v-model="password" type="password"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              placeholder="••••••••" required />
          </div>

          <button type="submit"
            class="w-full bg-gradient-to-r from-brand-dark to-brand-mid text-white font-bold rounded-xl py-3.5 text-sm hover:brightness-110 transition-all shadow-btn active:scale-[0.98]">
            Sign In
          </button>
        </form>
      </div>

      <!-- Test Accounts -->
      <div class="mt-6 anim-fade-up anim-delay-2">
        <p class="text-center text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Quick Access — Test Accounts</p>
        <div class="grid grid-cols-3 gap-3">
          <button @click="quickLogin('patient')"
            class="bg-white border-2 border-brand-pale/30 rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-green transition-all group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-icon transition-shadow">
              <UserIcon class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark">Patient</p>
            <p class="text-[9px] text-text-light mt-0.5">elena@test</p>
          </button>

          <button @click="quickLogin('doctor')"
            class="bg-white border-2 border-brand-pale/30 rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-green transition-all group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-icon transition-shadow">
              <BriefcaseIcon class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark">Doctor</p>
            <p class="text-[9px] text-text-light mt-0.5">dr.vance@test</p>
          </button>

          <button @click="quickLogin('admin')"
            class="bg-white border-2 border-brand-pale/30 rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-green transition-all group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-icon transition-shadow">
              <ShieldCheckIcon class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark">Admin</p>
            <p class="text-[9px] text-text-light mt-0.5">admin@test</p>
          </button>
        </div>
      </div>

      <p class="text-center text-[9px] text-text-light mt-6 anim-fade-up anim-delay-3">v2.0 — Built for Hackathon 2026</p>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'
import { UserIcon, BriefcaseIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const userId = ref('')
const password = ref('')
const role = ref('patient')
const login = inject('login')

const roles = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'admin', label: 'Admin' },
]

const handleLogin = () => login(role.value)
const quickLogin = (r) => login(r)
</script>
