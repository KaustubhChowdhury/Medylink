const BASE = 'http://localhost:3001'

function authHeaders() {
  const token = localStorage.getItem('token')
  return { 
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API Error');
  return data;
}

export const api = {
  auth: {
    login(email, password) {
      return request('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    },
    signup(name, email, password, role) {
      return request('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
    }
  },
  doctors: {
    list(filters = {}) {
      const qs = new URLSearchParams(filters).toString();
      return request(`/doctors${qs ? '?' + qs : ''}`);
    },
    get(id) {
      return request(`/doctors/${id}`);
    },
    compare(ids) {
      return request(`/compare?ids=${ids.join(',')}`);
    }
  },
  areas: {
    list() {
      return request('/areas');
    },
    doctors(id) {
      return request(`/areas/${id}/doctors`);
    }
  },
  appointments: {
    list() {
      return request('/appointments', { headers: authHeaders() });
    },
    book(doctor_id, date, time) {
      return request('/book-appointment', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ doctor_id, date, time })
      });
    },
    cancel(id) {
      return request(`/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: authHeaders()
      });
    }
  },
  history: {
    list() {
      return request('/patient-history', { headers: authHeaders() });
    },
    add(record) {
      return request('/add-record', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(record)
      });
    }
  }
}
