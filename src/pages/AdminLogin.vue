<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-brand-cream px-4 py-10 relative overflow-x-hidden overflow-y-auto">
    <!-- Background Art -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-gray-500/10 rounded-full blur-[100px] animate-pulse" style="animation-duration:6s"></div>
      <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-brand-dark/5 rounded-full blur-[120px] animate-pulse" style="animation-duration:8s"></div>
    </div>

    <div class="z-10 w-full max-w-sm">
      <!-- Brand -->
      <div class="text-center mb-8 anim-fade-up">
        <div class="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-gray-700 to-brand-dark text-white flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] icon-pulse relative overflow-hidden group">
          <svg class="w-10 h-10 text-white transform transition-transform duration-700 group-hover:-rotate-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="square" stroke-linejoin="miter">
            <path d="M 35,50 L 35,25 L 50,10 L 65,25 L 65,65" />
            <path d="M 50,35 L 75,35 L 90,50 L 75,65 L 35,65" />
            <path d="M 65,50 L 65,75 L 50,90 L 35,75 L 35,35" />
            <path d="M 50,65 L 25,65 L 10,50 L 25,35 L 65,35" />
          </svg>
        </div>
        <h1 class="text-3xl font-serif font-bold text-brand-dark">Admin Portal</h1>
        <p class="text-text-mid text-sm mt-1">Authorized Personnel Only</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-card p-8 border border-brand-pale/20 anim-fade-up anim-delay-1 relative">
        <div v-if="errorMsg" class="absolute -top-12 left-0 right-0 bg-danger/10 text-danger text-xs font-bold px-4 py-2 rounded-xl text-center border border-danger/20">
          {{ errorMsg }}
        </div>

        <div class="flex mb-6 border-b border-brand-pale/30">
          <button class="flex-1 pb-3 text-sm font-bold text-brand-dark border-b-2 border-brand-dark cursor-default">Secure Sign In</button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Admin Email</label>
            <input v-model="userId" type="email"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="admin@medylink.com" required />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Master Password</label>
            <input v-model="password" type="password"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="••••••••" required />
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold rounded-xl py-3.5 text-sm hover:brightness-110 transition-all shadow-btn active:scale-[0.98] disabled:opacity-70">
            {{ loading ? 'Authenticating...' : 'Override Access' }}
          </button>
        </form>
      </div>

      <!-- Test Accounts -->
      <div class="mt-6 anim-fade-up anim-delay-2">
        <p class="text-center text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">System testing override</p>
        <div class="max-w-[150px] mx-auto">
          <button @click="quickLogin"
            class="w-full bg-white border-2 border-brand-pale/30 rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 hover:border-gray-500 transition-all group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-icon transition-shadow">
              <ShieldCheckIcon class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark">Demo Admin</p>
          </button>
        </div>
      </div>

      <div class="mt-8 text-center anim-fade-up anim-delay-3">
        <router-link to="/login" class="text-xs font-semibold text-brand-dark hover:underline transition-all">
          ← Return to Citizen Portal
        </router-link>
      </div>

      <p class="text-center text-[9px] text-text-light mt-6 anim-fade-up anim-delay-4">v2.0 — Built for Hackathon 2026</p>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'

const userId = ref('') // Used as email
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const login = inject('login')

const API_BASE = 'http://localhost:3001'

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userId.value, password: password.value })
    })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Authentication denied.')
    }

    if (data.user.role !== 'admin') {
      throw new Error('Unauthorized clearance level.')
    }

    // Success
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    login('admin')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

const quickLogin = async () => {
  userId.value = 'admin@demo.com';
  password.value = 'admin1234';
  
  // Try to login directly
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userId.value, password: password.value })
    });
    
    if (!res.ok) {
      // If not found, implicitly mock signup
      await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userId.value, password: password.value, name: 'Admin Demo', role: 'admin' })
      });
    }
    
    handleSubmit();
  } catch (err) {
    errorMsg.value = 'Offline Mode'
  }
}
</script>
