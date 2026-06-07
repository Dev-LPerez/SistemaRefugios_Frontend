<template>
  <AppLayout title="Reportes">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out] print:hidden">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Reportes y Trazabilidad
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Seguimiento del flujo de recursos hasta las familias</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="exportarPDF" :disabled="loading || trazabilidad.length === 0" class="inline-flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm transition-all cursor-pointer">
            <svg class="w-4.5 h-4.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.476-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-14.326 0C3.768 7.28 3 8.214 3 9.296v6.454a2.25 2.25 0 0 0 2.25 2.25h1.091M9 10.125h6M9 13h6"/></svg>
            Exportar PDF
          </button>
          <button @click="recargar" :disabled="loading" class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm transition-all cursor-pointer">
            <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Actualizar
          </button>
        </div>
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

    <!-- Contenedor Oficial de Impresión PDF -->
    <div class="hidden print:block print-report font-sans text-slate-900 p-2 space-y-6">
      <!-- Cabecera Oficial -->
      <div class="flex items-center justify-between print-header">
        <div>
          <h1 class="text-base font-black uppercase tracking-wider text-slate-900">Alivio Humanitario Montería</h1>
          <p class="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Reporte Oficial de Trazabilidad y Distribución</p>
        </div>
        <div class="text-right text-[9px] text-slate-500 font-semibold space-y-0.5">
          <div>Fecha de Emisión: {{ new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
          <div>Operador: {{ authStore.user?.nombre || 'Usuario Autorizado' }}</div>
          <div>Rol: {{ authStore.user?.rol || 'Operador' }}</div>
        </div>
      </div>

      <!-- Resumen de Métricas -->
      <div class="grid grid-cols-3 gap-4 border border-slate-350 rounded-xl p-3 bg-slate-50">
        <div class="text-center">
          <div class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Total Despachos</div>
          <div class="text-base font-black text-slate-800 mt-1">{{ filtrados.length }}</div>
        </div>
        <div class="text-center border-x border-slate-350">
          <div class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Recursos Distribuidos</div>
          <div class="text-base font-black text-indigo-700 mt-1">{{ recursosDistribuidos }}</div>
        </div>
        <div class="text-center">
          <div class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Familias Beneficiadas</div>
          <div class="text-base font-black text-cyan-700 mt-1">{{ familiasBeneficiadas }}</div>
        </div>
      </div>

      <!-- Tabla de Trazabilidad Completa -->
      <table class="w-full text-left text-[9px] border-collapse">
        <thead>
          <tr class="border-b-2 border-slate-900 bg-slate-100 font-bold uppercase tracking-wider text-slate-800">
            <th class="px-2 py-2 w-16">Despacho</th>
            <th class="px-2 py-2">Recurso</th>
            <th class="px-2 py-2 text-center w-16">Cant.</th>
            <th class="px-2 py-2">Familia Receptora</th>
            <th class="px-2 py-2">Ubicación</th>
            <th class="px-2 py-2">Posibles Orígenes</th>
            <th class="px-2 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtrados" :key="item.id_entrega" class="border-b border-slate-200">
            <td class="px-2 py-2 font-bold text-slate-500">#{{ item.id_entrega }}</td>
            <td class="px-2 py-2 font-semibold text-slate-900">{{ item.recurso }}</td>
            <td class="px-2 py-2 text-center font-bold text-slate-800">{{ item.cantidad_entregada }}</td>
            <td class="px-2 py-2 text-slate-750 font-medium">{{ item.familia_receptora }}</td>
            <td class="px-2 py-2 text-slate-600 truncate max-w-40">{{ item.ubicacion_receptora }}</td>
            <td class="px-2 py-2 text-slate-500 truncate max-w-40">{{ item.posibles_origenes }}</td>
            <td class="px-2 py-2 text-slate-500 font-mono">{{ item.fecha_entrega }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Firmas de Validación Oficial -->
      <div class="pt-16 grid grid-cols-2 gap-12">
        <div class="text-center space-y-1">
          <div class="border-t border-slate-400 w-44 mx-auto"></div>
          <div class="text-[8px] font-bold uppercase tracking-wider text-slate-700">Firma Responsable de Almacén</div>
          <div class="text-[7px] text-slate-400">Consola de Logística y Trazabilidad</div>
        </div>
        <div class="text-center space-y-1">
          <div class="border-t border-slate-400 w-44 mx-auto"></div>
          <div class="text-[8px] font-bold uppercase tracking-wider text-slate-700">Firma Interventor de Emergencia</div>
          <div class="text-[7px] text-slate-400">Control de Entregas y Alivio Humanitario</div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useAuthStore } from '@/stores/auth'
import { apiGetTrazabilidad, type TrazabilidadItem } from '@/services/api'

const authStore = useAuthStore()

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

function exportarPDF() {
  window.print()
}
onMounted(recargar)
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media print {
  /* Habilitar colores de fondo de impresión */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-shadow: none !important;
  }

  @page {
    size: letter portrait;
    margin: 15mm 15mm 20mm 15mm;
  }

  /* Ocultar el resto del sitio web por completo */
  body * {
    visibility: hidden;
    background: transparent !important;
  }

  /* Mostrar solo el reporte */
  .print-report,
  .print-report * {
    visibility: visible;
  }

  /* Posicionar el reporte para que ocupe toda la página */
  .print-report {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    display: block !important;
    background: white !important;
    color: #0f172a !important; /* Slate 900 */
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  }

  /* Estilos del reporte impreso */
  .print-header {
    border-bottom: 2px solid #334155 !important; /* Slate 700 */
    padding-bottom: 12px;
    margin-bottom: 24px;
  }

  .print-report table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 16px;
  }

  .print-report th {
    background-color: #f1f5f9 !important; /* Slate 100 */
    border-bottom: 2px solid #475569 !important; /* Slate 600 */
    color: #1e293b !important; /* Slate 800 */
    font-weight: 700 !important;
    padding: 6px 8px !important;
    text-transform: uppercase;
    font-size: 8px !important;
  }

  .print-report td {
    border-bottom: 1px solid #e2e8f0 !important; /* Slate 200 */
    padding: 6px 8px !important;
    font-size: 8px !important;
    color: #334155 !important; /* Slate 700 */
  }

  .print-report tr {
    page-break-inside: avoid;
  }
}
</style>
