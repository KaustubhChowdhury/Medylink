<template>
  <nav class="sticky top-0 z-50 bg-brand-bg/80 dark:bg-slate-900/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <router-link to="/" class="text-2xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <svg class="w-6 h-6 text-[#98A2FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
          MedLink
        </router-link>
      </div>

      <div class="flex items-center gap-6">
        <!-- Patient Links -->
        <template v-if="store.currentUser?.role === 'patient'">
          <router-link to="/dashboard" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">Dashboard</router-link>
          <router-link to="/discover" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">Find Doctors</router-link>
          <router-link to="/compare" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">Compare</router-link>
          <router-link to="/history" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">History</router-link>
        </template>
        
        <!-- Doctor Links -->
        <template v-if="store.currentUser?.role === 'doctor'">
          <router-link to="/dashboard" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">Dashboard</router-link>
          <router-link to="/appointments" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">My Appointments</router-link>
        </template>

        <!-- Admin Links -->
        <template v-if="store.currentUser?.role === 'admin'">
          <router-link to="/dashboard" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">Dashboard</router-link>
          <router-link to="/shortage" class="hidden md:block text-sm font-medium text-slate-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white transition-colors">Shortage Map</router-link>
        </template>

        <div class="flex items-center gap-3 ml-2">
          <ThemeToggle />
          
          <template v-if="store.currentUser">
            <div class="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full pl-1 pr-4 py-1 shadow-sm">
              <div class="w-8 h-8 rounded-full bg-[#FCE0A2] text-neutral-900 flex items-center justify-center font-bold text-sm">
                {{ store.currentUser.name.charAt(0) }}
              </div>
              <button @click="handleLogout" class="text-sm font-medium text-slate-600 hover:text-red-500 transition-colors ml-2">Log out</button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="text-sm font-medium hover:text-neutral-900 transition-colors">Login</router-link>
            <router-link to="/signup" class="btn-primary !px-5 !py-2 !text-sm">Sign Up</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { store } from '../store'
import ThemeToggle from './ThemeToggle.vue'

const handleLogout = () => {
  store.logout()
}
</script>
