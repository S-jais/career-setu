import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Add request ID for traceability
  config.headers['X-Request-ID'] = crypto.randomUUID()
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth and redirect
      useAuthStore.getState().clearAuth()
      window.location.href = '/auth/login'
      return Promise.reject(new Error('Session expired. Please sign in again.'))
    }

    // Extract safe error message from API response
    const apiError = error.response?.data
    if (apiError?.message) {
      return Promise.reject(new Error(apiError.message))
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'))
    }

    if (!error.response) {
      return Promise.reject(new Error('Unable to connect to CareerSetu. Please check your connection.'))
    }

    return Promise.reject(error)
  }
)
