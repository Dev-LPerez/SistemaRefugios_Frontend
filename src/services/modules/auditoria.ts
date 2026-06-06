/**
 * modules/auditoria.ts — Consulta de logs de auditoría.
 *
 * Incluye mapeo inline de los campos del backend (id_log, user, timestamp, etc.)
 * a la interfaz AuditoriaLog.
 */
import { get } from '../helpers'
import type { ApiResponse, AuditoriaLog } from '@/types'

// ─── Auditoría ───────────────────────────────────────────────────────────────

export async function apiGetAuditoria(): Promise<ApiResponse<AuditoriaLog[]>> {
  const res = await get<any[]>('auditoria')
  if (res.success && Array.isArray(res.data)) {
    res.data = res.data.map((l: any) => ({
      id: l.id_log ?? l.id,
      usuario: l.username ?? l.user ?? l.usuario ?? 'Sistema',
      rol: l.rol ?? '',
      accion: l.accion ?? l.method ?? '',
      modulo: l.entidad ?? l.modulo ?? '',
      detalle: l.detalle ?? l.ip ?? '',
      fecha: l.timestamp ?? l.fecha ?? '',
    }))
  }
  return res as ApiResponse<AuditoriaLog[]>
}
