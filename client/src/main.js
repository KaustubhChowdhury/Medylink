import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { store } from './store'

store.init();

const app = createApp(App)
app.use(router)
app.mount('#app')
