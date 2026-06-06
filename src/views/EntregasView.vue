<template>
  <AppLayout title="Entregas">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Gestión de Entregas</h1>
          <p class="text-sm text-slate-500 mt-0.5">Control de distribución de recursos a familias</p>
        </div>
        <button v-if="authStore.canManageEntregas" @click="abrirModal()" class="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nueva Entrega
        </button>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Total Entregas</p><p class="text-2xl font-bold text-slate-800">{{ entregas.length }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Entregadas</p><p class="text-2xl font-bold text-green-600">{{ entregadas }}</p></div>
        <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Pendientes</p><p class="text-2xl font-bold text-amber-600">{{ pendientes }}</p></div>
      </div>

      <!-- Aviso regla de 3 días -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-xs text-amber-700"><strong>Regla del sistema:</strong> El backend impide registrar dos entregas a la misma familia en menos de 3 días. Si ves error, verifica la fecha de la última entrega de esa familia.</p>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar por familia o recurso..."
          class="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400"/>
        <div class="flex gap-2 flex-wrap">
          <button @click="filtroEstado=''" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado==='' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600']">Todas</button>
          <button @click="filtroEstado='Entregado'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado==='Entregado' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600']">Entregadas</button>
          <button @click="filtroEstado='pendiente'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado==='pendiente' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600']">Pendientes</button>
          <button @click="filtroEstado='cancelada'" :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filtroEstado==='cancelada' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600']">Canceladas</button>
        </div>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div v-if="loading" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Familia</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Recursos Entregados</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Fecha</th>
                <th v-if="authStore.canManageEntregas" class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acc.</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="e in paginados" :key="e.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 font-medium text-slate-800">
                  <div class="font-semibold text-slate-800">{{ e.familia ?? `Familia #${e.id_familia}` }}</div>
                  <div class="text-[10px] text-slate-400">ID Entrega: #{{ e.id }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1.5">
                    <div v-for="det in e.detalles" :key="det.id_detalle" class="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1 text-xs text-slate-700 shadow-xs">
                      <span class="font-medium text-slate-900">{{ det.recurso_nombre }}</span>
                      <span class="font-bold text-orange-600 bg-orange-50 border border-orange-200/50 rounded px-1.5 py-0.5 text-[10px]">x{{ det.cantidad }}</span>
                      <span class="text-slate-400 text-[10px]">{{ det.unidad }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <select 
                    v-if="authStore.canManageEntregas"
                    :value="e.estado" 
                    @change="cambiarEstado(e, ($event.target as HTMLSelectElement).value)"
                    :class="['px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-0 focus:outline-none transition-colors appearance-none text-center bg-none pr-1.5', estadoColor(e.estado)]"
                  >
                    <option class="bg-white text-slate-800 text-left" value="Entregado">Entregado</option>
                    <option class="bg-white text-slate-800 text-left" value="pendiente">pendiente</option>
                    <option class="bg-white text-slate-800 text-left" value="cancelada">cancelada</option>
                  </select>
                  <span v-else :class="['inline-block px-2 py-0.5 rounded-full text-xs font-medium', estadoColor(e.estado)]">
                    {{ e.estado }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{{ e.fecha }}</td>
                <td v-if="authStore.canManageEntregas" class="px-4 py-3 text-right">
                  <button @click="eliminar(e)" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Anular entrega (devuelve stock)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filtrados.length === 0 && !loading">
                <td :colspan="authStore.canManageEntregas ? 5 : 4" class="px-4 py-12 text-center text-slate-400 text-sm">No hay entregas que coincidan</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
      </div>
    </div>

    <!-- Modal de Entrega Multi-recurso -->
    <div v-if="modalVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div class="p-5 border-b border-slate-100">
          <h2 class="font-bold text-slate-800">Nueva Entrega</h2>
          <p class="text-xs text-slate-400 mt-0.5">Al registrar, el stock de cada recurso se descuenta automáticamente</p>
        </div>

        <div class="p-5 space-y-4 overflow-y-auto flex-1">
          <!-- Selector de familia -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Familia *</label>
            <select v-model.number="form.id_familia" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400">
              <option :value="0">Seleccionar familia</option>
              <option v-for="f in familias" :key="f.id" :value="f.id">{{ f.representante }} ({{ f.cedula }})</option>
            </select>
          </div>

          <!-- Fecha y Estado -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha *</label>
              <input v-model="form.fecha" type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select v-model="form.estado" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400">
                <option value="Entregado">Entregado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <!-- Sección de productos a entregar -->
          <div class="border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              Productos a entregar
            </h3>

            <!-- Mini-tabla de productos ya agregados -->
            <div v-if="productosEntrega.length > 0" class="border border-slate-100 rounded-lg overflow-hidden">
              <table class="w-full text-xs">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="text-left px-3 py-2 font-medium text-slate-500">Recurso</th>
                    <th class="text-center px-3 py-2 font-medium text-slate-500">Cantidad</th>
                    <th class="text-right px-3 py-2 font-medium text-slate-500">Quitar</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="(prod, idx) in productosEntrega" :key="idx" class="hover:bg-orange-50/50">
                    <td class="px-3 py-2 text-slate-700 font-medium">{{ nombreRecurso(prod.id_recurso) }}</td>
                    <td class="px-3 py-2 text-center text-slate-600">{{ prod.cantidad }} {{ unidadRecurso(prod.id_recurso) }}</td>
                    <td class="px-3 py-2 text-right">
                      <button @click="eliminarProducto(idx)" class="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Quitar producto">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mensaje cuando no hay productos -->
            <p v-else class="text-xs text-slate-400 text-center py-2">Agrega al menos un producto para la entrega</p>

            <!-- Fila para agregar nuevo producto -->
            <div class="flex gap-2 items-end">
              <div class="flex-1">
                <label class="block text-xs font-medium text-slate-500 mb-1">Recurso</label>
                <select v-model.number="nuevoProducto.id_recurso" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400">
                  <option :value="0">Seleccionar...</option>
                  <option
                    v-for="r in recursos"
                    :key="r.id"
                    :value="r.id"
                    :disabled="r.cantidad_disponible === 0 || recursoYaAgregado(r.id)"
                  >
                    {{ r.nombre }} ({{ stockDisponibleParaRecurso(r.id) }} {{ r.unidad }})
                    {{ recursoYaAgregado(r.id) ? '— ya agregado' : '' }}
                  </option>
                </select>
              </div>
              <div class="w-24">
                <label class="block text-xs font-medium text-slate-500 mb-1">Cant.</label>
                <input
                  v-model.number="nuevoProducto.cantidad"
                  type="number"
                  min="1"
                  :max="stockDelRecursoSeleccionado"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <button
                @click="agregarProducto"
                :disabled="!puedeAgregarProducto"
                class="px-3 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium hover:bg-orange-200 disabled:bg-slate-100 disabled:text-slate-400 transition-colors whitespace-nowrap"
              >
                + Agregar
              </button>
            </div>

            <!-- Info de stock del recurso seleccionado -->
            <p v-if="nuevoProducto.id_recurso" class="text-xs text-slate-400">
              Stock disponible: <span class="font-semibold text-slate-600">{{ stockDelRecursoSeleccionado }}</span>
              {{ unidadRecurso(nuevoProducto.id_recurso) }}
            </p>
          </div>

          <!-- Errores del modal -->
          <div v-if="modalError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium whitespace-pre-line">
            {{ modalError }}
          </div>
        </div>

        <div class="p-5 border-t border-slate-100 flex gap-3">
          <button @click="cerrarModal" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="guardar" :disabled="saving || productosEntrega.length === 0" class="flex-1 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 disabled:bg-orange-400 transition-colors">
            {{ saving ? 'Registrando...' : `Registrar Entrega (${productosEntrega.length})` }}
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
import type { Entrega, Familia, Recurso } from '@/types'
import { apiGetEntregas, apiCreateEntrega, apiUpdateEntregaEstado, apiDeleteEntrega, apiGetFamilias, apiGetRecursos } from '@/services/api'

// ─── Stores y estado general ──────────────────────────────────────────────────

const authStore = useAuthStore()
const entregas = ref<Entrega[]>([])
const familias = ref<Familia[]>([])
const recursos = ref<Recurso[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const modalError = ref('')
const busqueda = ref('')
const filtroEstado = ref('')
const page = ref(1)
const perPage = ref(20)
const modalVisible = ref(false)
const today = new Date().toISOString().split('T')[0]

// ─── Formulario base (familia, fecha, estado) ─────────────────────────────────

// Estado por defecto = 'Entregado' (con mayúscula, como espera el backend)
const form = ref({
  id_familia: 0,
  fecha: today,
  estado: 'Entregado',
})

// ─── Array de productos para entrega multi-recurso ────────────────────────────

interface ProductoEntrega {
  id_recurso: number
  cantidad: number
}

const productosEntrega = ref<ProductoEntrega[]>([])

// Producto que se está configurando antes de agregar
const nuevoProducto = ref<ProductoEntrega>({ id_recurso: 0, cantidad: 1 })



// ─── Computados de la tabla principal ─────────────────────────────────────────

const entregadas = computed(() => entregas.value.filter(e => e.estado?.toLowerCase() === 'entregado').length)
const pendientes = computed(() => entregas.value.filter(e => e.estado?.toLowerCase() === 'pendiente').length)

const filtrados = computed(() => {
  let list = entregas.value
  if (filtroEstado.value) list = list.filter(e => e.estado?.toLowerCase() === filtroEstado.value.toLowerCase())
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(e => 
      (e.familia ?? '').toLowerCase().includes(q) || 
      (e.detalles ?? []).some(d => (d.recurso_nombre ?? '').toLowerCase().includes(q))
    )
  }
  return list
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

// ─── Helpers de recursos ──────────────────────────────────────────────────────

/** Nombre del recurso por su ID */
function nombreRecurso(id: number): string {
  return recursos.value.find(r => r.id === id)?.nombre ?? `Recurso #${id}`
}

/** Unidad de medida del recurso por su ID */
function unidadRecurso(id: number): string {
  return recursos.value.find(r => r.id === id)?.unidad ?? ''
}

/** Verifica si un recurso ya fue agregado a la lista de productos */
function recursoYaAgregado(id: number): boolean {
  return productosEntrega.value.some(p => p.id_recurso === id)
}

/**
 * Stock disponible considerando lo que ya se ha agregado al carrito.
 * Si el recurso ya está en productosEntrega, se resta la cantidad asignada.
 */
function stockDisponibleParaRecurso(id: number): number {
  const recurso = recursos.value.find(r => r.id === id)
  if (!recurso) return 0
  const yaAsignado = productosEntrega.value
    .filter(p => p.id_recurso === id)
    .reduce((sum, p) => sum + p.cantidad, 0)
  return recurso.cantidad_disponible - yaAsignado
}

/** Stock disponible del recurso seleccionado en el selector de nuevo producto */
const stockDelRecursoSeleccionado = computed(() => {
  if (!nuevoProducto.value.id_recurso) return 0
  return stockDisponibleParaRecurso(nuevoProducto.value.id_recurso)
})

/** Valida si se puede agregar el producto actual al carrito */
const puedeAgregarProducto = computed(() => {
  const np = nuevoProducto.value
  if (!np.id_recurso || np.cantidad < 1) return false
  if (recursoYaAgregado(np.id_recurso)) return false
  if (np.cantidad > stockDelRecursoSeleccionado.value) return false
  return true
})

// ─── Estilo de estado (badge de color) ────────────────────────────────────────

function estadoColor(estado: string) {
  const e = estado?.toLowerCase() ?? ''
  if (e === 'entregado') return 'bg-green-100 text-green-700'
  if (e === 'cancelada' || e === 'cancelado') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

// ─── Carga inicial de datos ───────────────────────────────────────────────────

onMounted(async () => {
  const [resE, resF, resR] = await Promise.all([apiGetEntregas(), apiGetFamilias(), apiGetRecursos()])
  if (resE.success && resE.data) entregas.value = resE.data
  else error.value = resE.message ?? 'Error al cargar entregas'
  if (resF.success && resF.data) familias.value = resF.data
  if (resR.success && resR.data) recursos.value = resR.data
  loading.value = false
})

// ─── Funciones del modal multi-recurso ────────────────────────────────────────

function abrirModal() {
  form.value = { id_familia: 0, fecha: today, estado: 'Entregado' }
  productosEntrega.value = []
  nuevoProducto.value = { id_recurso: 0, cantidad: 1 }
  modalError.value = ''
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
}

/** Agrega un producto a la lista de entrega */
function agregarProducto() {
  if (!puedeAgregarProducto.value) return

  productosEntrega.value.push({
    id_recurso: nuevoProducto.value.id_recurso,
    cantidad: nuevoProducto.value.cantidad,
  })

  // Resetear selector para el siguiente producto
  nuevoProducto.value = { id_recurso: 0, cantidad: 1 }
}

/** Elimina un producto de la lista por índice */
function eliminarProducto(index: number) {
  productosEntrega.value.splice(index, 1)
}

/** Registra la entrega con múltiples recursos acumulados en una sola llamada */
async function guardar() {
  // Validaciones generales
  if (!form.value.id_familia) {
    modalError.value = 'Selecciona una familia'
    return
  }
  if (productosEntrega.value.length === 0) {
    modalError.value = 'Agrega al menos un producto a la entrega'
    return
  }

  saving.value = true
  modalError.value = ''

  try {
    const res = await apiCreateEntrega({
      estado: form.value.estado,
      fecha: form.value.fecha,
      id_familia: form.value.id_familia,
      recursos: productosEntrega.value.map(prod => ({
        id_recurso: prod.id_recurso,
        cantidad: prod.cantidad
      }))
    })

    if (res.success) {
      // Recargar datos y cerrar modal
      const [resE, resR] = await Promise.all([apiGetEntregas(), apiGetRecursos()])
      if (resE.success && resE.data) entregas.value = resE.data
      if (resR.success && resR.data) recursos.value = resR.data
      modalVisible.value = false
    } else {
      modalError.value = res.message ?? 'Error al registrar la entrega'
    }
  } catch (err: any) {
    modalError.value = err.response?.data?.message ?? err.message ?? 'Error de conexión'
  } finally {
    saving.value = false
  }
}

// ─── Cambiar estado de entrega ────────────────────────────────────────────────

async function cambiarEstado(e: Entrega, nuevoEstado: string) {
  try {
    const res = await apiUpdateEntregaEstado(e.id, nuevoEstado)
    if (res.success) {
      e.estado = nuevoEstado
      // Actualizar stock
      const resR = await apiGetRecursos()
      if (resR.success && resR.data) recursos.value = resR.data
    } else {
      alert(res.message ?? 'Error al actualizar el estado')
      const resE = await apiGetEntregas()
      if (resE.success && resE.data) entregas.value = resE.data
    }
  } catch (err: any) {
    alert(err.message ?? 'Error de conexión')
    const resE = await apiGetEntregas()
    if (resE.success && resE.data) entregas.value = resE.data
  }
}

// ─── Eliminar entrega existente ───────────────────────────────────────────────

async function eliminar(e: Entrega) {
  if (!confirm(`¿Anular esta entrega? El stock del recurso será devuelto al inventario.`)) return
  const res = await apiDeleteEntrega(e.id)
  if (res.success) {
    entregas.value = entregas.value.filter(x => x.id !== e.id)
    // Actualizar stock
    const resR = await apiGetRecursos()
    if (resR.success && resR.data) recursos.value = resR.data
  } else {
    error.value = res.message ?? 'Error al anular'
  }
}
</script>
