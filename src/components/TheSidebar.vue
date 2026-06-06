<template>
  <!-- Overlay mobile -->
  <div
    v-if="open && isMobile"
    class="fixed inset-0 bg-black/40 z-30 lg:hidden"
    @click="open = false"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen z-40 flex flex-col bg-slate-900 text-white transition-all duration-300 shadow-2xl',
      open ? 'w-64' : 'w-16',
      !open && isMobile ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-3 h-16 border-b border-slate-700 flex-shrink-0">
      <div v-if="open" class="flex items-center gap-2 min-w-0">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <span class="font-bold text-sm truncate">Refugios Montería</span>
      </div>
      <div v-else class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </div>
      <button
        v-if="open"
        @click="open = false"
        class="p-1.5 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
      >
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
      </button>
    </div>

    <!-- User info -->
    <div :class="['px-3 py-3 border-b border-slate-700 flex-shrink-0', open ? '' : 'flex justify-center']">
      <div v-if="open" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
          {{ authStore.user?.user?.charAt(0)?.toUpperCase() ?? 'U' }}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ authStore.user?.user ?? 'Usuario' }}</p>
          <p class="text-xs text-slate-400 truncate">{{ authStore.user?.rol ?? '' }}</p>
        </div>
      </div>
      <div v-else class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
        {{ authStore.user?.user?.charAt(0)?.toUpperCase() ?? 'U' }}
      </div>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
      <!-- Toggle button when collapsed -->
      <button
        v-if="!open"
        @click="open = true"
        class="w-full flex justify-center p-2 rounded-lg hover:bg-slate-700 transition-colors mb-2"
        title="Expandir menú"
      >
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
        </svg>
      </button>

      <template v-for="item in visibleItems" :key="item.to">
        <router-link
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all group relative',
            isActive(item.to)
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'text-slate-400 hover:bg-slate-700/70 hover:text-white'
          ]"
          :title="!open ? item.label : undefined"
        >
          <span class="flex-shrink-0" v-html="item.icon" />
          <span v-if="open" class="text-sm font-medium truncate">{{ item.label }}</span>
          <!-- Tooltip when collapsed -->
          <span
            v-if="!open"
            class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl"
          >
            {{ item.label }}
          </span>
        </router-link>
      </template>
    </nav>

    <!-- Footer: logout -->
    <div class="px-2 py-3 border-t border-slate-700 flex-shrink-0">
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors group relative',
          !open ? 'justify-center' : ''
        ]"
        :title="!open ? 'Cerrar sesión' : undefined"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span v-if="open" class="text-sm font-medium">Cerrar sesión</span>
        <span v-if="!open" class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
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

const iconSize = 'w-5 h-5'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    roles: null,
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/></svg>`
  },
  {
    to: '/refugios',
    label: 'Refugios',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
  },
  {
    to: '/familias',
    label: 'Familias',
    roles: ['Admin', 'Operario', 'Voluntario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
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
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`
  },
  {
    to: '/entregas',
    label: 'Entregas',
    roles: ['Admin', 'Logistica', 'Operario', 'Voluntario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`
  },
  {
    to: '/priorizacion',
    label: 'Priorización',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
  },
  {
    to: '/reportes',
    label: 'Reportes',
    roles: ['Admin', 'Auditor', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
  },
  {
    to: '/auditoria',
    label: 'Auditoría',
    roles: ['Admin', 'Auditor'],
    icon: `<svg class="${iconSize}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`
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
