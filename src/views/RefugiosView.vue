<template>
  <AppLayout title="Refugios">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Gestión de Refugios
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Albergues temporales de emergencia activos e inactivos</p>
        </div>
        <button @click="abrirModal()" class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-sm transition-all cursor-pointer">
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Refugio
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Refugios</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ refugios.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Activos</p>
          <p class="text-2xl font-bold text-emerald-600 mt-2">{{ refugiosActivos }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-cyan-50/50 group-hover:bg-cyan-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Personas Alojadas</p>
          <p class="text-2xl font-bold text-cyan-600 mt-2">{{ totalOcupacion }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-slate-50 group-hover:bg-slate-100 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Capacidad Total</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ totalCapacidad }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
        <div class="flex-1 min-w-[280px]">
          <input v-model="busqueda" type="text" placeholder="Buscar por nombre o dirección..."
            class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
        </div>
        <div class="flex gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
          <button @click="filtroEstado = ''" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado === '' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Todos</button>
          <button @click="filtroEstado = 'activo'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado === 'activo' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Activos</button>
          <button @click="filtroEstado = 'inactivo'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado === 'inactivo' ? 'bg-rose-50 border-rose-250 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Inactivos</button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 shadow-md">{{ error }}</div>

      <!-- Table -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        <div v-if="loading" class="flex justify-center py-16">
          <svg class="animate-spin h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                <th class="px-5 py-3.5">Nombre</th>
                <th class="px-5 py-3.5 hidden sm:table-cell">Dirección</th>
                <th class="px-5 py-3.5 text-center">Ocupación / Capacidad</th>
                <th class="px-5 py-3.5 text-center">Estado</th>
                <th class="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-700">
              <tr v-for="r in paginados" :key="r.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ r.nombre }}</td>
                <td class="px-5 py-4 text-slate-500 hidden sm:table-cell max-w-48 truncate border-b border-slate-100/40">{{ r.direccion }}</td>
                <td class="px-5 py-4 border-b border-slate-100/40">
                  <div class="flex flex-col items-center gap-1.5 min-w-[180px] max-w-xs mx-auto">
                    <div class="flex justify-between w-full text-[10px] text-slate-500 uppercase font-semibold">
                      <span>{{ ocupacionReal(r.id) }} / {{ r.capacidad_maxima }} ALOJADOS</span>
                      <span>{{ pct(r) }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div :class="['h-full rounded-full transition-all duration-500', pct(r) >= 90 ? 'bg-rose-500' : pct(r) >= 70 ? 'bg-amber-500' : 'bg-emerald-600']"
                        :style="{ width: pct(r) + '%' }"></div>
                    </div>
                    <span class="text-[9px] text-slate-400 tracking-wider mt-0.5">{{ labelFamilias(r.id) }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-center border-b border-slate-100/40">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border', r.estado === 'activo' ? 'bg-emerald-55 text-emerald-800 border-emerald-200 bg-emerald-50/60' : 'bg-slate-55 text-slate-500 border-slate-200 bg-slate-50']">
                    <span :class="['w-1 h-1 rounded-full', r.estado === 'activo' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400']"></span>
                    {{ r.estado }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right border-b border-slate-100/40">
                  <div class="flex items-center justify-end gap-1">
                    <button @click="abrirModal(r)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="toggleEstado(r)" :class="['p-2 rounded-lg transition-colors', r.estado === 'activo' ? 'text-slate-400 hover:text-amber-600 hover:bg-slate-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-50']" :title="r.estado === 'activo' ? 'Desactivar' : 'Activar'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                    </button>
                    <button @click="eliminar(r)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0">
                <td colspan="5" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">NO SE ENCONTRARON REGISTROS</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">{{ editando ? 'Editar Refugio' : 'Nuevo Refugio' }}</h2>
          <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Nombre del Refugio *</label>
            <input v-model="form.nombre" type="text" placeholder="Ej: Refugio Norte" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Dirección *</label>
            <input v-model="form.direccion" type="text" placeholder="Calle, barrio..." class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Capacidad Max *</label>
              <input v-model.number="form.capacidad_maxima" type="number" min="1" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Ocupación Inicial</label>
              <input v-model.number="form.ocupacion_actual" type="number" min="0" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Estado Operativo</label>
            <select v-model="form.estado" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div v-if="modalError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">{{ modalError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="cerrarModal" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardar" :disabled="saving" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">
            {{ saving ? 'Procesando...' : 'Confirmar' }}
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
import { apiGetRefugios, apiCreateRefugio, apiUpdateRefugio, apiDeleteRefugio, apiGetFamilias, type Refugio, type Familia } from '@/services/api'

const refugios = ref<Refugio[]>([])
const familias = ref<Familia[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const modalError = ref('')
const busqueda = ref('')
const filtroEstado = ref('')
const page = ref(1)
const perPage = ref(20)
const modalVisible = ref(false)
const editando = ref<Refugio | null>(null)
const form = ref({ nombre: '', direccion: '', capacidad_maxima: 100, ocupacion_actual: 0, estado: 'activo' as 'activo' | 'inactivo' })

// Ocupación real calculada desde familias (el backend no actualiza ocupacion_actual automáticamente)
function ocupacionReal(refugioId: number): number {
  return familias.value
    .filter(f => Number(f.id_refugio) === refugioId)
    .reduce((sum, f) => sum + (f.cantidad_miembros || 0), 0)
}

function labelFamilias(refugioId: number): string {
  const n = familias.value.filter(f => Number(f.id_refugio) === refugioId).length
  if (n === 0) return 'sin familias asignadas'
  return n === 1 ? '1 familia' : `${n} familias`
}

const refugiosActivos = computed(() => refugios.value.filter(r => r.estado === 'activo').length)
const totalOcupacion = computed(() => refugios.value.reduce((a, r) => a + ocupacionReal(r.id), 0))
const totalCapacidad = computed(() => refugios.value.reduce((a, r) => a + r.capacidad_maxima, 0))
const pct = (r: Refugio) => r.capacidad_maxima ? Math.min(100, Math.round((ocupacionReal(r.id) / r.capacidad_maxima) * 100)) : 0

const filtrados = computed(() => {
  let list = refugios.value
  if (filtroEstado.value) list = list.filter(r => r.estado === filtroEstado.value)
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(r => r.nombre.toLowerCase().includes(q) || r.direccion.toLowerCase().includes(q))
  }
  return list
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

onMounted(async () => {
  const [resR, resF] = await Promise.all([apiGetRefugios(), apiGetFamilias()])
  if (resR.success && resR.data) refugios.value = resR.data
  else error.value = resR.message ?? 'Error al cargar refugios'
  if (resF.success && resF.data) familias.value = resF.data
  loading.value = false
})

function abrirModal(r?: Refugio) {
  editando.value = r ?? null
  form.value = r ? { nombre: r.nombre, direccion: r.direccion, capacidad_maxima: r.capacidad_maxima, ocupacion_actual: r.ocupacion_actual, estado: r.estado } : { nombre: '', direccion: '', capacidad_maxima: 100, ocupacion_actual: 0, estado: 'activo' }
  modalError.value = ''
  modalVisible.value = true
}
function cerrarModal() { modalVisible.value = false }

async function guardar() {
  if (!form.value.nombre.trim() || !form.value.direccion.trim()) { modalError.value = 'Nombre y dirección son obligatorios'; return }
  saving.value = true; modalError.value = ''
  try {
    if (editando.value) {
      const res = await apiUpdateRefugio(editando.value.id, form.value)
      if (res.success) { const idx = refugios.value.findIndex(r => r.id === editando.value!.id); if (idx !== -1) refugios.value[idx] = { ...refugios.value[idx], ...form.value } }
      else modalError.value = res.message ?? 'Error al actualizar'
    } else {
      const res = await apiCreateRefugio(form.value)
      if (res.success) { const resList = await apiGetRefugios(); if (resList.success && resList.data) refugios.value = resList.data }
      else modalError.value = res.message ?? 'Error al crear'
    }
    if (!modalError.value) cerrarModal()
  } finally { saving.value = false }
}

async function toggleEstado(r: Refugio) {
  const nuevoEstado = r.estado === 'activo' ? 'inactivo' : 'activo'
  const res = await apiUpdateRefugio(r.id, { ...r, estado: nuevoEstado })
  if (res.success) { const idx = refugios.value.findIndex(x => x.id === r.id); if (idx !== -1) refugios.value[idx].estado = nuevoEstado }
  else error.value = res.message ?? 'Error al actualizar estado'
}

async function eliminar(r: Refugio) {
  const motivo = prompt(`¿Está seguro de eliminar el refugio "${r.nombre}"? Ingrese el motivo de la eliminación:`)
  if (motivo === null) return
  if (!motivo.trim()) {
    alert('El motivo de la eliminación es obligatorio.')
    return
  }
  const res = await apiDeleteRefugio(r.id, motivo.trim())
  if (res.success) refugios.value = refugios.value.filter(x => x.id !== r.id)
  else error.value = res.message ?? 'Error al eliminar'
}
</script>
