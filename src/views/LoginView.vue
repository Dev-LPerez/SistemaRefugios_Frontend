<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
    <div class="w-full max-w-md">
      <!-- Logo y Titulo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 hover:bg-blue-700 transition-colors">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </router-link>
        <h1 class="text-2xl font-bold text-slate-800">Refugios Monteria</h1>
        <p class="text-slate-500 mt-1">Sistema de Gestion de Ayuda Humanitaria</p>
      </div>

      <!-- Card de Login -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-semibold text-slate-800 mb-6">Iniciar Sesion</h2>
        
        <!-- Error Message -->
        <div v-if="authStore.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ authStore.error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="user" class="block text-sm font-medium text-slate-700 mb-1">
              Usuario
            </label>
            <input
              id="user"
              v-model="userInput"
              type="text"
              required
              placeholder="Ingresa tu usuario"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1">
              Contrasena
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="********"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="authStore.loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}</span>
          </button>
        </form>

        <!-- Credenciales de prueba -->
        <div class="mt-6 pt-6 border-t border-slate-100">
          <p class="text-xs text-slate-400 text-center mb-3">Credenciales de prueba:</p>
          <div class="space-y-2 text-xs text-slate-500">
            <div class="flex justify-between bg-slate-50 p-2 rounded-lg">
              <span>Admin:</span>
              <span class="font-mono">admin / admin123</span>
            </div>
            <div class="flex justify-between bg-slate-50 p-2 rounded-lg">
              <span>Operario:</span>
              <span class="font-mono">operario / operario123</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Volver al inicio -->
      <div class="mt-6 text-center">
        <router-link to="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al inicio
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
