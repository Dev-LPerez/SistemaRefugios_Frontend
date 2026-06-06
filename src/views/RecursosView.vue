<template>
  <AppLayout title="Recursos">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Gestión de Recursos
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Inventario y control del almacén central de ayuda humanitaria</p>
        </div>
        <button v-if="authStore.canManageRecursos" @click="abrirModal()" 
          class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-sm transition-all cursor-pointer">
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Recurso
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Recursos</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ recursos.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-rose-50/50 group-hover:bg-rose-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Stock Crítico</p>
          <p class="text-2xl font-bold text-rose-600 mt-2">{{ stockCritico }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-indigo-50/50 group-hover:bg-indigo-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Categorías</p>
          <p class="text-2xl font-bold text-indigo-600 mt-2">{{ tiposUnicos }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-cyan-50/50 group-hover:bg-cyan-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Unidades Totales</p>
          <p class="text-2xl font-bold text-cyan-600 mt-2">{{ totalUnidades }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
        <div class="flex-1 min-w-[240px]">
          <input v-model="busqueda" type="text" placeholder="Buscar por nombre o tipo..."
            class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select v-model="filtroTipo" class="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-emerald-500 outline-none transition-all cursor-pointer">
            <option value="">Todos los tipos</option>
            <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
          </select>
          <label class="flex items-center gap-2 text-xs uppercase font-semibold text-slate-500 hover:text-slate-700 cursor-pointer select-none">
            <input v-model="soloCriticos" type="checkbox" class="w-4 h-4 bg-white border-slate-350 text-emerald-600 rounded focus:ring-0 focus:ring-offset-0"/>
            Solo críticos
          </label>
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
                <th class="px-5 py-3.5 hidden sm:table-cell">Tipo</th>
                <th class="px-5 py-3.5 text-center">Disponible</th>
                <th class="px-5 py-3.5 hidden md:table-cell">Unidad</th>
                <th class="px-5 py-3.5 text-center">Estado</th>
                <th v-if="authStore.canManageRecursos" class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-700">
              <tr v-for="r in paginados" :key="r.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ r.nombre }}</td>
                <td class="px-5 py-4 hidden sm:table-cell border-b border-slate-100/40">
                  <span class="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-semibold uppercase tracking-wider">{{ r.tipo }}</span>
                </td>
                <td class="px-5 py-4 text-center font-bold text-sm border-b border-slate-100/40" 
                  :class="r.cantidad_disponible <= 10 ? 'text-rose-600' : r.cantidad_disponible <= 50 ? 'text-amber-600' : 'text-emerald-600'">
                  {{ r.cantidad_disponible }}
                </td>
                <td class="px-5 py-4 text-slate-500 hidden md:table-cell border-b border-slate-100/40">{{ r.unidad }}</td>
                <td class="px-5 py-4 text-center border-b border-slate-100/40">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border', r.cantidad_disponible <= 10 ? 'bg-rose-50 text-rose-700 border-rose-200 bg-rose-50/60' : r.cantidad_disponible <= 50 ? 'bg-amber-50 text-amber-700 border-amber-200 bg-amber-50/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200 bg-emerald-50/60']">
                    <span :class="['w-1 h-1 rounded-full', r.cantidad_disponible <= 10 ? 'bg-rose-500 animate-pulse' : r.cantidad_disponible <= 50 ? 'bg-amber-500' : 'bg-emerald-500']"></span>
                    {{ r.cantidad_disponible <= 10 ? 'Crítico' : r.cantidad_disponible <= 50 ? 'Bajo' : 'Normal' }}
                  </span>
                </td>
                <td v-if="authStore.canManageRecursos" class="px-5 py-4 text-right border-b border-slate-100/40">
                  <div class="flex items-center justify-end gap-1">
                    <button @click="abrirModal(r)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button @click="eliminar(r)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0">
                <td :colspan="authStore.canManageRecursos ? 6 : 5" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">NO SE ENCONTRARON REGISTROS</td>
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
          <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">{{ editando ? 'Editar Recurso' : 'Nuevo Recurso' }}</h2>
          <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Nombre del Recurso *</label>
            <input v-model="form.nombre" type="text" placeholder="Ej: Agua embotellada" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Tipo de Recurso *</label>
            <select v-model="form.tipo" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs">
              <option value="">Seleccionar...</option>
              <option>Alimento</option><option>Agua</option><option>Medicamento</option><option>Ropa</option><option>Higiene</option><option>Herramienta</option><option>Otro</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Cantidad Disponible *</label>
              <input v-model.number="form.cantidad_disponible" type="number" min="0" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Unidad de Medida *</label>
              <select v-model="form.unidad" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs">
                <option>kg</option><option>litros</option><option>unidades</option><option>cajas</option><option>paquetes</option><option>pares</option>
              </select>
            </div>
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
import { useAuthStore } from '@/stores/auth'
import { apiGetRecursos, apiCreateRecurso, apiUpdateRecurso, apiDeleteRecurso, type Recurso } from '@/services/api'

const authStore = useAuthStore()
const recursos = ref<Recurso[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const modalError = ref('')
const busqueda = ref('')
const filtroTipo = ref('')
const soloCriticos = ref(false)
const page = ref(1)
const perPage = ref(20)
const modalVisible = ref(false)
const editando = ref<Recurso | null>(null)
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
  const motivo = prompt(`¿Está seguro de eliminar el recurso "${r.nombre}"? Ingrese el motivo de la eliminación:`)
  if (motivo === null) return
  if (!motivo.trim()) {
    alert('El motivo de la eliminación es obligatorio.')
    return
  }
  const res = await apiDeleteRecurso(r.id, motivo.trim())
  if (res.success) recursos.value = recursos.value.filter(x => x.id !== r.id)
  else error.value = res.message ?? 'Error'
}
</script>
