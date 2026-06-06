/**
 * modules/donaciones.ts — CRUD de donaciones y detalle de donación.
 *
 * Incluye mapDonacion para normalizar id_donacion → id.
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Donacion, DetalleDonacion } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapDonacion(d: any): Donacion {
  return {
    id: d.id_donacion ?? d.id,
    fecha: d.fecha,
    descripcion: d.descripcion ?? '',
    id_donante: d.id_donante,
    origen: d.origen ?? '',
    categoria: d.categoria ?? '',
    donante: d.donante,
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiGetDonaciones(): Promise<ApiResponse<Donacion[]>> {
  const res = await get<any[]>('donaciones')
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapDonacion)
  return res as ApiResponse<Donacion[]>
}

export async function apiCreateDonacion(data: Omit<Donacion, 'id' | 'donante'>): Promise<ApiResponse<Donacion>> {
  return post<Donacion>('donaciones', data)
}

export async function apiUpdateDonacion(id: number, data: Partial<Donacion>): Promise<ApiResponse<Donacion>> {
  return put<Donacion>('donaciones', id, data)
}

export async function apiDeleteDonacion(id: number): Promise<ApiResponse<void>> {
  return del<void>('donaciones', id)
}

export async function apiAgregarDetalleDonacion(detalle: DetalleDonacion): Promise<ApiResponse<void>> {
  return post<void>('donaciones', detalle, { action: 'agregar_detalle' })
}
