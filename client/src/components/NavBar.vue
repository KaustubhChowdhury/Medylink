<template>
  <nav class="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50">
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <span class="text-2xl font-serif font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">MedLink</span>
      </router-link>

      <!-- Nav Links -->
      <div class="flex items-center gap-8">
        <!-- Patient Links -->
        <template v-if="store.currentUser?.role === 'patient'">
          <router-link to="/dashboard" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Dashboard</router-link>
          <router-link to="/discover" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Find Doctors</router-link>
          <router-link to="/compare" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Compare</router-link>
          <router-link to="/history" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">History</router-link>
        </template>
        
        <!-- Doctor Links -->
        <template v-if="store.currentUser?.role === 'doctor'">
          <router-link to="/dashboard" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Dashboard</router-link>
          <router-link to="/appointments" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">My Appointments</router-link>
        </template>

        <!-- Admin Links -->
        <template v-if="store.currentUser?.role === 'admin'">
          <router-link to="/dashboard" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Dashboard</router-link>
          <router-link to="/shortage" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Shortage Map</router-link>
        </template>

        <!-- Right Side -->
        <div class="flex items-center gap-4 ml-4">
          <ThemeToggle />
          
          <template v-if="store.currentUser">
            <div class="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-800 rounded-full pl-1 pr-4 py-1.5 shadow-card border border-primary-100/50 dark:border-slate-700/50">
              <div class="w-8 h-8 rounded-full bg-gradient-accent text-slate-900 flex items-center justify-center font-bold text-sm shadow-md">
                {{ store.currentUser.name.charAt(0).toUpperCase() }}
              </div>
              <button @click="handleLogout" class="text-sm font-semibold text-slate-600 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors duration-200">Log out</button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200">Login</router-link>
            <router-link to="/signup" class="btn-primary !px-6 !py-2 !text-sm">Sign Up</router-link>
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
