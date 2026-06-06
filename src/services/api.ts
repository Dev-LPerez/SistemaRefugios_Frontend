/**
 * api.ts — Punto de entrada retrocompatible.
 *
 * Re-exporta todos los tipos desde @/types y todas las funciones API
 * desde los módulos individuales en ./modules/.
 *
 * Las vistas existentes que importan desde '@/services/api' siguen
 * funcionando sin cambios.
 */

// ─── Re-exportar todos los tipos ─────────────────────────────────────────────
export type {
  Usuario,
  Refugio,
  Familia,
  MiembroFamilia,
  Recurso,
  Donante,
  Donacion,
  DetalleDonacion,
  Entrega,
  Gestion,
  DashboardStats,
  TrazabilidadItem,
  PriorizacionItem,
  AuditoriaLog,
  ApiResponse,
} from '@/types'

// ─── Re-exportar todas las funciones API ─────────────────────────────────────
export {
  // Auth
  apiLogin,
  apiLogout,
  // Usuarios
  apiGetUsuarios,
  apiCreateUsuario,
  apiUpdateUsuario,
  apiDeleteUsuario,
  // Dashboard
  apiGetDashboard,
  // Refugios
  apiGetRefugios,
  apiCreateRefugio,
  apiUpdateRefugio,
  apiDeleteRefugio,
  // Familias
  apiGetFamilias,
  apiCreateFamilia,
  apiUpdateFamilia,
  apiDeleteFamilia,
  // Miembros
  apiGetMiembros,
  apiGetTodosMiembros,
  apiCreateMiembro,
  apiUpdateMiembro,
  apiDeleteMiembro,
  // Recursos
  apiGetRecursos,
  apiCreateRecurso,
  apiUpdateRecurso,
  apiDeleteRecurso,
  // Donantes
  apiGetDonantes,
  apiCreateDonante,
  apiUpdateDonante,
  apiDeleteDonante,
  // Donaciones
  apiGetDonaciones,
  apiCreateDonacion,
  apiUpdateDonacion,
  apiDeleteDonacion,
  apiAgregarDetalleDonacion,
  // Entregas
  apiGetEntregas,
  apiCreateEntrega,
  apiUpdateEntregaEstado,
  apiDeleteEntrega,
  // Gestiones
  apiGetGestiones,
  apiCreateGestion,
  // Priorización
  apiGetPriorizacion,
  apiGetPriorizacionFamilia,
  apiGetFamiliasPriorizadas,
  // Reportes
  apiGetTrazabilidad,
  // Auditoría
  apiGetAuditoria,
} from './modules'

// ─── Aliases "mock" — las vistas existentes no necesitan cambios ──────────────
import {
  apiLogin as _apiLogin,
  apiGetDashboard as _apiGetDashboard,
  apiGetRefugios as _apiGetRefugios,
  apiGetFamilias as _apiGetFamilias,
  apiGetMiembros as _apiGetMiembros,
  apiGetRecursos as _apiGetRecursos,
  apiGetFamiliasPriorizadas as _apiGetFamiliasPriorizadas,
  apiGetAuditoria as _apiGetAuditoria,
} from './modules'

export const mockLogin                  = _apiLogin
export const mockGetDashboard           = _apiGetDashboard
export const mockGetRefugios            = _apiGetRefugios
export const mockGetFamilias            = _apiGetFamilias
export const mockGetMiembros            = _apiGetMiembros
export const mockGetRecursos            = _apiGetRecursos
export const mockGetFamiliasPriorizadas = _apiGetFamiliasPriorizadas
export const mockGetAuditoria           = _apiGetAuditoria
