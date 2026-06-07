<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    <!-- Sidebar a la izquierda -->
    <TheSidebar ref="sidebar" />

    <!-- Área principal pushed by sidebar -->
    <div
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      ]"
    >
      <!-- Navbar Superior (Escritorio y Móvil) -->
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <!-- Botón Toggle Sidebar (Móvil) -->
          <button @click="toggleSidebar" class="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer">
            <svg class="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>
          
          <!-- Selector de Refugio Operativo -->
          <div class="flex items-center gap-2">
            <span class="hidden sm:inline text-[10px] font-extrabold uppercase text-slate-450 tracking-wider">Refugio Operativo:</span>
            <div class="relative">
              <select 
                v-model="refugioSeleccionado"
                class="pl-3 pr-8 py-1.5 bg-slate-100 hover:bg-slate-150 text-xs font-bold text-slate-700 border border-slate-250 rounded-xl outline-none cursor-pointer transition-colors appearance-none"
              >
                <option :value="0">Sede Principal - Almacén Central</option>
                <option v-for="r in refugios" :key="r.id" :value="r.id">{{ r.nombre }}</option>
              </select>
              <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[8px]">▼</span>
            </div>
          </div>
        </div>

        <!-- Título Central (Opcional en Desktop, Cabecera en Móvil) -->
        <span class="lg:hidden font-extrabold text-indigo-700 text-xs uppercase tracking-widest font-sans">{{ title }}</span>

        <!-- Lado derecho: Alertas de Stock y Estado -->
        <div class="flex items-center gap-3">
          <!-- Alerta de Stock Crítico -->
          <div v-if="stockCritico > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-lg animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span class="text-[9px] font-extrabold text-rose-700 uppercase tracking-tight">
              {{ stockCritico }} EN ALERTA CRÍTICA
            </span>
          </div>
          <div v-else class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span class="text-[9px] font-extrabold text-emerald-700 uppercase tracking-tight">
              INVENTARIO ÓPTIMO
            </span>
          </div>

          <!-- Divisor -->
          <div class="h-4 w-[1px] bg-slate-200"></div>

          <!-- Indicador de Sincronización -->
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="hidden md:inline text-[9px] text-slate-400 font-mono tracking-wider font-semibold">ONLINE</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TheSidebar from '@/components/TheSidebar.vue'
import { apiGetRefugios, apiGetRecursos, type Refugio } from '@/services/api'

withDefaults(defineProps<{ title?: string }>(), { title: 'Refugios' })

const sidebar = ref<InstanceType<typeof TheSidebar> | null>(null)
const sidebarOpen = computed(() => sidebar.value?.open ?? true)

const refugioSeleccionado = ref(0)
const refugios = ref<Refugio[]>([])
const stockCritico = ref(0)

function toggleSidebar() {
  if (sidebar.value) sidebar.value.open = !sidebar.value.open
}

onMounted(async () => {
  try {
    const resRef = await apiGetRefugios()
    if (resRef.success && resRef.data) {
      refugios.value = resRef.data
    }
  } catch (e) {
    console.error('Error cargando refugios:', e)
  }

  try {
    const resRec = await apiGetRecursos()
    if (resRec.success && resRec.data) {
      // Filtrar aquellos recursos con stock crítico <= 10
      stockCritico.value = resRec.data.filter(r => r.cantidad_disponible <= 10).length
    }
  } catch (e) {
    console.error('Error cargando stock crítico:', e)
  }
})
</script>
