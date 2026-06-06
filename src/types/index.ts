/**
 * types/index.ts — Definición centralizada de interfaces TypeScript.
 *
 * Todas las entidades del dominio del Sistema de Refugios están definidas aquí.
 * Los servicios y las vistas importan desde este archivo.
 */

// ─── Usuarios ────────────────────────────────────────────────────────────────

export interface Usuario {
  id: number
  nombre: string
  user: string
  rol: string // Admin | Logistica | Operario | Voluntario | Auditor
}

// ─── Refugios ────────────────────────────────────────────────────────────────

export interface Refugio {
  id: number
  nombre: string
  direccion: string
  capacidad_maxima: number
  ocupacion_actual: number
  estado: 'activo' | 'inactivo'
}

// ─── Familias ────────────────────────────────────────────────────────────────

export interface Familia {
  id: number
  cedula: string
  representante: string
  telefono: string
  direccion: string
  cantidad_miembros: number
  prioridad: number
  id_refugio: number
  ubicacion_actual: string
  aceptacion_habeas_data: boolean
}

// ─── Miembros de Familia ─────────────────────────────────────────────────────

export interface MiembroFamilia {
  id: number
  familia_id: number
  nombre: string
  edad?: number
  tipo_documento: string
  numero_documento: string
  parentezco: string
  es_embarazada: boolean
  tiene_discapacidad: boolean
  enfermedad_cronica: boolean
  vulnerable: boolean
  tipo_vulnerabilidad: string
}

// ─── Recursos (Inventario) ───────────────────────────────────────────────────

export interface Recurso {
  id: number
  nombre: string
  tipo: string
  unidad: string
  cantidad_disponible: number
}

// ─── Donantes ────────────────────────────────────────────────────────────────

export interface Donante {
  id: number
  identificacion: string
  nombre: string
  tipo: string
  telefono: string
}

// ─── Donaciones ──────────────────────────────────────────────────────────────

export interface Donacion {
  id: number
  fecha: string
  descripcion: string
  id_donante: number
  origen: string
  categoria: string
  donante?: string // nombre del donante (join)
}

export interface DetalleDonacion {
  id_donacion: number
  id_recurso: number
  cantidad: number
}

// ─── Entregas ────────────────────────────────────────────────────────────────

export interface EntregaDetalle {
  id_detalle: number
  id_recurso: number
  recurso_nombre: string
  unidad: string
  cantidad: number
}

export interface Entrega {
  id: number
  estado: string
  fecha: string
  id_familia: number
  familia?: string  // join
  detalles: EntregaDetalle[]
}


export interface EntregaPayload {
  estado: string
  fecha: string
  id_familia: number
  recursos: {
    id_recurso: number
    cantidad: number
  }[]
}


// ─── Gestiones ───────────────────────────────────────────────────────────────

export interface Gestion {
  id: number
  id_usuario: number
  id_recurso: number
  accion: string
}

// ─── Dashboard / Reportes ────────────────────────────────────────────────────

export interface DashboardStats {
  total_familias_registradas: number
  total_personas_damnificadas: number
  total_entregas_completadas: number
  total_unidades_kg_almacen: number
  recursos_alertas_stock: { nombre: string; cantidad_disponible: number; unidad: string }[]
  // aliases para compatibilidad con el template del dashboard:
  total_familias?: number
  total_refugios?: number
  total_recursos?: number
  total_donantes?: number
  refugios_activos?: number
  familias_atendidas?: number
  entregas_hoy?: number
  recursos_criticos?: number
}

export interface TrazabilidadItem {
  id_entrega: number
  fecha_entrega: string
  recurso: string
  cantidad_entregada: number
  familia_receptora: string
  ubicacion_receptora: string
  posibles_origenes: string
}

// ─── Priorización ────────────────────────────────────────────────────────────

export interface PriorizacionItem {
  id_familia: number
  representante: string
  ubicacion: string
  miembros: number
  puntaje_prioridad: number
  raciones_necesarias: { dias_cobertura: number; agua_litros: number; alimentos_kilos: number }
}

// ─── Auditoría ───────────────────────────────────────────────────────────────

export interface AuditoriaLog {
  id: number
  usuario: string
  rol: string
  accion: string
  modulo: string
  detalle: string
  ip: string
  fecha: string
}

// ─── Respuesta genérica de la API ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}
