/**
 * modules/index.ts — Barrel export de todos los módulos de servicio.
 *
 * Re-exporta todas las funciones API para que puedan importarse desde
 * un único punto: import { apiLogin, apiGetRefugios, ... } from '@/services/modules'
 */

export * from './auth'
export * from './usuarios'
export * from './dashboard'
export * from './refugios'
export * from './familias'
export * from './miembros'
export * from './recursos'
export * from './donantes'
export * from './donaciones'
export * from './entregas'
export * from './gestiones'
export * from './priorizacion'
export * from './reportes'
export * from './auditoria'
