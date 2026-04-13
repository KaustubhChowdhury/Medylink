<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-premium">
          <svg class="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        </div>
        <h1 class="heading-2 mb-2">Create your account</h1>
        <p class="subtext">Join us to access quality healthcare</p>
      </div>

      <!-- Card -->
      <div class="card-premium p-8 mb-6">
        <form @submit.prevent="handleSignup" class="flex flex-col gap-5">
          <!-- Name -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Full Name</label>
            <input type="text" v-model="name" class="input w-full" placeholder="John Doe" required />
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Email Address</label>
            <input type="email" v-model="email" class="input w-full" placeholder="you@example.com" required />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Password</label>
            <input type="password" v-model="password" class="input w-full" placeholder="••••••••" required />
          </div>

          <!-- Role -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Role</label>
            <select v-model="role" class="input w-full">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
            <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-secondary w-full py-3.5 mt-2" :disabled="loading">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>
      </div>

      <!-- Sign In Link -->
      <div class="text-center">
        <p class="text-slate-600 dark:text-slate-400">Already have an account?</p>
        <router-link to="/login" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('patient')
const error = ref('')
const loading = ref(false)

const handleSignup = async () => {
  error.value = ''
  loading.value = true
  try {
    await api.auth.signup(name.value, email.value, password.value, role.value)
    router.push('/login')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
