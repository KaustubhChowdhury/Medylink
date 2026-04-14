import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../pages/Login.vue') },
  { path: '/settings', component: () => import('../pages/Settings.vue') },

  // Patient Portal
  { path: '/patient/dashboard', component: () => import('../pages/PatientDashboard.vue') },
  { path: '/patient/book', component: () => import('../pages/BookAppointment.vue') },
  { path: '/patient/tracking', component: () => import('../pages/TrackAppointment.vue') },
  { path: '/patient/records', component: () => import('../pages/Records.vue') },
  { path: '/patient/medications', component: () => import('../pages/Medications.vue') },
  { path: '/patient/sos', component: () => import('../pages/Emergency.vue') },
  { path: '/patient/profile', component: () => import('../pages/Profile.vue') },

  // Doctor Portal
  { path: '/doctor/dashboard', component: () => import('../pages/DoctorDashboard.vue') },
  { path: '/doctor/slots', component: () => import('../pages/SlotManager.vue') },
  { path: '/doctor/sos', component: () => import('../pages/DoctorSOS.vue') },
  { path: '/doctor/patients', component: () => import('../pages/PastPatients.vue') },
  { path: '/doctor/profile', component: () => import('../pages/DoctorProfile.vue') },

  // Admin Portal
  { path: '/admin/login', component: () => import('../pages/AdminLogin.vue') },
  { path: '/admin/dashboard', component: () => import('../pages/AdminDashboard.vue') },
  { path: '/admin/doctors', component: () => import('../pages/AdminDoctors.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
