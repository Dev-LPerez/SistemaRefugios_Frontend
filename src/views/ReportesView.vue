<template>
  <AppLayout title="Reportes">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Reportes y Trazabilidad</h1>
          <p class="text-sm text-slate-500 mt-0.5">Seguimiento del flujo de recursos hasta las familias</p>
        </div>
        <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-60 transition-colors">
          <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Actualizar
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Registros</p><p class="text-2xl font-bold text-slate-800">{{ trazabilidad.length }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Recursos Distribuidos</p><p class="text-2xl font-bold text-teal-600">{{ recursosDistribuidos }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200 col-span-2 sm:col-span-1"><p class="text-xs text-slate-500 mb-1">Familias Beneficiadas</p><p class="text-2xl font-bold text-blue-600">{{ familiasBeneficiadas }}</p></div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar por recurso, familia o ubicación..."
          class="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-teal-400"/>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else-if="trazabilidad.length === 0 && !error" class="py-16 flex flex-col items-center gap-3 text-slate-400">
          <svg class="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <p class="text-sm">No hay datos de trazabilidad disponibles</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Recurso</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cantidad</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Familia Receptora</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Ubicación</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Posibles Orígenes</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in paginados" :key="item.id_entrega" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-slate-400 text-xs font-mono">{{ item.id_entrega }}</td>
                <td class="px-4 py-3 font-medium text-slate-800">{{ item.recurso }}</td>
                <td class="px-4 py-3 text-center font-bold text-teal-700">{{ item.cantidad_entregada }}</td>
                <td class="px-4 py-3 text-slate-600 hidden sm:table-cell">{{ item.familia_receptora }}</td>
                <td class="px-4 py-3 text-slate-500 text-xs hidden md:table-cell max-w-32 truncate">{{ item.ubicacion_receptora }}</td>
                <td class="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell max-w-40 truncate">{{ item.posibles_origenes }}</td>
                <td class="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">{{ item.fecha_entrega }}</td>
              </tr>
              <tr v-if="filtrados.length === 0 && trazabilidad.length > 0"><td colspan="7" class="px-4 py-12 text-center text-slate-400 text-sm">No hay resultados para la búsqueda</td></tr>
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
import { apiGetTrazabilidad, type TrazabilidadItem } from '@/services/api'

const trazabilidad = ref<TrazabilidadItem[]>([])
const loading = ref(true); const error = ref('')
const busqueda = ref('')
const page = ref(1); const perPage = ref(20)

const recursosDistribuidos = computed(() => new Set(trazabilidad.value.map(t => t.recurso)).size)
const familiasBeneficiadas = computed(() => new Set(trazabilidad.value.map(t => t.familia_receptora)).size)
const filtrados = computed(() => {
  if (!busqueda.value) return trazabilidad.value
  const q = busqueda.value.toLowerCase()
  return trazabilidad.value.filter(t => t.recurso.toLowerCase().includes(q) || t.familia_receptora.toLowerCase().includes(q) || (t.ubicacion_receptora ?? '').toLowerCase().includes(q))
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

async function recargar() {
  loading.value = true; error.value = ''
  const res = await apiGetTrazabilidad()
  if (res.success && res.data) trazabilidad.value = res.data; else error.value = res.message ?? 'Error al cargar trazabilidad'
  loading.value = false
}
onMounted(recargar)
</script>
