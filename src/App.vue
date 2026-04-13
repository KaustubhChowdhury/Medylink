<template>
  <div class="flex h-screen overflow-hidden font-sans bg-brand-cream text-text-dark">
    <Sidebar v-if="route.path !== '/login'" :portal="userRole" />
    <div class="flex-1 flex flex-col w-full h-full overflow-hidden">
      <Navbar v-if="route.path !== '/login'" :portal="userRole" />
      <main class="flex-1 overflow-x-hidden overflow-y-auto px-6 md:px-10 py-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const router = useRouter()

const userRole = ref(null)
provide('userRole', userRole)

const login = (role) => {
  userRole.value = role
  if (role === 'doctor') router.push('/doctor/dashboard')
  else if (role === 'admin') router.push('/admin/dashboard')
  else router.push('/patient/dashboard')
}
provide('login', login)
</script>
<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
