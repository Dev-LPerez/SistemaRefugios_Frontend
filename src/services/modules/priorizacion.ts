/**
 * modules/priorizacion.ts — Consultas de priorización de familias.
 *
 * Incluye apiGetFamiliasPriorizadas que convierte PriorizacionItem[] → Familia[]
 * para compatibilidad con FamiliasView.
 */
import { get } from '../helpers'
import type { ApiResponse, PriorizacionItem, Familia } from '@/types'

// ─── Priorización ────────────────────────────────────────────────────────────

export async function apiGetPriorizacion(): Promise<ApiResponse<PriorizacionItem[]>> {
  const res = await get<any>('priorizacion', { action: 'despachos' })
  if (res.success) {
    const raw = res.data as any
    res.data = Array.isArray(raw) ? raw : (raw?.data ?? [])
  }
  return res as ApiResponse<PriorizacionItem[]>
}

export async function apiGetPriorizacionFamilia(id_familia: number): Promise<ApiResponse<PriorizacionItem>> {
  return get<PriorizacionItem>('priorizacion', { id_familia })
}

// ─── Compatibilidad con FamiliasView (espera Familia[]) ──────────────────────

export async function apiGetFamiliasPriorizadas(): Promise<ApiResponse<Familia[]>> {
  const res = await apiGetPriorizacion()
  if (res.success && res.data) {
    const familias: Familia[] = (res.data as PriorizacionItem[]).map(p => ({
      id: p.id_familia,
      cedula: '',
      representante: p.representante,
      telefono: '',
      direccion: '',
      cantidad_miembros: p.miembros,
      prioridad: p.puntaje_prioridad,
      id_refugio: 0,
      ubicacion_actual: p.ubicacion,
      aceptacion_habeas_data: false,
    }))
    return { success: true, data: familias }
  }
  return { success: false, message: res.message }
}
