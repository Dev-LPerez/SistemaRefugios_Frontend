<template>
  <!-- Overlay mobile -->
  <div
    v-if="open && isMobile"
    class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-35 lg:hidden"
    @click="open = false"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen z-40 flex flex-col bg-white border-r border-slate-200 text-slate-900 transition-all duration-300 ease-out shadow-sm',
      open ? 'w-64' : 'w-16',
      !open && isMobile ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <!-- Header/Logo -->
    <div class="flex items-center justify-between px-4 h-16 border-b border-slate-200 flex-shrink-0">
      <div v-if="open" class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg class="w-4 h-4 text-white stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
          </svg>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-extrabold text-xs uppercase tracking-wider text-indigo-700 font-sans">REFUGIOS</span>
          <span class="text-[9px] text-slate-500 font-semibold tracking-tight -mt-0.5">SISTEMA DE GESTIÓN</span>
        </div>
      </div>
      <div v-else class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
        <svg class="w-4 h-4 text-white stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
        </svg>
      </div>
      <button
        v-if="open"
        @click="open = false"
        class="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0 cursor-pointer"
      >
        <svg class="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
        </svg>
      </button>
    </div>

    <!-- User info panel -->
    <div :class="['px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex-shrink-0', open ? '' : 'flex justify-center']">
      <div v-if="open" class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-sans font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
          {{ authStore.user?.user?.charAt(0)?.toUpperCase() ?? 'U' }}
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-slate-800 truncate leading-none">{{ authStore.user?.user ?? 'Usuario' }}</p>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p class="text-[9px] font-mono uppercase text-slate-500 truncate tracking-wider leading-none">{{ authStore.user?.rol ?? '' }}</p>
          </div>
        </div>
      </div>
      <div v-else class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-sans font-bold flex items-center justify-center text-xs shadow-sm" :title="authStore.user?.user">
        {{ authStore.user?.user?.charAt(0)?.toUpperCase() ?? 'U' }}
      </div>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 overflow-y-auto py-4 space-y-4 px-3">
      <!-- Toggle button when collapsed -->
      <button
        v-if="!open"
        @click="open = true"
        class="w-full flex justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors mb-3 cursor-pointer"
        title="Expandir menú"
      >
        <svg class="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/>
        </svg>
      </button>

      <!-- Grouped Menus -->
      <div v-for="g in groups" :key="g.name" class="space-y-1.5">
        <p v-if="open" class="px-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {{ g.name }}
        </p>
        <div class="space-y-0.5">
          <template v-for="item in g.items" :key="item.to">
            <router-link
              :to="item.to"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative font-medium text-xs border-l-2',
                isActive(item.to)
                  ? 'bg-indigo-50/70 text-indigo-600 border-indigo-600 font-semibold'
                  : 'text-slate-650 border-transparent hover:bg-slate-50 hover:text-slate-900'
              ]"
              :title="!open ? item.label : undefined"
            >
              <span :class="['flex-shrink-0', isActive(item.to) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-700']" v-html="item.icon" />
              <span v-if="open" class="font-sans tracking-tight">{{ item.label }}</span>
              <!-- Tooltip when collapsed -->
              <span
                v-if="!open"
                class="absolute left-full ml-3 px-2 py-1.5 bg-slate-950 text-white text-[10px] font-medium rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
              >
                {{ item.label }}
              </span>
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Footer: logout -->
    <div class="px-3 py-3 border-t border-slate-200 bg-slate-50/50 flex-shrink-0">
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all group relative font-medium text-xs cursor-pointer',
          !open ? 'justify-center' : ''
        ]"
        :title="!open ? 'Cerrar sesión' : undefined"
      >
        <svg class="w-4 h-4 flex-shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
        </svg>
        <span v-if="open" class="font-sans tracking-tight">Salir del Sistema</span>
        <span v-if="!open" class="absolute left-full ml-3 px-2 py-1.5 bg-slate-950 text-rose-350 text-[10px] font-medium rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
    group: 'Operaciones',
    roles: null,
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"/></svg>`
  },
  {
    to: '/familias',
    label: 'Familias',
    group: 'Operaciones',
    roles: ['Admin', 'Operario', 'Voluntario'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 018.625 21c-2.24 0-4.32-.647-6.074-1.763v-.109a4.125 4.125 0 017.533-2.493 9.362 9.362 0 016.54 2.493zm-6-8.25a3 3 0 110-6 3 3 0 010 6zm8.5 2.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z"/></svg>`
  },
  {
    to: '/refugios',
    label: 'Refugios',
    group: 'Operaciones',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M2.25 21h19.5M8.25 21H6.75V10.5a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75V21M18 7.5h.008v.008H18V7.5z"/></svg>`
  },
  {
    to: '/recursos',
    label: 'Recursos',
    group: 'Logística',
    roles: ['Admin', 'Logistica'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`
  },
  {
    to: '/donaciones',
    label: 'Donaciones',
    group: 'Logística',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>`
  },
  {
    to: '/entregas',
    label: 'Entregas',
    group: 'Logística',
    roles: ['Admin', 'Logistica', 'Operario', 'Voluntario'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.732 2.076 1.708M3.75 6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 011.123-.08M10.25 4.5h-4.5A2.25 2.25 0 003.5 6.75v12a2.25 2.25 0 005.75 2.1h4.5M10.5 4.5h-4.5M10.5 21h4.5"/></svg>`
  },
  {
    to: '/priorizacion',
    label: 'Priorización',
    group: 'Sistema',
    roles: ['Admin', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`
  },
  {
    to: '/reportes',
    label: 'Reportes',
    group: 'Sistema',
    roles: ['Admin', 'Auditor', 'Logistica', 'Operario'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>`
  },
  {
    to: '/auditoria',
    label: 'Auditoría',
    group: 'Sistema',
    roles: ['Admin', 'Auditor'],
    icon: `<svg class="${iconSize} stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z"/></svg>`
  }
]

const visibleItems = computed(() =>
  navItems.filter(item => {
    if (!item.roles) return true
    const rol = authStore.user?.rol ?? ''
    return item.roles.includes(rol)
  })
)

const groups = computed(() => {
  const items = visibleItems.value
  const grps = [
    { name: 'Operaciones', items: items.filter(i => i.group === 'Operaciones') },
    { name: 'Logística', items: items.filter(i => i.group === 'Logística') },
    { name: 'Sistema', items: items.filter(i => i.group === 'Sistema') }
  ]
  return grps.filter(g => g.items.length > 0)
})
</script>
