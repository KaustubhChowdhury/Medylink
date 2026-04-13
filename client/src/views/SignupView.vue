<template>
  <div class="max-w-md mx-auto mt-10 med-card !p-8">
    <h2 class="text-2xl font-semibold mb-6 text-center">Create account</h2>
    <form @submit.prevent="handleSignup" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input type="text" v-model="name" class="input w-full" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input type="email" v-model="email" class="input w-full" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input type="password" v-model="password" class="input w-full" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Role</label>
        <select v-model="role" class="input w-full text-slate-900 bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div v-if="error" class="text-red-500 text-sm px-1">{{ error }}</div>
      <button type="submit" class="btn-primary w-full mt-2" :disabled="loading">Create account</button>
    </form>
    
    <div class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
      Already have an account? <router-link to="/login" class="text-blue-600 dark:text-blue-500 font-medium hover:underline">Log in</router-link>
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
