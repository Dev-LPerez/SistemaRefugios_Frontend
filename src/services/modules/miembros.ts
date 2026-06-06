/**
 * modules/miembros.ts — CRUD de miembros de familia.
 *
 * Incluye mapMiembro y apiGetTodosMiembros que carga miembros de todas
 * las familias en paralelo (el backend requiere id_familia por consulta).
 */
import { get, post, put, del } from '../helpers'
import type { ApiResponse, MiembroFamilia } from '@/types'

// ─── Mapeo ───────────────────────────────────────────────────────────────────

function mapMiembro(m: any): MiembroFamilia {
  return {
    id: m.id_persona ?? m.id_miembro ?? m.id,
    familia_id: m.id_familia ?? m.familia_id,
    nombre: m.nombre,
    edad: m.edad,
    tipo_documento: m.tipo_documento ?? 'CC',
    numero_documento: m.numero_documento ?? '',
    parentezco: m.parentezco ?? '',
    es_embarazada: Boolean(m.es_embarazada),
    tiene_discapacidad: Boolean(m.tiene_discapacidad),
    enfermedad_cronica: Boolean(m.enfermedad_cronica),
    vulnerable: Boolean(m.vulnerable),
    tipo_vulnerabilidad: m.tipo_vulnerabilidad ?? '',
  }
}

// ─── Consultas ───────────────────────────────────────────────────────────────

/**
 * GET miembros — el backend REQUIERE id_familia, no permite listar todos.
 * Siempre pasar un id_familia válido.
 */
export async function apiGetMiembros(id_familia: number): Promise<ApiResponse<MiembroFamilia[]>> {
  const res = await get<any[]>('familias/miembros', { id_familia })
  if (res.success && Array.isArray(res.data)) res.data = res.data.map(mapMiembro)
  return res as ApiResponse<MiembroFamilia[]>
}

/** Carga los miembros de TODAS las familias en paralelo */
export async function apiGetTodosMiembros(familias: { id: number }[]): Promise<ApiResponse<MiembroFamilia[]>> {
  try {
    const resultados = await Promise.all(
      familias.map(f => apiGetMiembros(f.id))
    )
    const todos: MiembroFamilia[] = resultados
      .filter(r => r.success && Array.isArray(r.data))
      .flatMap(r => r.data as MiembroFamilia[])
    return { success: true, data: todos }
  } catch {
    return { success: false, message: 'Error al cargar miembros' }
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function apiCreateMiembro(data: Omit<MiembroFamilia, 'id'>): Promise<ApiResponse<MiembroFamilia>> {
  // El backend usa id_familia (no familia_id) en el body
  const payload = {
    nombre: data.nombre,
    edad: data.edad,
    parentezco: data.parentezco,
    tipo_documento: data.tipo_documento,
    numero_documento: data.numero_documento,
    vulnerable: data.vulnerable ? 1 : 0,
    tipo_vulnerabilidad: data.tipo_vulnerabilidad,
    id_familia: data.familia_id,            // campo que espera el backend
    es_embarazada: data.es_embarazada ? 1 : 0,
    tiene_discapacidad: data.tiene_discapacidad ? 1 : 0,
    enfermedad_cronica: data.enfermedad_cronica ? 1 : 0,
  }
  return post<MiembroFamilia>('familias/miembros', payload)
}

export async function apiUpdateMiembro(id: number, data: Partial<MiembroFamilia>): Promise<ApiResponse<MiembroFamilia>> {
  const payload = {
    nombre: data.nombre,
    edad: data.edad,
    parentezco: data.parentezco,
    tipo_documento: data.tipo_documento,
    numero_documento: data.numero_documento,
    vulnerable: data.vulnerable ? 1 : 0,
    tipo_vulnerabilidad: data.tipo_vulnerabilidad,
    id_familia: data.familia_id,            // campo que espera el backend
    es_embarazada: data.es_embarazada ? 1 : 0,
    tiene_discapacidad: data.tiene_discapacidad ? 1 : 0,
    enfermedad_cronica: data.enfermedad_cronica ? 1 : 0,
  }
  return put<MiembroFamilia>('familias/miembros', id, payload)
}

export async function apiDeleteMiembro(id: number, motivo?: string): Promise<ApiResponse<void>> {
  return del<void>('familias/miembros', id, motivo)
}
