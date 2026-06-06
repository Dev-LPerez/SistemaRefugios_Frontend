<template>
  <AppLayout title="Recursos">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Gestión de Recursos</h1>
          <p class="text-sm text-slate-500 mt-0.5">Inventario del almacén de ayuda humanitaria</p>
        </div>
        <button v-if="authStore.canManageRecursos" @click="abrirModal()" class="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Recurso
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Total Recursos</p><p class="text-2xl font-bold text-slate-800">{{ recursos.length }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Stock Crítico</p><p class="text-2xl font-bold text-red-500">{{ stockCritico }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Tipos</p><p class="text-2xl font-bold text-violet-600">{{ tiposUnicos }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Unidades Totales</p><p class="text-2xl font-bold text-blue-600">{{ totalUnidades }}</p></div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar por nombre o tipo..."
          class="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-violet-400"/>
        <select v-model="filtroTipo" class="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-violet-400">
          <option value="">Todos los tipos</option>
          <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
        </select>
        <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input v-model="soloCriticos" type="checkbox" class="w-4 h-4 text-red-500 rounded"/>
          Solo críticos
        </label>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div v-if="loading" class="flex justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Tipo</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cantidad</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Unidad</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th v-if="authStore.canManageRecursos" class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in paginados" :key="r.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 font-medium text-slate-800">{{ r.nombre }}</td>
                <td class="px-4 py-3 hidden sm:table-cell"><span class="inline-block px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{{ r.tipo }}</span></td>
                <td class="px-4 py-3 text-center font-bold" :class="r.cantidad_disponible <= 10 ? 'text-red-600' : r.cantidad_disponible <= 50 ? 'text-amber-600' : 'text-slate-800'">{{ r.cantidad_disponible }}</td>
                <td class="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">{{ r.unidad }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="['inline-block px-2 py-0.5 rounded-full text-xs font-medium', r.cantidad_disponible <= 10 ? 'bg-red-100 text-red-700' : r.cantidad_disponible <= 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700']">
                    {{ r.cantidad_disponible <= 10 ? 'Crítico' : r.cantidad_disponible <= 50 ? 'Bajo' : 'Normal' }}
                  </span>
                </td>
                <td v-if="authStore.canManageRecursos" class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button @click="abrirModal(r)" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button @click="eliminar(r)" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0"><td :colspan="authStore.canManageRecursos ? 6 : 5" class="px-4 py-12 text-center text-slate-400 text-sm">No hay recursos que coincidan</td></tr>
            </tbody>
          </table>
        </div>
        <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div class="p-5 border-b border-slate-100"><h2 class="font-bold text-slate-800">{{ editando ? 'Editar Recurso' : 'Nuevo Recurso' }}</h2></div>
        <div class="p-5 space-y-4">
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Nombre *</label><input v-model="form.nombre" type="text" placeholder="Ej: Agua embotellada" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-violet-400"/></div>
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
            <select v-model="form.tipo" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-violet-400">
              <option value="">Seleccionar...</option>
              <option>Alimento</option><option>Agua</option><option>Medicamento</option><option>Ropa</option><option>Higiene</option><option>Herramienta</option><option>Otro</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label><input v-model.number="form.cantidad_disponible" type="number" min="0" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-violet-400"/></div>
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Unidad *</label>
              <select v-model="form.unidad" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-violet-400">
                <option>kg</option><option>litros</option><option>unidades</option><option>cajas</option><option>paquetes</option><option>pares</option>
              </select>
            </div>
          </div>
          <div v-if="modalError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ modalError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 flex gap-3">
          <button @click="cerrarModal" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="guardar" :disabled="saving" class="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:bg-violet-400 transition-colors">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
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
import { apiGetRecursos, apiCreateRecurso, apiUpdateRecurso, apiDeleteRecurso, type Recurso } from '@/services/api'

const authStore = useAuthStore()
const recursos = ref<Recurso[]>([])
const loading = ref(true); const saving = ref(false)
const error = ref(''); const modalError = ref('')
const busqueda = ref(''); const filtroTipo = ref(''); const soloCriticos = ref(false)
const page = ref(1); const perPage = ref(20)
const modalVisible = ref(false); const editando = ref<Recurso | null>(null)
const form = ref({ nombre: '', tipo: '', cantidad_disponible: 0, unidad: 'kg' })

const stockCritico = computed(() => recursos.value.filter(r => r.cantidad_disponible <= 10).length)
const tiposUnicos = computed(() => new Set(recursos.value.map(r => r.tipo)).size)
const totalUnidades = computed(() => recursos.value.reduce((a, r) => a + r.cantidad_disponible, 0))
const tipos = computed(() => [...new Set(recursos.value.map(r => r.tipo))].sort())
const filtrados = computed(() => {
  let list = recursos.value
  if (filtroTipo.value) list = list.filter(r => r.tipo === filtroTipo.value)
  if (soloCriticos.value) list = list.filter(r => r.cantidad_disponible <= 10)
  if (busqueda.value) { const q = busqueda.value.toLowerCase(); list = list.filter(r => r.nombre.toLowerCase().includes(q) || r.tipo.toLowerCase().includes(q)) }
  return list
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

onMounted(async () => {
  const res = await apiGetRecursos()
  if (res.success && res.data) recursos.value = res.data; else error.value = res.message ?? 'Error'
  loading.value = false
})

function abrirModal(r?: Recurso) {
  editando.value = r ?? null
  form.value = r ? { nombre: r.nombre, tipo: r.tipo, cantidad_disponible: r.cantidad_disponible, unidad: r.unidad } : { nombre: '', tipo: '', cantidad_disponible: 0, unidad: 'kg' }
  modalError.value = ''; modalVisible.value = true
}
function cerrarModal() { modalVisible.value = false }

async function guardar() {
  if (!form.value.nombre.trim() || !form.value.tipo) { modalError.value = 'Nombre y tipo son obligatorios'; return }
  saving.value = true; modalError.value = ''
  try {
    if (editando.value) {
      const res = await apiUpdateRecurso(editando.value.id, form.value)
      if (res.success) { const idx = recursos.value.findIndex(x => x.id === editando.value!.id); if (idx !== -1) recursos.value[idx] = { ...recursos.value[idx], ...form.value } }
      else modalError.value = res.message ?? 'Error'
    } else {
      const res = await apiCreateRecurso(form.value)
      if (res.success) { const r = await apiGetRecursos(); if (r.success && r.data) recursos.value = r.data }
      else modalError.value = res.message ?? 'Error'
    }
    if (!modalError.value) cerrarModal()
  } finally { saving.value = false }
}

async function eliminar(r: Recurso) {
  if (!confirm(`¿Eliminar "${r.nombre}"?`)) return
  const res = await apiDeleteRecurso(r.id)
  if (res.success) recursos.value = recursos.value.filter(x => x.id !== r.id)
  else error.value = res.message ?? 'Error'
}
</script>
