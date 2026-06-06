/**
 * modules/usuarios.ts — CRUD de usuarios del sistema.
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Usuario } from '@/types'

// ─── Usuarios ────────────────────────────────────────────────────────────────

export const apiGetUsuarios = (): Promise<ApiResponse<Usuario[]>> =>
  get<Usuario[]>('usuarios')

export const apiCreateUsuario = (data: { user: string; password: string; rol: string }): Promise<ApiResponse<Usuario>> =>
  post<Usuario>('usuarios', data)

export const apiUpdateUsuario = (id: number, data: Partial<{ user: string; password: string; rol: string }>): Promise<ApiResponse<Usuario>> =>
  put<Usuario>('usuarios', id, data)

export const apiDeleteUsuario = (id: number): Promise<ApiResponse<void>> =>
  del<void>('usuarios', id)
