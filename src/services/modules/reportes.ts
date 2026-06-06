/**
 * modules/reportes.ts — Reportes de trazabilidad origen-destino.
 */
import { get } from '../helpers'
import type { ApiResponse, TrazabilidadItem } from '@/types'

// ─── Reportes ────────────────────────────────────────────────────────────────

export async function apiGetTrazabilidad(): Promise<ApiResponse<TrazabilidadItem[]>> {
  const res = await get<any>('reportes', { action: 'origen-destino' })
  if (res.success) {
    const raw = res.data as any
    res.data = Array.isArray(raw) ? raw : (raw?.data ?? [])
  }
  return res as ApiResponse<TrazabilidadItem[]>
}
