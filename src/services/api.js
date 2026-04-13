const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = {
  getPatients: () => {
    console.log(`GET ${BASE_URL}/patients (Placeholder)`)
    return Promise.resolve([])
  },
  postAppointment: (data) => {
    console.log(`POST ${BASE_URL}/appointments with data:`, data)
    return Promise.resolve({ success: true })
  },
  getAppointments: () => {
    console.log(`GET ${BASE_URL}/appointments (Placeholder)`)
    return Promise.resolve([])
  },
  postEmergency: () => {
    console.log(`POST ${BASE_URL}/emergency`)
    return Promise.resolve({ success: true })
  },
  getReports: () => {
    console.log(`GET ${BASE_URL}/reports (Placeholder)`)
    return Promise.resolve([])
  },
  postReportUpload: (file) => {
    console.log(`POST ${BASE_URL}/reports/upload (Placeholder)`)
    return Promise.resolve({ success: true })
  },
  getPendingDoctors: () => {
    console.log(`GET ${BASE_URL}/admin/doctors/pending (Placeholder)`)
    return Promise.resolve([])
  },
  approveDoctor: (id) => {
    console.log(`POST ${BASE_URL}/admin/doctors/approve id: ${id}`)
    return Promise.resolve({ success: true })
  },
  rejectDoctor: (id) => {
    console.log(`POST ${BASE_URL}/admin/doctors/reject id: ${id}`)
    return Promise.resolve({ success: true })
  }
}
