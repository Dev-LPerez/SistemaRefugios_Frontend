<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 relative">
    <TheNavbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Gestión Integral de Albergues y Recursos
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Coordinación eficiente ante emergencias humanitarias
            </h1>
            <p class="text-sm sm:text-base text-emerald-100 max-w-xl leading-relaxed">
              Plataforma institucional para el censo de familias damnificadas, control de refugios temporales y la distribución organizada y transparente de ayuda humanitaria en Montería.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 pt-2 font-display text-xs uppercase font-bold tracking-wider">
              <router-link 
                to="/login" 
                class="inline-flex items-center justify-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-all w-full sm:w-auto shadow-sm"
              >
                Acceder a Sistema
              </router-link>
              <router-link 
                to="/about" 
                class="inline-flex items-center justify-center gap-2 bg-emerald-700/50 border border-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700/80 transition-all w-full sm:w-auto"
              >
                Conocer Más
              </router-link>
            </div>
          </div>
          
          <!-- Stats card visual -->
          <div class="lg:col-span-5">
            <div class="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5 text-slate-800 shadow-md">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Indicadores Operativos</span>
                <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase border border-emerald-100">Activo</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
                  <div class="text-2xl font-extrabold text-slate-900 font-display">4+</div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Refugios Habilitados</div>
                </div>
                <div class="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
                  <div class="text-2xl font-extrabold text-slate-900 font-display">300+</div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Familias Censadas</div>
                </div>
                <div class="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
                  <div class="text-2xl font-extrabold text-slate-900 font-display">1.2K+</div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Ayudas Entregadas</div>
                </div>
                <div class="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
                  <div class="text-2xl font-extrabold text-slate-900 font-display">100%</div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Monitoreo Real</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Preview -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 space-y-2">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">MÓDULOS DEL SISTEMA DE EMERGENCIA</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-xs font-semibold uppercase tracking-wider">
            Herramientas administrativas para el personal de socorro y control
          </p>
        </div>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div class="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors shadow-sm">
            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-2 font-display">Administración de Refugios</h3>
            <p class="text-slate-600 text-xs leading-relaxed">Registro y control de albergues municipales habilitados, monitoreo de su capacidad máxima y ocupación real de damnificados.</p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors shadow-sm">
            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-2 font-display">Censo y Focalización</h3>
            <p class="text-slate-600 text-xs leading-relaxed">Registro pormenorizado de las familias damnificadas y cálculo de prioridad bajo reglas de vulnerabilidad del motor de priorización.</p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors shadow-sm sm:col-span-2 md:col-span-1">
            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-2 font-display">Inventario de Ayudas</h3>
            <p class="text-slate-600 text-xs leading-relaxed">Gestión de insumos de ayuda humanitaria (alimentos, agua, kits de higiene) y control de stock mínimo en el almacén de asistencia.</p>
          </div>
        </div>

        <div class="text-center mt-10">
          <router-link 
            to="/about" 
            class="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase tracking-wider transition-colors font-display"
          >
            Ver Detalle Operativo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Acceso Autorizado para Personal del Municipio
        </h2>
        <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider max-w-xl mx-auto">
          Inicie sesión para acceder a las herramientas de control y reportes de ayuda humanitaria de Montería.
        </p>
        <div class="pt-2">
          <router-link 
            to="/login" 
            class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-lg font-bold font-display text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            Ingresar al Panel de Gestión
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-slate-50 text-slate-500 font-display text-xs">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <span class="font-extrabold tracking-wider text-slate-800">REFUGIOS MONTERÍA</span>
        </div>
        <p class="text-[10px] font-medium uppercase tracking-wide text-center sm:text-right text-slate-500">Alcaldía de Montería - Córdoba · Oficina de Gestión del Riesgo</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/TheNavbar.vue'
</script>
