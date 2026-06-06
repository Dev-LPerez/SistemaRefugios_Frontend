<template>
  <div class="min-h-screen bg-slate-50">
    <TheNavbar />
    
    <!-- Header -->
    <section class="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-10 right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 left-20 w-48 h-48 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-4xl mx-auto text-center px-2">
        <span class="inline-block px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6 border border-white/20">
          Documentacion del Sistema
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Acerca del Sistema</h1>
        <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Conoce la plataforma de gestion de refugios y distribucion de ayuda humanitaria para emergencias
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        
        <!-- Introduccion -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Introduccion</h2>
              <p class="text-slate-600 leading-relaxed mb-4">
                El <strong class="text-slate-800">Sistema de Gestion de Refugios</strong> es una plataforma web desarrollada para coordinar 
                la atencion humanitaria en situaciones de emergencia en la ciudad de Monteria, Cordoba.
              </p>
              <p class="text-slate-600 leading-relaxed">
                Esta herramienta permite a las autoridades y organizaciones gestionar de manera eficiente 
                los albergues temporales, el censo de familias damnificadas, el inventario de recursos 
                y la distribucion equitativa de ayuda basada en criterios de priorizacion.
              </p>
            </div>
          </div>
        </div>

        <!-- Modulos del Sistema -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Modulos del Sistema</h2>
              <p class="text-slate-500">Componentes funcionales de la plataforma</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Modulo Login -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <svg class="w-5 h-5 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Login y Autenticacion</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Sistema de autenticacion segura mediante tokens JWT con control de sesiones.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>POST /login - Autenticacion</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>POST /logout - Cerrar sesion</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>GET /verify - Validar token</li>
              </ul>
            </div>

            <!-- Modulo Refugios -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <svg class="w-5 h-5 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Gestion de Refugios</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">CRUD completo para albergues temporales con control de capacidad y ocupacion.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Registro de ubicacion y coordenadas</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Control de capacidad maxima</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Estado: Activo/Inactivo</li>
              </ul>
            </div>

            <!-- Modulo Familias -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                  <svg class="w-5 h-5 text-amber-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Censo de Familias</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Registro de familias damnificadas con datos del jefe de hogar y ubicacion.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Asignacion a refugios</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Direccion de procedencia</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Puntaje de priorizacion</li>
              </ul>
            </div>

            <!-- Modulo Miembros -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                  <svg class="w-5 h-5 text-rose-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Miembros de Familia</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Detalle de cada integrante con condiciones de vulnerabilidad.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>Edad, genero, parentesco</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>Discapacidad, embarazo</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>Enfermedad cronica</li>
              </ul>
            </div>

            <!-- Modulo Recursos -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-600 transition-colors">
                  <svg class="w-5 h-5 text-cyan-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Inventario de Recursos</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Control de stock con alertas de minimo y fecha de caducidad.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>Tipos: Alimento, Enseres, Higiene</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>Stock actual vs minimo</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>Fecha de caducidad</li>
              </ul>
            </div>

            <!-- Modulo Donaciones -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                  <svg class="w-5 h-5 text-violet-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Donantes y Donaciones</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Registro de aportes con trazabilidad y actualizacion de inventario.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>Donantes: Persona/Empresa/ONG</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>Suma automatica al stock</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>Historial por donante</li>
              </ul>
            </div>

            <!-- Modulo Entregas -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <svg class="w-5 h-5 text-orange-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Gestion de Entregas</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Distribucion con validacion de stock y bloqueo temporal de 72 horas.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>Validacion de stock disponible</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>Bloqueo anti-duplicado 72h</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>Descuento automatico</li>
              </ul>
            </div>

            <!-- Modulo Priorizacion -->
            <div class="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                  <svg class="w-5 h-5 text-pink-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900">Sistema de Priorizacion</h3>
              </div>
              <p class="text-sm text-slate-600 mb-3">Calculo automatico de puntaje basado en vulnerabilidad de miembros.</p>
              <ul class="text-xs text-slate-500 space-y-1">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>+3 pts: Discapacidad</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>+2 pts: Embarazo, Enfermedad</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>+1 pt: Menor 5 anos, Mayor 65</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Objetivos -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Objetivos del Sistema</h2>
              <div class="grid sm:grid-cols-2 gap-3">
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-slate-700">Autenticacion segura mediante JWT</span>
                </div>
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-slate-700">Gestion de usuarios por roles</span>
                </div>
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-slate-700">Control de inventario con alertas</span>
                </div>
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-slate-700">Priorizacion automatica equitativa</span>
                </div>
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-slate-700">Trazabilidad de donaciones</span>
                </div>
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-slate-700">Reportes y dashboard en tiempo real</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tecnologias -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Stack Tecnologico</h2>
              <p class="text-slate-500">Tecnologias utilizadas en el desarrollo</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">Vue</div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">Vue.js 3</div>
                <div class="text-xs text-slate-500">Frontend</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
              <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">TW</div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">Tailwind CSS</div>
                <div class="text-xs text-slate-500">Estilos</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
              <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">Pinia</div>
                <div class="text-xs text-slate-500">Estado</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">TS</div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">TypeScript</div>
                <div class="text-xs text-slate-500">Tipado</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
              <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">PHP</div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">PHP 8</div>
                <div class="text-xs text-slate-500">Backend API</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">SQL</div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">MySQL</div>
                <div class="text-xs text-slate-500">Base de datos</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-center text-white">
          <h3 class="text-2xl font-bold mb-3">Accede al sistema</h3>
          <p class="text-blue-100 mb-6 max-w-lg mx-auto">
            Inicia sesion para comenzar a gestionar refugios, familias y distribucion de ayuda.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <router-link 
              to="/login" 
              class="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Iniciar Sesion
            </router-link>
            <router-link 
              to="/" 
              class="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              Volver al inicio
            </router-link>
          </div>
        </div>

      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-4 bg-slate-950 text-slate-500">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <span class="font-medium text-slate-400">Refugios Monteria</span>
        </div>
        <p class="text-sm">Sistema de Gestion Humanitaria - Monteria, Cordoba</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/TheNavbar.vue'
</script>
