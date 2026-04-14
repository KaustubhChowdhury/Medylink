<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-brand-cream px-4 py-10 relative overflow-x-hidden overflow-y-auto">
    <!-- Background Art -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-brand-green/8 rounded-full blur-[100px] animate-pulse" style="animation-duration:6s"></div>
      <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[120px] animate-pulse" style="animation-duration:8s"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-warn/5 rounded-full blur-[80px] animate-pulse" style="animation-duration:5s"></div>
    </div>

    <div class="z-10 w-full max-w-sm">
      <!-- Brand -->
      <div class="text-center mb-8 anim-fade-up">
        <div class="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-brand-dark to-[#40916C] text-white flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgba(27,67,50,0.3)] icon-pulse relative overflow-hidden group">
          <svg class="w-10 h-10 text-white transform transition-transform duration-700 group-hover:rotate-180" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="square" stroke-linejoin="miter">
            <path d="M 35,50 L 35,25 L 50,10 L 65,25 L 65,65" />
            <path d="M 50,35 L 75,35 L 90,50 L 75,65 L 35,65" />
            <path d="M 65,50 L 65,75 L 50,90 L 35,75 L 35,35" />
            <path d="M 50,65 L 25,65 L 10,50 L 25,35 L 65,35" />
          </svg>
        </div>
        <h1 class="text-3xl font-serif font-bold text-brand-dark">MedyLink</h1>
        <p class="text-text-mid text-sm mt-1">Healthcare, reimagined.</p>
      </div>

      <!-- Login / Signup Card -->
      <div class="bg-white rounded-3xl shadow-card p-8 border border-brand-pale/20 anim-fade-up anim-delay-1 relative">
        <!-- Error Bar -->
        <div v-if="errorMsg" class="absolute -top-12 left-0 right-0 bg-danger/10 text-danger text-xs font-bold px-4 py-2 rounded-xl text-center border border-danger/20">
          {{ errorMsg }}
        </div>

        <!-- Tabs -->
        <div class="flex mb-6 border-b border-brand-pale/30">
          <button @click="isLoginMode = true; errorMsg = ''" class="flex-1 pb-3 text-sm font-bold transition-colors" :class="isLoginMode ? 'text-brand-dark border-b-2 border-brand-dark' : 'text-text-mid hover:text-brand-dark'">Sign In</button>
          <button @click="isLoginMode = false; errorMsg = ''" class="flex-1 pb-3 text-sm font-bold transition-colors" :class="!isLoginMode ? 'text-brand-dark border-b-2 border-brand-dark' : 'text-text-mid hover:text-brand-dark'">Sign Up</button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Role Selection -->
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">I am a</label>
            <div class="grid gap-2 grid-cols-2">
              <button type="button" @click="role = 'patient'"
                class="py-3 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all"
                :class="role === 'patient' ? 'bg-brand-dark text-white border-brand-dark shadow-btn scale-[1.02]' : 'bg-cream text-text-mid border-brand-pale/40 hover:border-brand-green'">
                {{ isLoginMode ? 'Patient' : 'Citizen' }}
              </button>
              <button type="button" @click="role = 'doctor'"
                class="py-3 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all"
                :class="role === 'doctor' ? 'bg-brand-dark text-white border-brand-dark shadow-btn scale-[1.02]' : 'bg-cream text-text-mid border-brand-pale/40 hover:border-brand-green'">
                Doctor
              </button>
            </div>
          </div>

          <!-- Sign Up Additional Fields -->
          <template v-if="!isLoginMode">
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Full Name</label>
                <input v-model="name" type="text"
                  class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
                  placeholder="Jane Doe" :required="!isLoginMode" />
              </div>
              
              <!-- Medical ID for Doctors -->
              <div v-if="role === 'doctor'" class="anim-fade-up">
                <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Medical License ID</label>
                <input v-model="medicalId" type="text"
                  class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors mb-3"
                  placeholder="MED-12345-KL" :required="role === 'doctor' && !isLoginMode" />
                
                <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Attach ID Document (Image/PDF)</label>
                <div class="relative group">
                  <input type="file" @change="handleFileChange" accept="image/*,.pdf"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div class="w-full bg-cream border-2 border-dashed border-brand-pale/50 rounded-xl px-4 py-3 text-xs text-text-mid flex items-center justify-center gap-2 group-hover:border-brand-green transition-all">
                    <CloudArrowUpIcon class="w-4 h-4 text-brand-green" />
                    {{ fileName || 'Click to upload document' }}
                  </div>
                </div>
                <p v-if="fileName" class="text-[9px] text-brand-green mt-1 font-bold">Successfully attached!</p>
                
                <p class="text-[9px] text-text-mid mt-3 flex items-center gap-1 leading-tight">
                  <ShieldCheckIcon class="w-2.5 h-2.5" />
                  Documents are required for admin verification and network approval.
                </p>
              </div>
            </div>
          </template>

          <!-- Common Fields -->
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Email Address</label>
            <input v-model="userId" type="email"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              placeholder="Enter your email" required />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Password</label>
            <input v-model="password" type="password"
              class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              placeholder="••••••••" required />
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-gradient-to-r from-brand-dark to-brand-mid text-white font-bold rounded-xl py-3.5 text-sm hover:brightness-110 transition-all shadow-btn active:scale-[0.98] disabled:opacity-70">
            {{ loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account') }}
          </button>
        </form>
      </div>

      <!-- Test Accounts -->
      <div v-if="isLoginMode" class="mt-6 anim-fade-up anim-delay-2">
        <p class="text-center text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-3">Quick Access — Test Accounts</p>
        <div class="grid grid-cols-2 gap-3 max-w-[250px] mx-auto">
          <button @click="quickLogin('patient@demo.com', 'demo1234', 'patient')"
            class="bg-white border-2 border-brand-pale/30 rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-green transition-all group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-mid flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-icon transition-shadow">
              <UserIcon class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark">Patient</p>
            <p class="text-[9px] text-text-light mt-0.5">patient@demo.com</p>
          </button>

          <button @click="quickLogin('doctor@demo.com', 'demo1234', 'doctor')"
            class="bg-white border-2 border-brand-pale/30 rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-green transition-all group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-icon transition-shadow">
              <BriefcaseIcon class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs font-bold text-brand-dark">Doctor</p>
            <!-- In demo DB we don't have doctor@demo.com account. Just mock this button for UI testing -->
            <p class="text-[9px] text-text-light mt-0.5">doctor@test</p>
          </button>
        </div>
      </div>

      <div class="mt-6 text-center anim-fade-up anim-delay-3">
        <router-link to="/admin/login" class="text-xs font-semibold text-brand-dark hover:underline transition-all">
          Are you an admin? Sign in here
        </router-link>
      </div>

      <p class="text-center text-[9px] text-text-light mt-6 anim-fade-up anim-delay-3">v2.0 — Built for Hackathon 2026</p>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, watch } from 'vue'
import { UserIcon, BriefcaseIcon, ShieldCheckIcon, CloudArrowUpIcon } from '@heroicons/vue/24/outline'

const isLoginMode = ref(true)
const name = ref('')
const userId = ref('') // Used as email
const password = ref('')
const role = ref('patient')
const medicalId = ref('')
const medicalIdFile = ref('')
const fileName = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (event) => {
    medicalIdFile.value = event.target.result
  }
  reader.readAsDataURL(file)
}

