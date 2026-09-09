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

// Handle auth and API errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Extract structured error message from API response if present
    const apiError = error.response?.data
    if (apiError?.message) {
      // If unauthorized on a protected page (and not in an auth flow), clear session
      if (error.response?.status === 401 && !window.location.pathname.startsWith('/auth')) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/auth/login'
      }
      return Promise.reject(new Error(apiError.message))
    }

    // 2. Token expired on protected routes with no custom message
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/auth')) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/auth/login'
      return Promise.reject(new Error('Session expired. Please sign in again.'))
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'))
    }

    if (!error.response) {
      return Promise.reject(new Error('Unable to connect to CareerSetu backend. Please check your connection or try again shortly.'))
    }

    return Promise.reject(error)
  }
)
