<template>
  <AppLayout title="Dashboard">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-slate-800">Dashboard</h1>
        <p class="text-sm text-slate-500 mt-0.5">Bienvenido, <span class="font-medium text-slate-700">{{ authStore.user?.user }}</span> · {{ authStore.user?.rol }}</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="kpi in kpis" :key="kpi.label" class="bg-white rounded-xl p-5 border border-slate-200 flex items-center gap-4">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', kpi.bg]">
            <span v-html="kpi.icon" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500 truncate">{{ kpi.label }}</p>
            <p v-if="loading" class="text-2xl font-bold text-slate-800 mt-0.5">—</p>
            <p v-else class="text-2xl font-bold text-slate-800 mt-0.5">{{ kpi.value }}</p>
          </div>
        </div>
      </div>

      <!-- Alertas Stock -->
      <div v-if="!loading && alertas.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h3 class="font-semibold text-red-700 text-sm">Recursos en nivel crítico de stock</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="text-left">
              <th class="pr-4 pb-2 text-xs font-semibold text-red-600 uppercase">Recurso</th>
              <th class="pr-4 pb-2 text-xs font-semibold text-red-600 uppercase text-right">Disponible</th>
              <th class="pb-2 text-xs font-semibold text-red-600 uppercase">Unidad</th>
            </tr></thead>
            <tbody class="divide-y divide-red-100">
              <tr v-for="a in alertas" :key="a.nombre">
                <td class="pr-4 py-2 font-medium text-red-800">{{ a.nombre }}</td>
                <td class="pr-4 py-2 text-right font-bold text-red-700">{{ a.cantidad_disponible }}</td>
                <td class="py-2 text-red-600">{{ a.unidad }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Accesos Rápidos -->
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Acceso rápido</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <router-link v-for="link in quickLinks" :key="link.to" :to="link.to"
          :class="['bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-col items-center gap-3 text-center group']">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', link.bg]">
            <span v-html="link.icon" />
          </div>
          <span class="text-xs font-medium text-slate-700">{{ link.label }}</span>
        </router-link>
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
const loading = ref(true); const error = ref('')

const alertas = computed(() => stats.value?.recursos_alertas_stock ?? [])

const kpis = computed(() => [
  { label: 'Familias Registradas', value: stats.value?.total_familias_registradas ?? 0, bg: 'bg-emerald-100', icon: '<svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  { label: 'Personas Damnificadas', value: stats.value?.total_personas_damnificadas ?? 0, bg: 'bg-blue-100', icon: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
  { label: 'Entregas Completadas', value: stats.value?.total_entregas_completadas ?? 0, bg: 'bg-orange-100', icon: '<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>' },
  { label: 'Stock Total (kg/L)', value: stats.value?.total_unidades_kg_almacen ?? 0, bg: 'bg-violet-100', icon: '<svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
])

const quickLinks = computed(() => {
  const rol = authStore.user?.rol ?? ''
  return [
    { to: '/refugios', label: 'Refugios', bg: 'bg-blue-100', icon: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
    { to: '/familias', label: 'Familias', bg: 'bg-emerald-100', icon: '<svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
    { to: '/recursos', label: 'Recursos', bg: 'bg-violet-100', icon: '<svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { to: '/entregas', label: 'Entregas', bg: 'bg-orange-100', icon: '<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>' },
    { to: '/donaciones', label: 'Donaciones', bg: 'bg-pink-100', icon: '<svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>' },
    { to: '/priorizacion', label: 'Priorización', bg: 'bg-red-100', icon: '<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
    ...((['Admin','Auditor','Logistica','Operario'].includes(rol)) ? [{ to: '/reportes', label: 'Reportes', bg: 'bg-teal-100', icon: '<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' }] : []),
    ...((['Admin','Auditor'].includes(rol)) ? [{ to: '/auditoria', label: 'Auditoría', bg: 'bg-slate-100', icon: '<svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>' }] : []),
  ]
})

onMounted(async () => {
  const res = await apiGetDashboard()
  if (res.success && res.data) stats.value = res.data; else error.value = res.message ?? 'Error al cargar dashboard'
  loading.value = false
})
</script>
