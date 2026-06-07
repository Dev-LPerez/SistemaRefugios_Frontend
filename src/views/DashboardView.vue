<template>
  <AppLayout title="Dashboard">
    <div class="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
            Panel de Control
          </h1>
          <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            Bienvenido, <span class="text-indigo-700 font-semibold font-sans">{{ authStore.user?.user }}</span> · ROL: <span class="text-indigo-800 font-semibold font-sans">{{ authStore.user?.rol }}</span>
          </p>
        </div>
        <div class="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>SISTEMA ACTIVO</span>
        </div>
      </div>

      <slot name="error">
        <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 shadow-sm">{{ error }}</div>
      </slot>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label" 
          class="bg-white border border-slate-200 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group shadow-md">
          <!-- Ambient card background light -->
          <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-indigo-50/40 group-hover:bg-indigo-50 blur-xl transition-all duration-300"></div>
          
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border', kpi.bg]">
            <span v-html="kpi.icon" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider truncate">{{ kpi.label }}</p>
            <p v-if="loading" class="text-2xl font-bold text-slate-900 mt-1">
              <span class="inline-block w-4 h-5 bg-slate-200 animate-pulse rounded"></span>
            </p>
            <p v-else class="text-2xl font-bold text-slate-900 tracking-tight mt-1">{{ kpi.value }}</p>
          </div>
        </div>
      </div>

      <!-- Alertas Stock -->
      <div v-if="!loading && alertas.length > 0" class="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-4 h-4 text-amber-600 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h3 class="font-bold text-xs uppercase tracking-wider text-amber-800">Alertas Críticas de Inventario</h3>
        </div>
        <div class="overflow-x-auto border border-amber-200 rounded-xl bg-white shadow-sm">
          <table class="w-full text-xs text-left border-collapse">
            <thead>
              <tr class="bg-amber-100/60 border-b border-amber-200 text-amber-900">
                <th class="px-4 py-2.5 font-bold uppercase tracking-wider">Recurso</th>
                <th class="px-4 py-2.5 font-bold uppercase tracking-wider text-right">Disponible</th>
                <th class="px-4 py-2.5 font-bold uppercase tracking-wider">Unidad</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-700">
              <tr v-for="a in alertas" :key="a.nombre" class="odd:bg-white even:bg-amber-50/20 hover:bg-amber-100/30 transition-colors">
                <td class="px-4 py-2.5 font-semibold text-slate-800 border-b border-amber-100/30">{{ a.nombre }}</td>
                <td class="px-4 py-2.5 text-right font-extrabold text-amber-700 border-b border-amber-100/30">{{ a.cantidad_disponible }}</td>
                <td class="px-4 py-2.5 text-slate-500 border-b border-amber-100/30">{{ a.unidad }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Accesos Rápidos -->
      <div>
        <h2 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <span>Accesos de Panel Rápido</span>
          <span class="flex-1 h-[1px] bg-slate-200"></span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <router-link v-for="link in quickLinks" :key="link.to" :to="link.to"
            class="bg-white border border-slate-200 hover:border-indigo-500/40 hover:shadow-lg rounded-2xl p-4 transition-all duration-300 flex flex-col items-center gap-3 text-center group cursor-pointer shadow-md">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-sm border', link.bg]">
              <span v-html="link.icon" />
            </div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-indigo-700 transition-colors">{{ link.label }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { apiGetDashboard, type DashboardStats } from '@/services/api'

const authStore = useAuthStore()
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref('')

const alertas = computed(() => stats.value?.recursos_alertas_stock ?? [])

const kpis = computed(() => [
  { label: 'Familias Registradas', value: stats.value?.total_familias_registradas ?? 0, bg: 'bg-indigo-50 text-indigo-600 border border-indigo-100', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  { label: 'Personas Damnificadas', value: stats.value?.total_personas_damnificadas ?? 0, bg: 'bg-cyan-50 text-cyan-600 border border-cyan-100', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
  { label: 'Entregas Completadas', value: stats.value?.total_entregas_completadas ?? 0, bg: 'bg-amber-50 text-amber-600 border border-amber-100', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>' },
  { label: 'Stock Total (Kg/L)', value: (stats.value?.total_unidades_kg_almacen ?? 0) + ' / 20,000 kg', bg: 'bg-teal-50 text-teal-600 border border-teal-100', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
])

const quickLinks = computed(() => {
  const rol = authStore.user?.rol ?? ''
  const size = 'w-5 h-5'
  return [
    { to: '/refugios', label: 'Refugios', bg: 'bg-cyan-50 text-cyan-600 border border-cyan-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>` },
    { to: '/familias', label: 'Familias', bg: 'bg-indigo-50 text-indigo-600 border border-indigo-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>` },
    { to: '/recursos', label: 'Recursos', bg: 'bg-teal-50 text-teal-600 border border-teal-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>` },
    { to: '/entregas', label: 'Entregas', bg: 'bg-amber-50 text-amber-600 border border-amber-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>` },
    { to: '/donaciones', label: 'Donaciones', bg: 'bg-pink-50 text-pink-600 border border-pink-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` },
    { to: '/priorizacion', label: 'Priorización', bg: 'bg-rose-50 text-rose-600 border border-rose-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>` },
    ...((['Admin','Auditor','Logistica','Operario'].includes(rol)) ? [{ to: '/reportes', label: 'Reportes', bg: 'bg-indigo-50 text-indigo-600 border border-indigo-100', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>` }] : []),
    ...((['Admin','Auditor'].includes(rol)) ? [{ to: '/auditoria', label: 'Auditoría', bg: 'bg-slate-100 text-slate-600 border border-slate-200', icon: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4c0 2.717.78 5.225 2.138 7.34M12.012 11c0 3.517 1.009 6.799 2.753 9.571m3.44-2.04l-.054-.09A13.916 13.916 0 0115 11V7a2 2 0 012-2h2a2 2 0 012 2v4c0 2.717-.78 5.225-2.138 7.34M12 9a1 1 0 100-2 1 1 0 000 2z"/></svg>` }] : []),
  ]
})

onMounted(async () => {
  const res = await apiGetDashboard()
  if (res.success && res.data) stats.value = res.data; else error.value = res.message ?? 'Error al cargar dashboard'
  loading.value = false
})
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
