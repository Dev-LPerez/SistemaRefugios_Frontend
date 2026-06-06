/**
 * modules/gestiones.ts — Gestiones de recursos.
 */
import { get, post } from '../helpers'
import type { ApiResponse, Gestion } from '@/types'

// ─── Gestiones ───────────────────────────────────────────────────────────────

export async function apiGetGestiones(): Promise<ApiResponse<Gestion[]>> {
  return get<Gestion[]>('gestiones')
}

export async function apiCreateGestion(data: Omit<Gestion, 'id'>): Promise<ApiResponse<Gestion>> {
  return post<Gestion>('gestiones', data)
}
