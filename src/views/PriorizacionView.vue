<template>
  <AppLayout title="Priorización">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Motor de Priorización
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Familias ordenadas por puntaje de vulnerabilidad</p>
        </div>
        <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm transition-all cursor-pointer">
          <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Actualizar
        </button>
      </div>

      <!-- Stats --      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Familias Evaluadas</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ lista.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-sans">Alta Prioridad (≥80)</p>
          <p class="text-2xl font-bold text-rose-600 mt-2">{{ altaPrioridad }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md col-span-2 sm:col-span-1">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Puntaje Promedio</p>
          <p class="text-2xl font-bold text-emerald-600 mt-2">{{ promedio }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
        <div class="flex-1 min-w-[240px]">
          <input v-model="busqueda" type="text" placeholder="Buscar familia..."
            class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
        </div>
        <div class="flex gap-1.5 text-[10px] uppercase tracking-wider flex-wrap font-semibold">
          <button @click="filtro=''" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtro==='' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Todos</button>
          <button @click="filtro='alta'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtro==='alta' ? 'bg-rose-50 border-rose-250 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Alta ≥80</button>
          <button @click="filtro='media'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtro==='media' ? 'bg-amber-50 border-amber-250 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Media 50–79</button>
          <button @click="filtro='baja'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtro==='baja' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Baja &lt;50</button>
        </div>
      </div>

      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 shadow-md">{{ error }}</div>

      <!-- Table -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                <th class="px-5 py-3.5 text-center">Posición</th>
                <th class="px-5 py-3.5">Representante</th>
                <th class="px-5 py-3.5 hidden sm:table-cell">Ubicación</th>
                <th class="px-5 py-3.5 text-center">Miembros</th>
                <th class="px-5 py-3.5 text-center">Puntaje</th>
                <th class="px-5 py-3.5 text-center hidden md:table-cell">Prioridad</th>
                <th class="px-5 py-3.5 hidden lg:table-cell">Raciones Necesarias (3 días)</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-700">
              <tr v-for="(item, index) in paginados" :key="item.id_familia" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                <td class="px-5 py-4 text-center border-b border-slate-100/40">
                  <span :class="['inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border', index + (page-1)*perPage < 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200']">
                    {{ index + (page-1)*perPage + 1 }}
                  </span>
                </td>
                <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ item.representante }}</td>
                <td class="px-5 py-4 text-slate-500 hidden sm:table-cell max-w-40 truncate border-b border-slate-100/40">{{ item.ubicacion }}</td>
                <td class="px-5 py-4 text-center border-b border-slate-100/40">
                  <span class="inline-flex items-center justify-center w-7 h-7 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-xs font-bold">{{ item.miembros }}</span>
                </td>
                <td class="px-5 py-4 border-b border-slate-100/40">
                  <div class="flex flex-col items-center gap-1.5">
                    <span class="font-bold text-sm" :class="item.puntaje_prioridad >= 80 ? 'text-rose-600' : item.puntaje_prioridad >= 50 ? 'text-amber-600' : 'text-emerald-600'">{{ item.puntaje_prioridad }}</span>
                    <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div :class="['h-full rounded-full', item.puntaje_prioridad >= 80 ? 'bg-rose-500' : item.puntaje_prioridad >= 50 ? 'bg-amber-500' : 'bg-emerald-600']" :style="{ width: Math.min(item.puntaje_prioridad, 100) + '%' }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 text-center hidden md:table-cell border-b border-slate-100/40">
                  <span :class="['inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider border-slate-200', item.puntaje_prioridad >= 80 ? 'bg-rose-50 text-rose-700 border-rose-250 bg-rose-50/60' : item.puntaje_prioridad >= 50 ? 'bg-amber-50 text-amber-700 border-amber-250 bg-amber-50/60' : 'bg-emerald-50 text-emerald-700 border-emerald-250 bg-emerald-50/60']">
                    {{ item.puntaje_prioridad >= 80 ? 'Alta' : item.puntaje_prioridad >= 50 ? 'Media' : 'Baja' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-xs text-slate-505 hidden lg:table-cell border-b border-slate-100/40">
                  <span v-if="item.raciones_necesarias" class="font-medium">
                    💧 {{ item.raciones_necesarias.agua_litros }}L · 🍚 {{ item.raciones_necesarias.alimentos_kilos }}kg
                  </span>
                  <span v-else>—</span>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0"><td colspan="7" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">No hay familias priorizadas</td></tr>
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
import { apiGetPriorizacion, type PriorizacionItem } from '@/services/api'

const lista = ref<PriorizacionItem[]>([])
const loading = ref(true); const error = ref('')
const busqueda = ref(''); const filtro = ref('')
const page = ref(1); const perPage = ref(20)

const altaPrioridad = computed(() => lista.value.filter(i => i.puntaje_prioridad >= 80).length)
const promedio = computed(() => lista.value.length ? Math.round(lista.value.reduce((a, i) => a + i.puntaje_prioridad, 0) / lista.value.length) : 0)
const filtrados = computed(() => {
  let list = lista.value
  if (filtro.value === 'alta') list = list.filter(i => i.puntaje_prioridad >= 80)
  else if (filtro.value === 'media') list = list.filter(i => i.puntaje_prioridad >= 50 && i.puntaje_prioridad < 80)
  else if (filtro.value === 'baja') list = list.filter(i => i.puntaje_prioridad < 50)
  if (busqueda.value) { const q = busqueda.value.toLowerCase(); list = list.filter(i => i.representante.toLowerCase().includes(q) || i.ubicacion.toLowerCase().includes(q)) }
  return list
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

async function recargar() {
  loading.value = true; error.value = ''
  const res = await apiGetPriorizacion()
  if (res.success && res.data) lista.value = res.data; else error.value = res.message ?? 'Error al cargar priorización'
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
