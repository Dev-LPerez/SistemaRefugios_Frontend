/**
 * modules/familias.ts — CRUD de familias.
 *
 * Incluye mapFamilia para normalizar los campos del backend (id_familia → id,
 * coerción de aceptacion_habeas_data a boolean, etc.).
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Familia } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapFamilia(f: any): Familia {
  return {
    id: f.id_familia ?? f.id,
    cedula: f.cedula ?? '',
    representante: f.representante ?? '',
    telefono: f.telefono ?? '',
    direccion: f.direccion ?? '',
    cantidad_miembros: Number(f.cantidad_miembros ?? 0),
    prioridad: f.prioridad !== null && f.prioridad !== undefined && f.prioridad !== '' ? Number(f.prioridad) : 0,
    id_refugio: Number(f.id_refugio ?? 0),
    ubicacion_actual: f.ubicacion_actual ?? '',
    aceptacion_habeas_data: f.aceptacion_habeas_data == 1 || f.aceptacion_habeas_data === true || f.aceptacion_habeas_data === '1',
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiGetFamilias(): Promise<ApiResponse<Familia[]>> {
  const res = await get<any[]>('familias')
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapFamilia)
  return res as ApiResponse<Familia[]>
}

export async function apiCreateFamilia(data: Omit<Familia, 'id'>): Promise<ApiResponse<Familia>> {
  return post<Familia>('familias', data)
}

export async function apiUpdateFamilia(id: number, data: Partial<Familia>): Promise<ApiResponse<Familia>> {
  return put<Familia>('familias', id, data)
}

export async function apiDeleteFamilia(id: number): Promise<ApiResponse<void>> {
  return del<void>('familias', id)
}
