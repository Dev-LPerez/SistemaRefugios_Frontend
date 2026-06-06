<template>
  <AppLayout title="Refugios">
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Gestión de Refugios</h1>
          <p class="text-sm text-slate-500 mt-0.5">Albergues temporales activos e inactivos</p>
        </div>
        <button @click="abrirModal()" class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Refugio
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <p class="text-xs text-slate-500 mb-1">Total Refugios</p>
          <p class="text-2xl font-bold text-slate-800">{{ refugios.length }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <p class="text-xs text-slate-500 mb-1">Activos</p>
          <p class="text-2xl font-bold text-green-600">{{ refugiosActivos }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <p class="text-xs text-slate-500 mb-1">Personas Alojadas</p>
          <p class="text-2xl font-bold text-blue-600">{{ totalOcupacion }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <p class="text-xs text-slate-500 mb-1">Capacidad Total</p>
          <p class="text-2xl font-bold text-slate-800">{{ totalCapacidad }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar por nombre o dirección..."
          class="flex-1 min-w-48 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"/>
        <div class="flex gap-2">
          <button @click="filtroEstado = ''" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado === '' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">Todos</button>
          <button @click="filtroEstado = 'activo'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado === 'activo' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">Activos</button>
          <button @click="filtroEstado = 'inactivo'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado === 'inactivo' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">Inactivos</button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div v-if="loading" class="flex justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Dirección</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ocupación</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in paginados" :key="r.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 font-medium text-slate-800">{{ r.nombre }}</td>
                <td class="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell max-w-48 truncate">{{ r.direccion }}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-col items-center gap-1 min-w-24">
                    <span class="text-xs text-slate-500">{{ ocupacionReal(r.id) }} personas / {{ r.capacidad_maxima }} cap.</span>
                    <span class="text-xs text-slate-400">{{ labelFamilias(r.id) }}</span>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div :class="['h-full rounded-full', pct(r) >= 90 ? 'bg-red-500' : pct(r) >= 70 ? 'bg-amber-500' : 'bg-green-500']"
                        :style="{ width: pct(r) + '%' }"></div>
                    </div>
                    <span class="text-xs text-slate-400">{{ pct(r) }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="['inline-block px-2 py-0.5 rounded-full text-xs font-medium', r.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                    {{ r.estado }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button @click="abrirModal(r)" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="toggleEstado(r)" :class="['p-1.5 rounded-lg transition-colors', r.estado === 'activo' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50']" :title="r.estado === 'activo' ? 'Desactivar' : 'Activar'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                    </button>
                    <button @click="eliminar(r)" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0">
                <td colspan="5" class="px-4 py-12 text-center text-slate-400 text-sm">No hay refugios que coincidan</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div class="p-5 border-b border-slate-100"><h2 class="font-bold text-slate-800">{{ editando ? 'Editar Refugio' : 'Nuevo Refugio' }}</h2></div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input v-model="form.nombre" type="text" placeholder="Ej: Refugio Norte" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Dirección *</label>
            <input v-model="form.direccion" type="text" placeholder="Calle, barrio..." class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Capacidad máxima *</label>
              <input v-model.number="form.capacidad_maxima" type="number" min="1" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Ocupación actual</label>
              <input v-model.number="form.ocupacion_actual" type="number" min="0" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select v-model="form.estado" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div v-if="modalError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ modalError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 flex gap-3">
          <button @click="cerrarModal" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="guardar" :disabled="saving" class="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
            {{ saving ? 'Guardando...' : 'Guardar' }}
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
  if (n === 0) return 'Sin familias asignadas'
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
  if (!confirm(`¿Eliminar el refugio "${r.nombre}"?`)) return
  const res = await apiDeleteRefugio(r.id)
  if (res.success) refugios.value = refugios.value.filter(x => x.id !== r.id)
  else error.value = res.message ?? 'Error al eliminar'
}
</script>
