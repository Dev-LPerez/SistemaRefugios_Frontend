<template>
  <div class="min-h-screen bg-slate-50">
    <TheNavbar />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-4 sm:px-0">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span class="inline-block px-3 py-1.5 sm:px-4 bg-white/20 backdrop-blur rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              Sistema de Gestion Humanitaria
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Coordinacion eficiente para situaciones de emergencia
            </h1>
            <p class="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Plataforma integral para la gestion de refugios temporales, censo de familias 
              damnificadas y distribucion equitativa de ayuda humanitaria en Monteria, Cordoba.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <router-link 
                to="/login" 
                class="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 w-full sm:w-auto"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Iniciar Sesion
              </router-link>
              <router-link 
                to="/about" 
                class="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Conocer mas
              </router-link>
            </div>
          </div>
          
          <!-- Stats card: visible en mobile como fila compacta, panel completo en lg -->
          <div class="lg:hidden mt-8">
            <div class="grid grid-cols-4 gap-2">
              <div class="bg-white/10 rounded-xl p-3 text-center">
                <div class="text-2xl font-bold">4+</div>
                <div class="text-xs text-blue-200">Refugios</div>
              </div>
              <div class="bg-white/10 rounded-xl p-3 text-center">
                <div class="text-2xl font-bold">300+</div>
                <div class="text-xs text-blue-200">Familias</div>
              </div>
              <div class="bg-white/10 rounded-xl p-3 text-center">
                <div class="text-2xl font-bold">1K+</div>
                <div class="text-xs text-blue-200">Entregas</div>
              </div>
              <div class="bg-white/10 rounded-xl p-3 text-center">
                <div class="text-2xl font-bold">24/7</div>
                <div class="text-xs text-blue-200">Activo</div>
              </div>
            </div>
          </div>

          <div class="hidden lg:block">
            <div class="relative">
              <div class="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur-2xl opacity-30"></div>
              <div class="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white/10 rounded-xl p-4 text-center">
                    <div class="text-3xl font-bold">4+</div>
                    <div class="text-sm text-blue-200">Refugios</div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 text-center">
                    <div class="text-3xl font-bold">300+</div>
                    <div class="text-sm text-blue-200">Familias</div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 text-center">
                    <div class="text-3xl font-bold">1K+</div>
                    <div class="text-sm text-blue-200">Entregas</div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 text-center">
                    <div class="text-3xl font-bold">24/7</div>
                    <div class="text-sm text-blue-200">Activo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Preview -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">Funcionalidades principales</h2>
          <p class="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Todo lo que necesitas para gestionar emergencias humanitarias de manera eficiente
          </p>
        </div>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          <div class="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-slate-900 mb-2">Gestion de Refugios</h3>
            <p class="text-slate-600 text-sm">Control de albergues, capacidad y ocupacion en tiempo real.</p>
          </div>

          <div class="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all">
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-slate-900 mb-2">Censo de Familias</h3>
            <p class="text-slate-600 text-sm">Registro de damnificados con condiciones de vulnerabilidad.</p>
          </div>

          <div class="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all sm:col-span-2 md:col-span-1">
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-amber-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-slate-900 mb-2">Reportes en Tiempo Real</h3>
            <p class="text-slate-600 text-sm">Dashboard con indicadores y estadisticas actualizadas.</p>
          </div>
        </div>

        <div class="text-center mt-8 sm:mt-10">
          <router-link 
            to="/about" 
            class="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            Ver todos los modulos
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
          Accede al sistema de gestion
        </h2>
        <p class="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
          Inicia sesion para comenzar a gestionar refugios, familias y recursos.
        </p>
        <router-link 
          to="/login" 
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Acceder al Sistema
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-500">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <span class="font-medium text-slate-400">Refugios Monteria</span>
        </div>
        <p class="text-xs sm:text-sm text-center sm:text-right">Sistema de Gestion Humanitaria - Monteria, Cordoba</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/TheNavbar.vue'
</script>
