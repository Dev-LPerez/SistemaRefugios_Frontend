/**
 * Configuración centralizada de Axios con interceptores globales.
 *
 * Exporta dos clientes:
 *  - apiClient     → para endpoints protegidos (agrega JWT automáticamente)
 *  - publicClient  → para endpoints públicos como /login (sin interceptor de token)
 */
import axios from 'axios'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://sistemarefugios-backend.onrender.com'

// ── Cliente protegido ─────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de REQUEST: agrega token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de RESPONSE: maneja errores HTTP globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
    if (status === 403) {
      console.warn('[API] 403 Forbidden — sin permisos para esta acción')
    }
    return Promise.reject(error)
  }
)

// ── Cliente público (login, registro — SIN interceptor de token) ──────────────
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/** Helper para hacer llamadas con query params estilo ?route=X&id=Y */
export function buildParams(route: string, extra: Record<string, string | number> = {}) {
  return { route, ...extra }
}

export default apiClient
