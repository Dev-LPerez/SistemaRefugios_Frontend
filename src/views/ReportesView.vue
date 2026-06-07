<template>
  <AppLayout title="Reportes">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Reportes y Trazabilidad
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Seguimiento del flujo de recursos hasta las familias</p>
        </div>
        <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm transition-all cursor-pointer">
          <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Actualizar
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-slate-50/50 group-hover:bg-slate-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider z-10">Registros</p>
          <p class="text-2xl font-bold text-slate-900 mt-2 z-10">{{ trazabilidad.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-indigo-50/50 group-hover:bg-indigo-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider z-10">Recursos Distribuidos</p>
          <p class="text-2xl font-bold text-indigo-600 mt-2 z-10">{{ recursosDistribuidos }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md col-span-2 sm:col-span-1">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-cyan-50/50 group-hover:bg-cyan-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider z-10">Familias Beneficiadas</p>
          <p class="text-2xl font-bold text-cyan-600 mt-2 z-10">{{ familiasBeneficiadas }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
        <input v-model="busqueda" type="text" placeholder="Buscar por recurso, familia o ubicación..."
          class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-inner"/>
      </div>

      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 shadow-md">{{ error }}</div>

      <!-- Table -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else-if="trazabilidad.length === 0 && !error" class="py-16 flex flex-col items-center gap-3 text-slate-400">
          <svg class="w-12 h-12 opacity-30 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <p class="text-sm font-semibold uppercase tracking-wider text-slate-500 text-xs">No hay datos de trazabilidad disponibles</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-indigo-50/80 border-b border-indigo-200 text-[10px] uppercase tracking-wider text-indigo-800 font-bold animate-[fadeIn_0.3s_ease-out]">
                <th class="px-5 py-3.5">#</th>
                <th class="px-5 py-3.5">Recurso</th>
                <th class="px-5 py-3.5 text-center">Cantidad</th>
                <th class="px-5 py-3.5 hidden sm:table-cell">Familia Receptora</th>
                <th class="px-5 py-3.5 hidden md:table-cell">Ubicación</th>
                <th class="px-5 py-3.5 hidden lg:table-cell">Posibles Orígenes</th>
                <th class="px-5 py-3.5 hidden sm:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-700">
              <tr v-for="item in paginados" :key="item.id_entrega" class="odd:bg-white even:bg-indigo-50/20 hover:bg-indigo-100/30 transition-colors">
                <td class="px-5 py-4 text-slate-400 border-b border-slate-100/40"><span class="font-semibold bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded text-[10px]">#{{ item.id_entrega }}</span></td>
                <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ item.recurso }}</td>
                <td class="px-5 py-4 text-center font-bold text-slate-800 border-b border-slate-100/40">{{ item.cantidad_entregada }}</td>
                <td class="px-5 py-4 text-slate-600 hidden sm:table-cell border-b border-slate-100/40">{{ item.familia_receptora }}</td>
                <td class="px-5 py-4 text-slate-500 text-xs hidden md:table-cell max-w-32 truncate border-b border-slate-100/40">{{ item.ubicacion_receptora }}</td>
                <td class="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell max-w-40 truncate border-b border-slate-100/40">{{ item.posibles_origenes }}</td>
                <td class="px-5 py-4 text-slate-400 hidden sm:table-cell border-b border-slate-100/40">{{ item.fecha_entrega }}</td>
              </tr>
              <tr v-if="filtrados.length === 0 && trazabilidad.length > 0"><td colspan="7" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">No hay resultados para la búsqueda</td></tr>
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

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
