<template>
  <!-- Overlay mobile -->
  <div
    v-if="open && isMobile"
    class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
    @click="open = false"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen z-40 flex flex-col bg-emerald-950 border-r border-emerald-900/60 text-white transition-all duration-300 shadow-xl',
      open ? 'w-64' : 'w-16',
      !open && isMobile ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <!-- Header/Logo -->
    <div class="flex items-center justify-between px-4 h-16 border-b border-emerald-900/60 flex-shrink-0">
      <div v-if="open" class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-bold text-xs uppercase tracking-widest text-emerald-350 font-display">REFUGIOS</span>
          <span class="text-[9px] text-emerald-200/60 font-mono tracking-tight -mt-0.5">SISTEMA DE GESTIÓN</span>
        </div>
      </div>
      <div v-else class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </div>
      <button
        v-if="open"
        @click="open = false"
        class="p-1 rounded hover:bg-emerald-900/50 text-emerald-200 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
      </button>
    </div>

    <!-- User info panel -->
    <div :class="['px-4 py-3 border-b border-emerald-900/60 bg-emerald-950 flex-shrink-0', open ? '' : 'flex justify-center']">
      <div v-if="open" class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-800 text-white font-display font-bold flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
          {{ authStore.user?.user?.charAt(0)?.toUpperCase() ?? 'U' }}
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-emerald-100 truncate">{{ authStore.user?.user ?? 'Usuario' }}</p>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <p class="text-[9px] font-mono uppercase text-emerald-300 truncate tracking-wider">{{ authStore.user?.rol ?? '' }}</p>
          </div>
        </div>
      </div>
      <div v-else class="w-8 h-8 rounded-full bg-emerald-800 text-white font-display font-bold flex items-center justify-center text-sm shadow-sm">
        {{ authStore.user?.user?.charAt(0)?.toUpperCase() ?? 'U' }}
      </div>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 overflow-y-auto py-3 space-y-1.5 px-2">
      <!-- Toggle button when collapsed -->
      <button
        v-if="!open"
        @click="open = true"
        class="w-full flex justify-center p-2 rounded-lg hover:bg-emerald-900/50 text-emerald-250 hover:text-white transition-colors mb-3 cursor-pointer"
        title="Expandir menú"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
        </svg>
      </button>

      <template v-for="item in visibleItems" :key="item.to">
        <router-link
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative border-l-4 font-semibold text-xs uppercase tracking-wider',
            isActive(item.to)
              ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500 shadow-inner'
              : 'text-emerald-200/70 border-transparent hover:bg-emerald-900/30 hover:text-emerald-100'
          ]"
          :title="!open ? item.label : undefined"
        >
          <span :class="['flex-shrink-0', isActive(item.to) ? 'text-emerald-400' : 'text-emerald-200/50 group-hover:text-emerald-100']" v-html="item.icon" />
          <span v-if="open" class="font-display">{{ item.label }}</span>
          <!-- Tooltip when collapsed -->
          <span
            v-if="!open"
            class="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
          >
            {{ item.label }}
          </span>
        </router-link>
      </template>
    </nav>

    <!-- Footer: logout -->
    <div class="px-2 py-3 border-t border-emerald-900/60 flex-shrink-0">
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-emerald-300 hover:bg-rose-900/20 hover:text-rose-250 transition-all group relative font-semibold text-xs uppercase tracking-wider cursor-pointer',
          !open ? 'justify-center' : ''
        ]"
        :title="!open ? 'Cerrar sesión' : undefined"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span v-if="open" class="font-display">Salir</span>
        <span v-if="!open" class="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-rose-350 text-xs font-semibold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Cerrar sesión
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const open = ref(true)
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) open.value = false
  else open.value = true
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

// Expose open for the toggle button in layouts
defineExpose({ open })

const iconSize = 'w-4 h-4'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    roles: null,
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`
  },
  {
    to: '/refugios',
    label: 'Refugios',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`
  },
  {
    to: '/familias',
    label: 'Familias',
    roles: ['Admin', 'Operario', 'Voluntario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  },
  {
    to: '/recursos',
    label: 'Recursos',
    roles: ['Admin', 'Logistica'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
  },
  {
    to: '/donaciones',
    label: 'Donaciones',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  },
  {
    to: '/entregas',
    label: 'Entregas',
    roles: ['Admin', 'Logistica', 'Operario', 'Voluntario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`
  },
  {
    to: '/priorizacion',
    label: 'Priorización',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
  },
  {
    to: '/reportes',
    label: 'Reportes',
    roles: ['Admin', 'Auditor', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
  },
  {
    to: '/auditoria',
    label: 'Auditoría',
    roles: ['Admin', 'Auditor'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4c0 2.717.78 5.225 2.138 7.34M12.012 11c0 3.517 1.009 6.799 2.753 9.571m3.44-2.04l-.054-.09A13.916 13.916 0 0115 11V7a2 2 0 012-2h2a2 2 0 012 2v4c0 2.717-.78 5.225-2.138 7.34M12 9a1 1 0 100-2 1 1 0 000 2z"/></svg>`
  },
]

const visibleItems = computed(() =>
  navItems.filter(item => {
    if (!item.roles) return true
    const rol = authStore.user?.rol ?? ''
    return item.roles.includes(rol)
  })
)
</script>
