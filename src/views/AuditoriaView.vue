<template>
  <AppLayout title="Auditoría">    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div class="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Registro de Auditoría
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Trazabilidad de todas las acciones del sistema</p>
        </div>
        <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm transition-all cursor-pointer">
          <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Actualizar
        </button>
      </div>      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Registros</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ logs.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Módulos</p>
          <p class="text-2xl font-bold text-indigo-600 mt-2">{{ modulosUnicos }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Usuarios</p>
          <p class="text-2xl font-bold text-cyan-600 mt-2">{{ usuariosUnicos }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Acciones Hoy</p>
          <p class="text-2xl font-bold text-indigo-600 mt-2">{{ accionesHoy }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center shadow-md">
        <input v-model="busqueda" type="text" placeholder="Buscar por usuario, módulo o acción..."
          class="flex-1 min-w-40 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-inner"/>
        <select v-model="filtroModulo" class="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-indigo-500 outline-none cursor-pointer">
          <option value="">Todos los módulos</option>
          <option v-for="m in modulos" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 shadow-md">{{ error }}</div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr class="bg-indigo-50/80 border-b border-indigo-200 text-[10px] uppercase tracking-wider text-indigo-800 font-bold">
                <th class="px-4 py-3.5">Usuario</th>
                <th class="px-4 py-3.5 hidden sm:table-cell">Rol</th>
                <th class="px-4 py-3.5">Acción</th>
                <th class="px-4 py-3.5 hidden md:table-cell">Módulo</th>
                <th class="px-4 py-3.5 hidden lg:table-cell">Detalle</th>
                <th class="px-4 py-3.5 hidden sm:table-cell">Fecha</th>
                <th class="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in paginados" :key="log.id" class="odd:bg-white even:bg-indigo-50/20 hover:bg-indigo-100/30 transition-colors">
                <td class="px-4 py-3 border-b border-slate-100/40">
                   <div class="flex items-center gap-2">
                     <div class="w-7 h-7 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-indigo-100">{{ log.usuario?.charAt(0)?.toUpperCase() ?? 'S' }}</div>
                    <span class="font-semibold text-slate-800">{{ log.usuario }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell border-b border-slate-100/40"><span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-semibold border border-slate-200/50">{{ log.rol }}</span></td>
                <td class="px-4 py-3 border-b border-slate-100/40">
                  <span :class="['inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider', accionColor(log.accion)]">{{ log.accion }}</span>
                </td>
                <td class="px-4 py-3 text-slate-505 hidden md:table-cell border-b border-slate-100/40"><span class="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-semibold border border-indigo-100">{{ log.modulo }}</span></td>
                <td class="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell max-w-48 truncate border-b border-slate-100/40">{{ log.detalle }}</td>
                <td class="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell whitespace-nowrap border-b border-slate-100/40">{{ formatFecha(log.fecha) }}</td>
                <td class="px-4 py-3 text-right border-b border-slate-100/40">
                  <button @click="verDetalle(log)" class="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    Ver detalles movimiento
                  </button>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0"><td colspan="7" class="px-4 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">No hay registros de auditoría</td></tr>
            </tbody>
          </table>
        </div>
        <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
      </div>
    </div>

    <!-- Modal Detalle Movimiento -->
    <div v-if="modalDetalleVisible && logSeleccionado" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Detalles del Movimiento
          </h3>
          <button @click="cerrarModalDetalle" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Content -->
        <div class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario / Operador</p>
              <p class="font-bold text-slate-900 mt-0.5">{{ logSeleccionado.usuario }}</p>
              <span class="inline-block px-1.5 py-0.5 bg-slate-200 text-slate-650 rounded text-[9px] font-semibold uppercase tracking-wider mt-1">{{ logSeleccionado.rol }}</span>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Registro</p>
              <p class="font-bold text-slate-900 mt-0.5">{{ formatFecha(logSeleccionado.fecha) }}</p>
              <p class="text-[9px] text-slate-400 mt-1 font-mono">IP: {{ logSeleccionado.ip }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Módulo / Sección</p>
              <span class="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded border border-indigo-200 font-semibold uppercase tracking-wider mt-1">{{ logSeleccionado.modulo }}</span>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Acción Realizada</p>
              <span :class="['inline-block px-2 py-0.5 rounded border font-semibold uppercase tracking-wider mt-1', accionColor(logSeleccionado.accion)]">{{ logSeleccionado.accion }}</span>
            </div>
          </div>

          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Descripción de la Operación</p>
            <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <p class="text-slate-800 font-semibold leading-relaxed">{{ parsedDetails?.prefix || 'Sin descripción adicional' }}</p>
              
              <!-- Parsed JSON grid payload -->
              <div v-if="parsedDetails && parsedDetails.data" class="mt-3 border-t border-slate-200/60 pt-3">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Carga de Datos Enviada:</p>
                <div class="max-h-52 overflow-y-auto font-mono text-[10px] text-slate-700 bg-white border border-slate-200/60 rounded-lg p-2.5 space-y-1.5 shadow-inner">
                  <div v-for="(val, key) in parsedDetails.data" :key="key" class="py-1 border-b border-slate-100 last:border-0 flex justify-between gap-4">
                    <span class="font-bold text-slate-500 uppercase text-[9px] tracking-tight">{{ key }}:</span>
                    <span class="text-right break-all text-slate-800 font-semibold">{{ val === true ? 'Sí' : val === false ? 'No' : val }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
          <button @click="cerrarModalDetalle" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer text-xs">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { apiGetAuditoria, type AuditoriaLog } from '@/services/api'

const logs = ref<AuditoriaLog[]>([])
const loading = ref(true); const error = ref('')
const busqueda = ref(''); const filtroModulo = ref('')
const page = ref(1); const perPage = ref(20)
const today = new Date().toISOString().split('T')[0]

const logSeleccionado = ref<AuditoriaLog | null>(null)
const modalDetalleVisible = ref(false)

function verDetalle(log: AuditoriaLog) {
  logSeleccionado.value = log
  modalDetalleVisible.value = true
}

function cerrarModalDetalle() {
  logSeleccionado.value = null
  modalDetalleVisible.value = false
}

// Procesa el campo de detalles para separar texto introductorio y la carga de datos JSON si existe
const parsedDetails = computed(() => {
  if (!logSeleccionado.value || !logSeleccionado.value.detalle) return null
  
  const raw = logSeleccionado.value.detalle
  const jsonIndex = raw.indexOf('{')
  if (jsonIndex !== -1) {
    try {
      const prefix = raw.substring(0, jsonIndex).trim()
      const jsonStr = raw.substring(jsonIndex)
      const data = JSON.parse(jsonStr)
      return { prefix, data }
    } catch {
      // Ignorar fallo y tratar como texto plano
    }
  }
  return { prefix: raw, data: null }
})

const modulosUnicos = computed(() => new Set(logs.value.map(l => l.modulo)).size)
const usuariosUnicos = computed(() => new Set(logs.value.map(l => l.usuario)).size)
const accionesHoy = computed(() => logs.value.filter(l => l.fecha?.startsWith(today)).length)
const modulos = computed(() => [...new Set(logs.value.map(l => l.modulo))].filter(Boolean).sort())
const filtrados = computed(() => {
  let list = logs.value
  if (filtroModulo.value) list = list.filter(l => l.modulo === filtroModulo.value)
  if (busqueda.value) { const q = busqueda.value.toLowerCase(); list = list.filter(l => (l.usuario ?? '').toLowerCase().includes(q) || (l.accion ?? '').toLowerCase().includes(q) || (l.modulo ?? '').toLowerCase().includes(q) || (l.detalle ?? '').toLowerCase().includes(q)) }
  return list
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

function accionColor(accion: string) {
  const a = accion?.toUpperCase() ?? ''
  if (a.includes('CREATE') || a.includes('POST') || a.includes('INSERT')) return 'bg-green-100 text-green-700 border-green-200'
  if (a.includes('UPDATE') || a.includes('PUT') || a.includes('EDIT')) return 'bg-blue-100 text-blue-700 border-blue-200'
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function formatFecha(fecha: string) {
  if (!fecha) return '—'
  try { return new Date(fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) } catch { return fecha }
}

async function recargar() {
  loading.value = true; error.value = ''
  const res = await apiGetAuditoria()
  if (res.success && res.data) logs.value = res.data; else error.value = res.message ?? 'Error al cargar auditoría'
  loading.value = false
}
onMounted(recargar)
</script>
