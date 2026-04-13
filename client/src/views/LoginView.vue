<template>
  <div class="max-w-md mx-auto mt-10 med-card !p-8">
    <h2 class="text-2xl font-semibold mb-6 text-center">Welcome back</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input type="email" v-model="email" class="input w-full" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input type="password" v-model="password" class="input w-full" required />
      </div>
      <div v-if="error" class="text-red-500 text-sm px-1">{{ error }}</div>
      <button type="submit" class="btn-primary w-full mt-2" :disabled="loading">Sign in</button>
    </form>
    
    <div class="mt-6 text-center">
      <button type="button" @click="fillDemo" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Use demo account</button>
    </div>
    
    <div class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
      Don't have an account? <router-link to="/signup" class="text-blue-600 dark:text-blue-500 font-medium hover:underline">Sign up</router-link>
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
