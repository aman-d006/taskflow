import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (username, password) => 
    api.post('/token', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  register: (userData) => api.post('/register', userData),
  getMe: () => api.get('/users/me'),
}

export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (task) => api.post('/tasks', task),
  update: (id, task) => api.put(`/tasks/${id}`, task),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const progressAPI = {
  getDaily: (taskId) => api.get(`/daily-progress/${taskId}`),
  markProgress: (progress) => api.post('/daily-progress', progress),
}

export const milestonesAPI = {
  getAll: () => api.get('/milestones'),
  create: (milestone) => api.post('/milestones', milestone),
  update: (id, milestone) => api.put(`/milestones/${id}`, milestone),
  delete: (id) => api.delete(`/milestones/${id}`),
}

export const statsAPI = {
  get: () => api.get('/stats'),
}

export default api