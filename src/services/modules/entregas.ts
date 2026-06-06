/**
 * modules/entregas.ts — CRUD de entregas.
 *
 * Incluye mapEntrega para normalizar campos del backend incluyendo
 * familia_representante y recurso_nombre del JOIN.
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, Entrega, EntregaPayload } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapEntrega(e: any): Entrega {
  return {
    id: e.id_entrega ?? e.id,
    estado: e.estado,
    fecha: e.fecha,
    id_familia: e.id_familia ?? 0,
    familia: e.familia_representante ?? e.familia ?? e.representante ?? null,
    detalles: Array.isArray(e.detalles)
      ? e.detalles.map((d: any) => ({
          id_detalle: d.id_detalle,
          id_recurso: d.id_recurso,
          recurso_nombre: d.recurso_nombre,
          unidad: d.unidad,
          cantidad: Number(d.cantidad),
        }))
      : [],
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiGetEntregas(): Promise<ApiResponse<Entrega[]>> {
  const res = await get<any[]>('entregas')
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapEntrega)
  return res as ApiResponse<Entrega[]>
}

export async function apiCreateEntrega(data: EntregaPayload): Promise<ApiResponse<any>> {
  return post<any>('entregas', data)
}

export async function apiUpdateEntregaEstado(id: number, estado: string): Promise<ApiResponse<void>> {
  return put<void>('entregas', id, { estado })
}

export async function apiDeleteEntrega(id: number, motivo?: string): Promise<ApiResponse<void>> {
  return del<void>('entregas', id, motivo)
}

