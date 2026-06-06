/**
 * modules/auth.ts — Autenticación (login).
 *
 * Usa publicClient (sin interceptor de token) para el endpoint de login.
 */
import { publicClient } from '../axios'
import type { ApiResponse, Usuario } from '@/types'

// ─── Login ───────────────────────────────────────────────────────────────────

export async function apiLogin(
  user: string,
  password: string
): Promise<ApiResponse<{ usuario: Usuario; token: string }>> {
  try {
    const res = await publicClient.post('', { user, password }, { params: { route: 'login' } })
    const json = res.data
    if (json.status === 200 && json.token) {
      const bd = json.data
      const usuario: Usuario = {
        id: bd.id_usuario,
        nombre: bd.user,
        user: bd.user,
        rol: bd.rol,
      }
      return { success: true, data: { usuario, token: json.token } }
    }
    return { success: false, message: json.message ?? 'Credenciales incorrectas' }
  } catch {
    return { success: false, message: 'Error de conexión con el servidor' }
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function apiLogout(): Promise<ApiResponse<null>> {
  try {
    const res = await publicClient.post('', {}, { params: { route: 'login', action: 'logout' } })
    const json = res.data
    if (json.status === 200) {
      return { success: true, data: null }
    }
    return { success: false, message: json.message ?? 'Error al cerrar sesión' }
  } catch {
    return { success: false, message: 'Error de conexión con el servidor' }
  }
}
