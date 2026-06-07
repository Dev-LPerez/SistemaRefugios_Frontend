<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-extrabold tracking-wider text-slate-900 font-display uppercase leading-tight">REFUGIOS</span>
            <span class="text-[9px] font-mono tracking-widest text-indigo-600 -mt-0.5">MONTERÍA</span>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1.5 font-display text-xs uppercase font-bold tracking-wider">
          <router-link 
            to="/" 
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            :class="{ 'text-indigo-600 bg-slate-50': $route.path === '/' }"
          >
            Inicio
          </router-link>
          <router-link 
            to="/about" 
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            :class="{ 'text-indigo-600 bg-slate-50': $route.path === '/about' }"
          >
            Acerca de
          </router-link>
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              class="ml-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-sm"
            >
              Iniciar Sesión
            </router-link>
          </template>
          <template v-else>
            <router-link 
              to="/dashboard" 
              class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
              :class="{ 'text-indigo-600 bg-slate-50': $route.path === '/dashboard' }"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="ml-2 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer font-bold"
            >
              Cerrar Sesión
            </button>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-slate-100 mt-2 pt-4 font-display text-xs uppercase font-bold tracking-wider">
        <div class="flex flex-col gap-2">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            :class="{ 'text-indigo-600 bg-slate-50': $route.path === '/' }"
          >
            Inicio
          </router-link>
          <router-link 
            to="/about" 
            @click="mobileMenuOpen = false"
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            :class="{ 'text-indigo-600 bg-slate-50': $route.path === '/about' }"
          >
            Acerca de
          </router-link>
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              @click="mobileMenuOpen = false"
              class="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-center font-bold"
            >
              Iniciar Sesión
            </router-link>
          </template>
          <template v-else>
            <router-link 
              to="/dashboard" 
              @click="mobileMenuOpen = false"
              class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
              :class="{ 'text-indigo-600 bg-slate-50': $route.path === '/dashboard' }"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-left cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>
