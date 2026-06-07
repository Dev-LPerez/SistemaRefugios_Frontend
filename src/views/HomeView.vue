<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
    <div>
      <TheNavbar />
      
      <!-- Main Terminal Console -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div class="grid lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Console Identification & Restricted Access Notice -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Terminal Operativo · Alcaldía de Montería
            </div>
            
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight font-display uppercase">
              Sistema de Gestión &amp; Alivio Humanitario
            </h1>
            
            <p class="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Consola centralizada para la coordinación de recursos, censo de familias afectadas y control de ocupación en refugios temporales bajo la Oficina de Gestión del Riesgo de Desastres.
            </p>

            <!-- Security Alert / Warning Box -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-xl text-xs text-amber-900">
              <div class="flex gap-2">
                <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div>
                  <strong class="font-bold uppercase tracking-wider block mb-1">Aviso de Seguridad Operacional</strong>
                  El acceso a esta plataforma es de carácter confidencial y restringido para personal oficial y de socorro certificado. Todas las acciones son auditadas en tiempo real.
                </div>
              </div>
            </div>

            <!-- Quick Actions Gate -->
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <template v-if="!authStore.isAuthenticated">
                <router-link 
                  to="/login" 
                  class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold font-display text-xs uppercase tracking-wider transition-all shadow-sm w-full sm:w-auto cursor-pointer"
                >
                  Ingresar con Credenciales
                  <svg class="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h16.5a1.5 1.5 0 001.5-1.5V12a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 12v8.25a1.5 1.5 0 001.5 1.5z"/>
                  </svg>
                </router-link>
              </template>
              <template v-else>
                <router-link 
                  to="/dashboard" 
                  class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold font-display text-xs uppercase tracking-wider transition-all shadow-sm w-full sm:w-auto cursor-pointer"
                >
                  Acceder a la Consola de Control
                  <svg class="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"/>
                  </svg>
                </router-link>
              </template>
              <router-link 
                to="/about" 
                class="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-650 px-6 py-3 rounded-xl font-bold font-display text-xs uppercase tracking-wider hover:bg-slate-50 transition-all w-full sm:w-auto"
              >
                Manual &amp; Protocolo Operativo
              </router-link>
            </div>
          </div>
          
          <!-- Right: Real-time local status monitor -->
          <div class="lg:col-span-5">
            <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-slate-800 shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <div class="flex items-center justify-between border-b border-slate-150 pb-3">
                <div class="flex items-center gap-2">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Estado de la Emergencia</span>
                </div>
                <span class="text-[10px] font-mono font-bold text-slate-400">MONTERÍA</span>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Refugios Activos</div>
                  <div class="text-2xl font-extrabold text-slate-900 mt-1 font-display">4</div>
                  <div class="text-[9px] text-slate-500 mt-1">Capacidades asignadas</div>
                </div>
                
                <div class="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Familias Registradas</div>
                  <div class="text-2xl font-extrabold text-slate-900 mt-1 font-display">312</div>
                  <div class="text-[9px] text-slate-500 mt-1">Censo municipal</div>
                </div>
                
                <div class="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entregas de Insumos</div>
                  <div class="text-2xl font-extrabold text-slate-900 mt-1 font-display">1,248</div>
                  <div class="text-[9px] text-slate-500 mt-1">Últimas 72 horas</div>
                </div>
                
                <div class="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Capacidad Ocupada</div>
                  <div class="text-2xl font-extrabold text-rose-600 mt-1 font-display">78%</div>
                  <div class="text-[9px] text-slate-500 mt-1">Nivel crítico consolidado</div>
                </div>
              </div>

              <!-- Operational contact directory in case of severe escalation -->
              <div class="border-t border-slate-150 pt-4 space-y-2 text-[11px] text-slate-650">
                <span class="font-bold text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Contactos del Puesto de Mando (PMU)</span>
                <div class="flex justify-between">
                  <span>Coordinación Operativa:</span>
                  <span class="font-semibold text-slate-800">312-XXX-XXXX</span>
                </div>
                <div class="flex justify-between">
                  <span>Oficina de Riesgo Municipal:</span>
                  <span class="font-semibold text-slate-800">315-XXX-XXXX</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="py-6 px-4 border-t border-slate-200 bg-white text-slate-500 font-display text-xs">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <span class="font-bold tracking-wider text-slate-800">REFUGIOS MONTERÍA</span>
        </div>
        <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Alcaldía de Montería · Oficina de Gestión del Riesgo</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/TheNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
