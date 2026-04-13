import { reactive } from 'vue'
import { api } from './api'
import { router } from './router'

export const store = reactive({
  currentUser: null,
  token: localStorage.getItem('token') || null,
  doctors: [],
  areas: [],
  appointments: [],
  history: [],
  compareList: [],
  darkMode: localStorage.getItem('darkMode') === 'true',

  setUser(user, token) {
    this.currentUser = user;
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  logout() {
    this.setUser(null, null);
    this.appointments = [];
    this.history = [];
    router.push('/login');
  },
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode);
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  init() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }
    const user = localStorage.getItem('user');
    if (user && this.token) {
      try {
        this.currentUser = JSON.parse(user);
      } catch (e) {}
    }
  },

  addToCompare(doctor) {
    if (this.compareList.find(d => d.id === doctor.id)) return;
    if (this.compareList.length >= 3) {
      alert("You can only compare up to 3 doctors.");
      return;
    }
    this.compareList.push(doctor);
  },

  removeFromCompare(id) {
    this.compareList = this.compareList.filter(d => d.id !== id);
  },

  async fetchDoctors(filters) {
    this.doctors = await api.doctors.list(filters);
  },

  async fetchAreas() {
    this.areas = await api.areas.list();
  },

  async fetchAppointments() {
    if (!this.token) return;
    this.appointments = await api.appointments.list();
  },

  async fetchHistory() {
    if (!this.token) return;
    if (this.currentUser?.role === 'patient') {
      this.history = await api.history.list();
    }
  }
});
