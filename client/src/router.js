import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from './store'

import LoginView from './views/LoginView.vue'
import SignupView from './views/SignupView.vue'
import DashboardView from './views/DashboardView.vue'
import DiscoveryView from './views/DiscoveryView.vue'
import CompareView from './views/CompareView.vue'
import AppointmentView from './views/AppointmentView.vue'
import AppointmentsView from './views/AppointmentsView.vue'
import HistoryView from './views/HistoryView.vue'
import ShortageView from './views/ShortageView.vue'

const routes = [
  { path: '/', component: DashboardView },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/dashboard', component: DashboardView },
  { path: '/discover', component: DiscoveryView },
  { path: '/compare', component: CompareView },
  { path: '/book', component: AppointmentView },
  { path: '/appointments', component: AppointmentsView },
  { path: '/history', component: HistoryView },
  { path: '/shortage', component: ShortageView }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  
  if (to.path === '/') {
    return store.token ? next('/dashboard') : next('/login');
  }

  if (authRequired && !store.token) {
    return next('/login');
  }

  if (to.path === '/history' && store.currentUser?.role !== 'patient') {
    return next('/dashboard');
  }

  if (to.path === '/book' && store.currentUser?.role !== 'patient') {
    return next('/dashboard');
  }

  next();
})
