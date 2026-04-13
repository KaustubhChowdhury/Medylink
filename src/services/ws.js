const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost/ws'

class WebSocketService {
  constructor() {
    this.listeners = {}
    this.connected = false
    this.connect()
  }

  connect() {
    console.log(`Connecting securely to MedyLink WS at ${WS_URL}...`)
    // Mocking the connection
    setTimeout(() => {
      this.connected = true
      console.log('WebSocket Connected. Secure channel established.')
    }, 1000)
    
    // Simulating incoming events based on requirements
    setInterval(() => {
      const events = ['emergency_alert', 'doctor_response', 'hospital_update', 'doctor_verified']
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      this.triggerEvent(randomEvent, { timestamp: Date.now(), source: 'System Mock WS' })
    }, 30000)
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  triggerEvent(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data))
    }
  }
}

export const wsService = new WebSocketService()
