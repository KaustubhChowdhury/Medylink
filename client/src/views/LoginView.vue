<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 rounded-2xl bg-gradient-premium flex items-center justify-center mx-auto mb-6 shadow-premium">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h1 class="heading-2 mb-2">Welcome back</h1>
        <p class="subtext">Sign in to access your healthcare</p>
      </div>

      <!-- Card -->
      <div class="card-premium p-8 mb-6">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
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

          <!-- Error -->
          <div v-if="error" class="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
            <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-primary w-full py-3.5 mt-2" :disabled="loading">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Demo Account -->
        <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button type="button" @click="fillDemo" class="w-full py-2.5 px-4 rounded-xl border-2 border-accent-500 text-accent-600 dark:text-accent-400 font-semibold hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all duration-200">
            Demo Account
          </button>
          <p class="text-xs text-slate-500 dark:text-slate-500 text-center mt-2">patient@demo.com / demo1234</p>
        </div>
      </div>

      <!-- Sign Up Link -->
      <div class="text-center">
        <p class="text-slate-600 dark:text-slate-400">Don't have an account?</p>
        <router-link to="/signup" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Create one now</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { store } from '../store'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const fillDemo = () => {
  email.value = 'patient@demo.com'
  password.value = 'demo1234'
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await api.auth.login(email.value, password.value)
    store.setUser(res.user, res.token)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
