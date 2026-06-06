<template>
  <AppLayout title="Priorización">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Motor de Priorización</h1>
          <p class="text-sm text-slate-500 mt-0.5">Familias ordenadas por puntaje de vulnerabilidad</p>
        </div>
        <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors">
          <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Actualizar
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Familias Evaluadas</p><p class="text-2xl font-bold text-slate-800">{{ lista.length }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Alta Prioridad (≥80)</p><p class="text-2xl font-bold text-red-600">{{ altaPrioridad }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200 col-span-2 sm:col-span-1"><p class="text-xs text-slate-500 mb-1">Puntaje Promedio</p><p class="text-2xl font-bold text-blue-600">{{ promedio }}</p></div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar familia..."
          class="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-400"/>
        <div class="flex gap-2">
          <button @click="filtro=''" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtro==='' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600']">Todos</button>
          <button @click="filtro='alta'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtro==='alta' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600']">Alta ≥80</button>
          <button @click="filtro='media'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtro==='media' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600']">Media 50–79</button>
          <button @click="filtro='baja'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtro==='baja' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600']">Baja &lt;50</button>
        </div>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Representante</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Ubicación</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Miembros</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Puntaje</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Prioridad</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Raciones (3 días)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(item, index) in paginados" :key="item.id_familia" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-center">
                  <span :class="['inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold', index + (page-1)*perPage < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600']">
                    {{ index + (page-1)*perPage + 1 }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium text-slate-800">{{ item.representante }}</td>
                <td class="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell max-w-40 truncate">{{ item.ubicacion }}</td>
                <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{{ item.miembros }}</span></td>
                <td class="px-4 py-3 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span class="font-bold text-base" :class="item.puntaje_prioridad >= 80 ? 'text-red-600' : item.puntaje_prioridad >= 50 ? 'text-amber-600' : 'text-green-600'">{{ item.puntaje_prioridad }}</span>
                    <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div :class="['h-full rounded-full', item.puntaje_prioridad >= 80 ? 'bg-red-500' : item.puntaje_prioridad >= 50 ? 'bg-amber-500' : 'bg-green-500']" :style="{ width: Math.min(item.puntaje_prioridad, 100) + '%' }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-center hidden md:table-cell">
                  <span :class="['inline-block px-2 py-0.5 rounded-full text-xs font-medium', item.puntaje_prioridad >= 80 ? 'bg-red-100 text-red-700' : item.puntaje_prioridad >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700']">
                    {{ item.puntaje_prioridad >= 80 ? 'Alta' : item.puntaje_prioridad >= 50 ? 'Media' : 'Baja' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">
                  <span v-if="item.raciones_necesarias">
                    💧 {{ item.raciones_necesarias.agua_litros }}L · 🍚 {{ item.raciones_necesarias.alimentos_kilos }}kg
                  </span>
                  <span v-else>—</span>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0"><td colspan="7" class="px-4 py-12 text-center text-slate-400 text-sm">No hay familias priorizadas</td></tr>
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
