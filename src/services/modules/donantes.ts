/**
 * modules/donantes.ts — CRUD de donantes.
 *
 * Incluye mapDonante para normalizar id_donante → id.
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Donante } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapDonante(d: any): Donante {
  return {
    id: d.id_donante ?? d.id,
    identificacion: d.identificacion,
    nombre: d.nombre,
    tipo: d.tipo,
    telefono: d.telefono ?? '',
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiGetDonantes(): Promise<ApiResponse<Donante[]>> {
  const res = await get<any[]>('donantes')
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapDonante)
  return res as ApiResponse<Donante[]>
}

export async function apiCreateDonante(data: Omit<Donante, 'id'>): Promise<ApiResponse<Donante>> {
  return post<Donante>('donantes', data)
}

export async function apiUpdateDonante(id: number, data: Partial<Donante>): Promise<ApiResponse<Donante>> {
  return put<Donante>('donantes', id, data)
}

export async function apiDeleteDonante(id: number, motivo?: string): Promise<ApiResponse<void>> {
  return del<void>('donantes', id, motivo)
}
