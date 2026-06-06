<template>
  <header class="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div>
            <span class="text-lg font-bold text-slate-800">Refugios</span>
            <span class="hidden sm:inline text-sm text-slate-500 ml-1">Monteria</span>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <router-link 
            to="/" 
            class="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
          >
            Inicio
          </router-link>
          <router-link 
            to="/about" 
            class="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/about' }"
          >
            Acerca de
          </router-link>
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              class="ml-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Iniciar Sesion
            </router-link>
          </template>
          <template v-else>
            <router-link 
              to="/dashboard" 
              class="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/dashboard' }"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="ml-2 px-5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Cerrar Sesion
            </button>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-slate-100 mt-2 pt-4">
        <div class="flex flex-col gap-2">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            Inicio
          </router-link>
          <router-link 
            to="/about" 
            @click="mobileMenuOpen = false"
            class="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            Acerca de
          </router-link>
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              @click="mobileMenuOpen = false"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
            >
              Iniciar Sesion
            </router-link>
          </template>
          <template v-else>
            <router-link 
              to="/dashboard" 
              @click="mobileMenuOpen = false"
              class="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-left"
            >
              Cerrar Sesion
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
