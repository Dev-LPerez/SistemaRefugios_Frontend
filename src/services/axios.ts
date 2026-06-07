import axios from 'axios'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://sistemarefugios-backend.onrender.com'

// ── Cliente protegido ─────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 👈 Crucial para enviar y recibir cookies de Render
})

// ❌ Quitamos el interceptor de REQUEST que buscaba en localStorage, ya no hace falta.

// Interceptor de RESPONSE: Maneja la expiración de la sesión de la cookie de forma global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      // Si el backend borró la cookie o expiró, limpiamos el estado visual del usuario
      localStorage.removeItem('user')
      router.push('/login')
    }
    if (status === 403) {
      console.warn('[API] 403 Forbidden — sin permisos para esta acción')
    }
    return Promise.reject(error)
  }
)

// ── Cliente público (login, registro) ─────────────────────────────────────────
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 👈 También debe llevarlo para que el navegador acepte el Set-Cookie del Login
})

export function buildParams(route: string, extra: Record<string, string | number> = {}) {
  return { route, ...extra }
}

export default apiClient