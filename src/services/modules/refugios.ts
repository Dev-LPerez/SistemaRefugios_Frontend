/**
 * modules/refugios.ts — CRUD de refugios.
 *
 * Incluye mapRefugio para normalizar los campos del backend (id_refugio → id).
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Refugio } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapRefugio(r: any): Refugio {
  return {
    id: r.id_refugio ?? r.id,
    nombre: r.nombre,
    direccion: r.direccion,
    capacidad_maxima: Number(r.capacidad_maxima),
    ocupacion_actual: Number(r.ocupacion_actual ?? 0),
    estado: r.estado ?? 'activo',
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiGetRefugios(): Promise<ApiResponse<Refugio[]>> {
  const res = await get<any[]>('refugios')
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapRefugio)
  return res as ApiResponse<Refugio[]>
}

export async function apiCreateRefugio(data: Omit<Refugio, 'id'>): Promise<ApiResponse<Refugio>> {
  return post<Refugio>('refugios', data)
}

export async function apiUpdateRefugio(id: number, data: Partial<Refugio>): Promise<ApiResponse<Refugio>> {
  return put<Refugio>('refugios', id, data)
}

export async function apiDeleteRefugio(id: number, motivo?: string): Promise<ApiResponse<void>> {
  return del<void>('refugios', id, motivo)
}
