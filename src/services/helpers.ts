/**
 * helpers.ts — Funciones auxiliares compartidas por todos los módulos de servicio.
 *
 * Contiene el normalizador de respuestas del backend PHP y los wrappers
 * genéricos de HTTP (get, post, put, del) que usan apiClient de Axios.
 */
import apiClient from './axios'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'

// ─── Normaliza la respuesta cruda del backend PHP ────────────────────────────

export function normalize<T>(res: AxiosResponse): ApiResponse<T> {
  const json = res.data
  if (typeof json?.status === 'number') {
    const ok = json.status >= 200 && json.status < 300
    return { success: ok, message: json.message ?? json.error, data: json.data ?? json }
  }
  return { success: res.status >= 200 && res.status < 300, data: json }
}

// ─── Wrappers HTTP genéricos ─────────────────────────────────────────────────

export async function get<T>(route: string, params: Record<string, string | number> = {}): Promise<ApiResponse<T>> {
  try {
    const res = await apiClient.get('', { params: { route, ...params } })
    return normalize<T>(res)
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message ?? err.response?.data?.error ?? 'Error de conexión' }
  }
}

export async function post<T>(route: string, data: unknown, params: Record<string, string | number> = {}): Promise<ApiResponse<T>> {
  try {
    const res = await apiClient.post('', data, { params: { route, ...params } })
    return normalize<T>(res)
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message ?? err.response?.data?.error ?? 'Error de conexión' }
  }
}

export async function put<T>(route: string, id: number, data: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await apiClient.put('', data, { params: { route, id } })
    return normalize<T>(res)
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message ?? err.response?.data?.error ?? 'Error de conexión' }
  }
}

export async function del<T>(route: string, id: number): Promise<ApiResponse<T>> {
  try {
    const res = await apiClient.delete('', { params: { route, id } })
    return normalize<T>(res)
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message ?? err.response?.data?.error ?? 'Error de conexión' }
  }
}
