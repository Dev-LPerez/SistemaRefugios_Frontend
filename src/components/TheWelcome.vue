<template>
  <section class="py-20 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        Sistema de Gestion Humanitaria
      </div>

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight text-balance">
        Gestion Integral de Refugios y Ayuda Humanitaria
      </h1>

      <!-- Description -->
      <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
        Plataforma centralizada para coordinar la atencion de familias damnificadas, 
        gestionar recursos y optimizar la distribucion de ayuda en situaciones de emergencia en Monteria.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/login"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          Acceder al Sistema
        </router-link>
        <router-link 
          to="/about"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold text-lg border border-slate-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Conocer mas
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
