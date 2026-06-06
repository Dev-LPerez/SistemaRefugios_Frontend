/**
 * modules/dashboard.ts — Estadísticas del dashboard.
 *
 * Incluye el mapeo de nombres del backend a los esperados por los templates.
 */
import { get } from '../helpers'
import type { ApiResponse, DashboardStats } from '@/types'

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function apiGetDashboard(): Promise<ApiResponse<DashboardStats>> {
  const res = await get<DashboardStats>('reportes', { action: 'dashboard' })
  if (res.success && res.data) {
    // Mapear nombres del backend a los esperados por los templates
    const d = res.data as any
    res.data = {
      ...d,
      total_familias: d.total_familias_registradas ?? 0,
      total_personas: d.total_personas_damnificadas ?? 0,
      total_refugios: 0,
      total_recursos: 0,
      total_donantes: 0,
      refugios_activos: 0,
      familias_atendidas: d.total_familias_registradas ?? 0,
      entregas_hoy: d.total_entregas_completadas ?? 0,
      recursos_criticos: d.recursos_alertas_stock?.length ?? 0,
    }
  }
  return res
}
