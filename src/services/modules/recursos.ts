/**
 * modules/recursos.ts — CRUD de recursos (inventario).
 *
 * Incluye mapRecurso para normalizar id_recurso → id.
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Recurso } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapRecurso(r: any): Recurso {
  return {
    id: r.id_recurso ?? r.id,
    nombre: r.nombre,
    tipo: r.tipo,
    unidad: r.unidad,
    cantidad_disponible: Number(r.cantidad_disponible ?? 0),
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiGetRecursos(): Promise<ApiResponse<Recurso[]>> {
  const res = await get<any[]>('recursos')
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapRecurso)
  return res as ApiResponse<Recurso[]>
}

export async function apiCreateRecurso(data: Omit<Recurso, 'id'>): Promise<ApiResponse<Recurso>> {
  return post<Recurso>('recursos', data)
}

export async function apiUpdateRecurso(id: number, data: Partial<Recurso>): Promise<ApiResponse<Recurso>> {
  return put<Recurso>('recursos', id, data)
}

export async function apiDeleteRecurso(id: number): Promise<ApiResponse<void>> {
  return del<void>('recursos', id)
}