const login = inject('login')

watch(isLoginMode, (newVal) => {
  if (!newVal && role.value === 'admin') {
    role.value = 'patient' // Prevent admin sign up visually
  }
})

const API_BASE = 'http://localhost:3001'

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  
  const endpoint = isLoginMode.value ? '/login' : '/signup'
  const payload = {
    email: userId.value,
    password: password.value,
  }
  
  if (!isLoginMode.value) {
    payload.name = name.value
    payload.role = role.value
    if (role.value === 'doctor') {
      payload.medical_id = medicalId.value
      payload.medical_id_file = medicalIdFile.value
    }
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed.')
    }

    // Success
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    // Override the role logic because it's determined by the fetched user
    login(data.user.role)
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

const quickLogin = async (email, pass, r) => {
  userId.value = email;
  password.value = pass;
  
  // Try to login directly
  isLoginMode.value = true;
  
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    
    if (!res.ok) throw new Error('Not found');
    
    // Valid account — await so token is stored before navigation
    await handleSubmit();
  } catch (err) {
    // If not found, create the default demo account right now
    isLoginMode.value = false;
    name.value = r === 'doctor' ? 'Dr. Demo' : (r === 'admin' ? 'Admin Demo' : 'Patient Demo');
    role.value = r;
    await handleSubmit();
  }
}
</script>
