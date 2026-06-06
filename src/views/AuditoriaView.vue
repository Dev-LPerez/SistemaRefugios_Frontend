<template>
  <AppLayout title="Auditoría">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Registro de Auditoría</h1>
          <p class="text-sm text-slate-500 mt-0.5">Trazabilidad de todas las acciones del sistema</p>
        </div>
        <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors">
          <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Actualizar
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Total Registros</p><p class="text-2xl font-bold text-slate-800">{{ logs.length }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Módulos</p><p class="text-2xl font-bold text-blue-600">{{ modulosUnicos }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Usuarios</p><p class="text-2xl font-bold text-violet-600">{{ usuariosUnicos }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Acciones Hoy</p><p class="text-2xl font-bold text-emerald-600">{{ accionesHoy }}</p></div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar por usuario, módulo o acción..."
          class="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-400"/>
        <select v-model="filtroModulo" class="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-400">
          <option value="">Todos los módulos</option>
          <option v-for="m in modulos" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Usuario</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Rol</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acción</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Módulo</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Detalle</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="log in paginados" :key="log.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{{ log.usuario?.charAt(0)?.toUpperCase() ?? 'S' }}</div>
                    <span class="font-medium text-slate-800">{{ log.usuario }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell"><span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{{ log.rol }}</span></td>
                <td class="px-4 py-3">
                  <span :class="['inline-block px-2 py-0.5 rounded-full text-xs font-medium', accionColor(log.accion)]">{{ log.accion }}</span>
                </td>
                <td class="px-4 py-3 text-slate-500 hidden md:table-cell"><span class="inline-block px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs">{{ log.modulo }}</span></td>
                <td class="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell max-w-48 truncate">{{ log.detalle }}</td>
                <td class="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell whitespace-nowrap">{{ formatFecha(log.fecha) }}</td>
              </tr>
              <tr v-if="filtrados.length === 0"><td colspan="6" class="px-4 py-12 text-center text-slate-400 text-sm">No hay registros de auditoría</td></tr>
            </tbody>
          </table>
        </div>
        <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
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
  if (a.includes('CREATE') || a.includes('POST') || a.includes('INSERT')) return 'bg-green-100 text-green-700'
  if (a.includes('UPDATE') || a.includes('PUT') || a.includes('EDIT')) return 'bg-blue-100 text-blue-700'
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-600'
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
