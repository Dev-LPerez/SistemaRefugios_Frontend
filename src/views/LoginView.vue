<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="w-full max-w-md">
      <!-- Logo y Titulo -->
      <div class="text-center mb-6">
        <router-link to="/" class="inline-block group">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-xl mb-4 hover:bg-emerald-700 transition-colors shadow-sm">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </router-link>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">REFUGIOS MONTERÍA</h1>
        <p class="text-slate-500 text-xs font-medium tracking-wide uppercase mt-1">Plataforma de Gestión Administrativa</p>
      </div>

      <!-- Card de Login -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-md p-8">
        <h2 class="text-lg font-bold text-slate-800 uppercase tracking-wider font-display mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Ingreso Autorizado
        </h2>
        
        <!-- Error Message -->
        <div v-if="authStore.error" class="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg">
          <p class="text-xs text-rose-700 font-medium">{{ authStore.error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="user" class="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Usuario de Sistema
            </label>
            <input
              id="user"
              v-model="userInput"
              type="text"
              required
              placeholder="Ingresa tu usuario"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label for="password" class="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <svg v-if="authStore.loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ authStore.loading ? 'Verificando...' : 'Iniciar Acceso' }}</span>
          </button>
        </form>

        <!-- Credenciales de prueba -->
        <div class="mt-6 pt-5 border-t border-slate-100">
          <p class="text-[10px] font-bold uppercase text-slate-500 text-center mb-3">Credenciales de Acceso para Pruebas</p>
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg">
              <span class="text-slate-600 font-semibold">Administrador:</span>
              <span class="text-emerald-700 font-mono">admin / admin123</span>
            </div>
            <div class="flex justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg">
              <span class="text-slate-600 font-semibold">Operario:</span>
              <span class="text-emerald-700 font-mono">operario / operario123</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Volver al inicio -->
      <div class="mt-6 text-center">
        <router-link to="/" class="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-semibold uppercase tracking-wider">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al Inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userInput = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(userInput.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>
