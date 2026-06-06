<template>
  <AppLayout title="Entregas">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Gestión de Entregas
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Control y distribución de recursos humanitarios a familias damnificadas</p>
        </div>
        <button v-if="authStore.canManageEntregas" @click="abrirModal()" 
          class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-sm transition-all cursor-pointer">
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nueva Entrega
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Entregas</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ entregas.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Entregadas</p>
          <p class="text-2xl font-bold text-emerald-600 mt-2">{{ entregadas }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
          <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-amber-50/50 group-hover:bg-amber-50 blur-lg transition-all"></div>
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pendientes</p>
          <p class="text-2xl font-bold text-amber-600 mt-2">{{ pendientes }}</p>
        </div>
      </div>

      <!-- Aviso regla de 3 días -->
      <div class="bg-amber-50 border border-amber-250 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-md relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-800"><strong>Regla del sistema:</strong> El motor impide registrar dos entregas a la misma familia en menos de 3 días para garantizar una distribución equitativa.</p>
      </div>

      <!-- Tabs Selector -->
      <div class="flex border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
        <button 
          @click="activeTab = 'list'" 
          :class="['px-5 py-3 border-b-2 transition-all cursor-pointer font-display', activeTab === 'list' ? 'border-emerald-600 text-emerald-700 bg-emerald-50/10' : 'border-transparent text-slate-400 hover:text-slate-650']"
        >
          Historial de Entregas
        </button>
        <button 
          @click="activeTab = 'planning'" 
          :class="['px-5 py-3 border-b-2 transition-all cursor-pointer font-display flex items-center gap-2', activeTab === 'planning' ? 'border-emerald-600 text-emerald-700 bg-emerald-50/10' : 'border-transparent text-slate-400 hover:text-slate-650']"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Planificación y Focalización
        </button>
      </div>

      <!-- Tab: Historial -->
      <div v-if="activeTab === 'list'" class="space-y-6">
        <!-- Filters -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
          <div class="flex-1 min-w-[240px]">
            <input v-model="busqueda" type="text" placeholder="Buscar por familia o recurso..."
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
          </div>
          <div class="flex gap-1.5 text-[10px] uppercase tracking-wider flex-wrap font-semibold">
            <button @click="filtroEstado=''" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Todas</button>
            <button @click="filtroEstado='Entregado'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='Entregado' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Entregadas</button>
            <button @click="filtroEstado='pendiente'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='pendiente' ? 'bg-amber-50 border-amber-250 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Pendientes</button>
            <button @click="filtroEstado='cancelada'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='cancelada' ? 'bg-rose-50 border-rose-250 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Canceladas</button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <div v-if="loading" class="flex justify-center py-16"><svg class="animate-spin h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                  <th class="px-5 py-3.5">Familia / ID</th>
                  <th class="px-5 py-3.5">Recursos Entregados</th>
                  <th class="px-5 py-3.5 text-center">Estado</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Fecha</th>
                  <th v-if="authStore.canManageEntregas" class="px-5 py-3.5 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="e in paginados" :key="e.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                  <td class="px-5 py-4 border-b border-slate-100/40">
                    <div class="font-semibold text-slate-900 text-sm">{{ e.familia ?? `Familia #${e.id_familia}` }}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">REGISTRO: #{{ e.id }}</div>
                  </td>
                  <td class="px-5 py-4 border-b border-slate-100/40">
                    <div class="flex flex-wrap gap-1.5">
                      <div v-for="det in e.detalles" :key="det.id_detalle" class="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 font-medium shadow-sm">
                        <span>{{ det.recurso_nombre }}</span>
                        <span class="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 text-[9px]">x{{ det.cantidad }}</span>
                        <span class="text-slate-400 text-[9px] uppercase font-sans">{{ det.unidad }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-center border-b border-slate-100/40">
                    <div class="inline-block relative">
                      <select 
                        v-if="authStore.canManageEntregas"
                        :value="e.estado" 
                        @change="cambiarEstado(e, ($event.target as HTMLSelectElement).value)"
                        :class="['pl-3 pr-8 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border cursor-pointer focus:ring-0 focus:outline-none transition-colors appearance-none text-center', estadoColor(e.estado)]"
                      >
                        <option class="bg-white text-slate-800" value="Entregado">Entregado</option>
                        <option class="bg-white text-slate-800" value="pendiente">Pendiente</option>
                        <option class="bg-white text-slate-800" value="cancelada">Cancelada</option>
                      </select>
                      <span v-else :class="['inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border', estadoColor(e.estado)]">
                        {{ e.estado }}
                      </span>
                      <span v-if="authStore.canManageEntregas" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[8px]">▼</span>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-slate-500 text-xs hidden md:table-cell border-b border-slate-100/40">{{ e.fecha }}</td>
                  <td v-if="authStore.canManageEntregas" class="px-5 py-4 text-right border-b border-slate-100/40">
                    <button @click="eliminar(e)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors" title="Anular entrega (devuelve stock)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filtrados.length === 0">
                  <td :colspan="authStore.canManageEntregas ? 5 : 4" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">NO SE ENCONTRARON REGISTROS</td>
                </tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="filtrados.length > 0" v-model:page="page" v-model:perPage="perPage" :total="filtrados.length" />
        </div>
      </div>

      <!-- Tab: Planificación -->
      <div v-else-if="activeTab === 'planning'" class="space-y-6">
        <!-- Planning Instructions Alert -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3 shadow-md relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <svg class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
          <div class="text-xs text-indigo-900 space-y-1">
            <p class="font-bold uppercase tracking-wider text-[10px]">Focalizador Inteligente de Necesidades</p>
            <p>Este panel analiza el historial de entregas de cada familia censada, calcula el tiempo transcurrido desde su última ayuda y formula raciones sugeridas personalizadas en base al tamaño de su grupo familiar. Las familias catalogadas como <span class="font-bold text-rose-700 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">Crítico</span> o <span class="font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">Reabastecer</span> requieren atención prioritaria.</p>
          </div>
        </div>

        <!-- Planning Stats Summary & Stock Warnings -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-slate-50/50 blur-lg"></div>
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Familias en Censo</p>
            <p class="text-2xl font-bold text-slate-900 mt-2">{{ familias.length }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-md border-l-4 border-l-rose-500 relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-rose-50/20 blur-lg"></div>
            <p class="text-[10px] font-bold uppercase text-rose-500 tracking-wider">Estado Crítico</p>
            <p class="text-2xl font-bold text-rose-600 mt-2">{{ familiasCriticas }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-md border-l-4 border-l-amber-500 relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-amber-50/20 blur-lg"></div>
            <p class="text-[10px] font-bold uppercase text-amber-500 tracking-wider">Reabastecer</p>
            <p class="text-2xl font-bold text-amber-600 mt-2">{{ familiasReabastecer }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-md border-l-4 border-l-emerald-500 relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/20 blur-lg"></div>
            <p class="text-[10px] font-bold uppercase text-emerald-500 tracking-wider">Cubiertos</p>
            <p class="text-2xl font-bold text-emerald-600 mt-2">{{ familiasCubiertas }}</p>
          </div>
        </div>

        <!-- Stock Coverage Alerts -->
        <div v-if="alertasStock.length > 0" class="space-y-2">
          <div v-for="alerta in alertasStock" :key="alerta.tipo" class="bg-rose-50 border border-rose-250 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-md relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <svg class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div class="text-xs text-rose-900 font-semibold">
              <strong>Insuficiencia de stock en bodega:</strong> {{ alerta.mensaje }}
            </div>
          </div>
        </div>

        <!-- Planning Filters -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center shadow-md">
          <input v-model="busquedaPlaning" type="text" placeholder="Buscar familia por representante o cédula..."
            class="flex-1 min-w-40 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
          <select v-model="filtroAlerta" class="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-emerald-500 outline-none cursor-pointer">
            <option value="">Todos los estados de alerta</option>
            <option value="critico">Crítico (Sin recibir o >7 días)</option>
            <option value="alerta">Reabastecer (3 a 7 días)</option>
            <option value="cubierto">Cubierto (&lt;3 días)</option>
          </select>
        </div>

        <!-- Planning Table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs text-slate-700">
              <thead>
                <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                  <th class="px-4 py-3.5">Familia Damnificada</th>
                  <th class="px-4 py-3.5 text-center">Integrantes</th>
                  <th class="px-4 py-3.5">Última Asistencia</th>
                  <th class="px-4 py-3.5 text-center">Días Transcurridos</th>
                  <th class="px-4 py-3.5">Ración Sugerida (Agua / Comida)</th>
                  <th class="px-4 py-3.5 text-center">Estado Alerta</th>
                  <th v-if="authStore.canManageEntregas" class="px-4 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fam in familiasPlanificadas" :key="fam.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                  <td class="px-4 py-3.5 border-b border-slate-100/40">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-slate-900 text-sm">{{ fam.representante }}</span>
                      <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider', Number(fam.prioridad) >= 80 ? 'bg-rose-50 border-rose-250 text-rose-700' : Number(fam.prioridad) >= 50 ? 'bg-amber-50 border-amber-250 text-amber-700' : 'bg-emerald-50 border-emerald-250 text-emerald-700']" title="Puntaje de Prioridad del Censo">
                        Prio: {{ fam.prioridad }}
                      </span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">C.C. {{ fam.cedula || '—' }} · {{ fam.direccion || 'Sin dirección' }}</div>
                  </td>
                  <td class="px-4 py-3.5 text-center border-b border-slate-100/40 font-bold text-slate-800">{{ fam.cantidad_miembros }}</td>
                  <td class="px-4 py-3.5 border-b border-slate-100/40">
                    <span class="font-semibold">{{ infoUltimaAyuda(fam.id).fecha }}</span>
                  </td>
                  <td class="px-4 py-3.5 text-center border-b border-slate-100/40 font-semibold">
                    <span v-if="infoUltimaAyuda(fam.id).dias !== null" :class="[infoUltimaAyuda(fam.id).dias >= 7 ? 'text-rose-600 font-extrabold' : infoUltimaAyuda(fam.id).dias >= 3 ? 'text-amber-600' : 'text-green-600']">
                      {{ infoUltimaAyuda(fam.id).dias }} días
                    </span>
                    <span v-else class="text-rose-600 font-extrabold">—</span>
                  </td>
                  <td class="px-4 py-3.5 border-b border-slate-100/40">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-semibold text-slate-700">💧 Agua: <strong class="text-indigo-700">{{ fam.cantidad_miembros * 6 }} Litros</strong></span>
                      <span class="font-semibold text-slate-700">🌾 Alimento: <strong class="text-emerald-700">{{ fam.cantidad_miembros * 4.5 }} Kg</strong></span>
                      <span class="text-[10px] text-slate-400">🎒 Kit Higiene: {{ fam.cantidad_miembros > 3 ? '2 unidades' : '1 unidad' }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3.5 text-center border-b border-slate-100/40">
                    <span :class="['inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider', alertaStyling(infoUltimaAyuda(fam.id).nivel)]">
                      {{ alertaLabel(infoUltimaAyuda(fam.id).nivel) }}
                    </span>
                  </td>
                  <td v-if="authStore.canManageEntregas" class="px-4 py-3.5 text-right border-b border-slate-100/40">
                    <button 
                      v-if="infoUltimaAyuda(fam.id).nivel !== 'cubierto'"
                      @click="planificarEntrega(fam)" 
                      class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                      Entregar ración
                    </button>
                    <span v-else class="text-[10px] text-slate-400 font-semibold bg-slate-100 border border-slate-200/50 px-2 py-1 rounded-lg select-none" title="No elegible temporalmente">
                      ⏳ Cubierto
                    </span>
                  </td>
                </tr>
                <tr v-if="familiasPlanificadas.length === 0">
                  <td colspan="7" class="px-4 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">No se encontraron familias para el criterio de búsqueda</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Entrega Multi-recurso -->
    <div v-if="modalVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">Nueva Entrega Multi-recurso</h2>
            <p class="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">El inventario se debita en tiempo real al registrar</p>
          </div>
          <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <!-- Selector de familia -->
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Familia Beneficiaria *</label>
            <select v-model.number="form.id_familia" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
              <option :value="0">Seleccionar familia...</option>
              <option v-for="f in familias" :key="f.id" :value="f.id">{{ f.representante }} ({{ f.cedula }})</option>
            </select>
          </div>

          <!-- Fecha y Estado -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Fecha de Entrega *</label>
              <input v-model="form.fecha" type="date" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Estado Inicial</label>
              <select v-model="form.estado" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
                <option value="Entregado">Entregado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <!-- Sección de productos a entregar -->
          <div class="border border-slate-200 bg-slate-50/70 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              Lista de Insumos / Recursos
            </h3>

            <!-- Mini-tabla de productos ya agregados -->
            <div v-if="productosEntrega.length > 0" class="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-550 uppercase tracking-wider font-semibold">
                    <th class="px-3 py-2 font-bold">Recurso</th>
                    <th class="px-3 py-2 font-bold text-center">Cantidad</th>
                    <th class="px-3 py-2 font-bold text-right">Quitar</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-750">
                  <tr v-for="(prod, idx) in productosEntrega" :key="idx" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-3 py-2 font-medium text-slate-900">{{ nombreRecurso(prod.id_recurso) }}</td>
                    <td class="px-3 py-2 text-center font-bold text-emerald-700">{{ prod.cantidad }} {{ unidadRecurso(prod.id_recurso) }}</td>
                    <td class="px-3 py-2 text-right">
                      <button @click="eliminarProducto(idx)" class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Quitar">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mensaje cuando no hay productos -->
            <p v-else class="text-xs text-slate-400 text-center py-2 uppercase tracking-wide">Agrega insumos a esta entrega</p>

            <!-- Fila para agregar nuevo producto -->
            <div class="flex gap-3 items-end pt-2 border-t border-slate-200">
              <div class="flex-1">
                <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Elegir Insumo</label>
                <select v-model.number="nuevoProducto.id_recurso" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
                  <option :value="0">Seleccionar...</option>
                  <option
                    v-for="r in recursos"
                    :key="r.id"
                    :value="r.id"
                    :disabled="r.cantidad_disponible === 0 || recursoYaAgregado(r.id)"
                  >
                    {{ r.nombre }} ({{ stockDisponibleParaRecurso(r.id) }} {{ r.unidad }})
                    {{ recursoYaAgregado(r.id) ? '— ya asignado' : '' }}
                  </option>
                </select>
              </div>
              <div class="w-20">
                <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Cant.</label>
                <input
                  v-model.number="nuevoProducto.cantidad"
                  type="number"
                  min="1"
                  :max="stockDelRecursoSeleccionado"
                  class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"
                />
              </div>
              <button
                @click="agregarProducto"
                :disabled="!puedeAgregarProducto"
                class="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-100/50 disabled:bg-white disabled:border-slate-200 disabled:text-slate-350 transition-all cursor-pointer shadow-sm"
              >
                + Añadir
              </button>
            </div>

            <!-- Info de stock del recurso seleccionado -->
            <p v-if="nuevoProducto.id_recurso" class="text-[10px] text-slate-500 uppercase">
              Stock disponible real: <span class="font-bold text-emerald-600">{{ stockDelRecursoSeleccionado }}</span>
              {{ unidadRecurso(nuevoProducto.id_recurso) }}
            </p>
          </div>

          <!-- Errores del modal -->
          <div v-if="modalError" class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 whitespace-pre-line">
            {{ modalError }}
          </div>
        </div>

        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="cerrarModal" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardar" :disabled="saving || productosEntrega.length === 0" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">
            {{ saving ? 'Procesando...' : `Guardar Entrega (${productosEntrega.length})` }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useAuthStore } from '@/stores/auth'
import type { Entrega, Familia, Recurso } from '@/types'
import { apiGetEntregas, apiCreateEntrega, apiUpdateEntregaEstado, apiDeleteEntrega, apiGetFamilias, apiGetRecursos } from '@/services/api'

// ─── Stores y estado general ──────────────────────────────────────────────────

const authStore = useAuthStore()
const entregas = ref<Entrega[]>([])
const familias = ref<Familia[]>([])
const recursos = ref<Recurso[]>([])
const loading = ref(true)

// Tab: Historial o Planificación
const activeTab = ref<'list' | 'planning'>('list')
const busquedaPlaning = ref('')
const filtroAlerta = ref('')
const saving = ref(false)
const error = ref('')
const modalError = ref('')
const busqueda = ref('')
const filtroEstado = ref('')
const page = ref(1)
const perPage = ref(20)
const modalVisible = ref(false)
const today = new Date().toISOString().split('T')[0]

// ─── Formulario base (familia, fecha, estado) ─────────────────────────────────

// Estado por defecto = 'Entregado' (con mayúscula, como espera el backend)
const form = ref({
  id_familia: 0,
  fecha: today,
  estado: 'Entregado',
})

// ─── Array de productos para entrega multi-recurso ────────────────────────────

interface ProductoEntrega {
  id_recurso: number
  cantidad: number
}

const productosEntrega = ref<ProductoEntrega[]>([])

// Producto que se está configurando antes de agregar
const nuevoProducto = ref<ProductoEntrega>({ id_recurso: 0, quantity: 1 } as any) // handle key mapping

// ─── Computados de la tabla principal ─────────────────────────────────────────

const entregadas = computed(() => entregas.value.filter(e => e.estado?.toLowerCase() === 'entregado').length)
const pendientes = computed(() => entregas.value.filter(e => e.estado?.toLowerCase() === 'pendiente').length)

const filtrados = computed(() => {
  let list = entregas.value
  if (filtroEstado.value) list = list.filter(e => e.estado?.toLowerCase() === filtroEstado.value.toLowerCase())
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(e => 
      (e.familia ?? '').toLowerCase().includes(q) || 
      (e.detalles ?? []).some(d => (d.recurso_nombre ?? '').toLowerCase().includes(q))
    )
  }
  return list
})
const paginados = computed(() => filtrados.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

// ─── Helpers de recursos ──────────────────────────────────────────────────────

/** Nombre del recurso por su ID */
function nombreRecurso(id: number): string {
  return recursos.value.find(r => r.id === id)?.nombre ?? `Recurso #${id}`
}

/** Unidad de medida del recurso por su ID */
function unidadRecurso(id: number): string {
  return recursos.value.find(r => r.id === id)?.unidad ?? ''
}

/** Verifica si un recurso ya fue agregado a la lista de productos */
function recursoYaAgregado(id: number): boolean {
  return productosEntrega.value.some(p => p.id_recurso === id)
}

/**
 * Stock disponible considerando lo que ya se ha agregado al carrito.
 * Si el recurso ya está en productosEntrega, se resta la cantidad asignada.
 */
function stockDisponibleParaRecurso(id: number): number {
  const recurso = recursos.value.find(r => r.id === id)
  if (!recurso) return 0
  const yaAsignado = productosEntrega.value
    .filter(p => p.id_recurso === id)
    .reduce((sum, p) => sum + p.cantidad, 0)
  return recurso.cantidad_disponible - yaAsignado
}

/** Stock disponible del recurso seleccionado en el selector de nuevo producto */
const stockDelRecursoSeleccionado = computed(() => {
  if (!nuevoProducto.value.id_recurso) return 0
  return stockDisponibleParaRecurso(nuevoProducto.value.id_recurso)
})

/** Valida si se puede agregar el producto actual al carrito */
const puedeAgregarProducto = computed(() => {
  const np = nuevoProducto.value
  if (!np.id_recurso || np.cantidad < 1) return false
  if (recursoYaAgregado(np.id_recurso)) return false
  if (np.cantidad > stockDelRecursoSeleccionado.value) return false
  return true
})

// ─── Estilo de estado (badge de color) ────────────────────────────────────────

function estadoColor(estado: string) {
  const e = estado?.toLowerCase() ?? ''
  if (e === 'entregado') return 'border-emerald-200 text-emerald-700 bg-emerald-50'
  if (e === 'cancelada' || e === 'cancelado') return 'border-rose-200 text-rose-700 bg-rose-50'
  return 'border-amber-200 text-amber-700 bg-amber-50'
}

// ─── Carga inicial de datos ───────────────────────────────────────────────────

onMounted(async () => {
  const [resE, resF, resR] = await Promise.all([apiGetEntregas(), apiGetFamilias(), apiGetRecursos()])
  if (resE.success && resE.data) entregas.value = resE.data
  else error.value = resE.message ?? 'Error al cargar entregas'
  if (resF.success && resF.data) familias.value = resF.data
  if (resR.success && resR.data) recursos.value = resR.data
  loading.value = false
})

// ─── Funciones del modal multi-recurso ────────────────────────────────────────

function abrirModal() {
  form.value = { id_familia: 0, fecha: today, estado: 'Entregado' }
  productosEntrega.value = []
  nuevoProducto.value = { id_recurso: 0, cantidad: 1 }
  modalError.value = ''
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
}

/** Agrega un producto a la lista de entrega */
function agregarProducto() {
  if (!puedeAgregarProducto.value) return

  productosEntrega.value.push({
    id_recurso: nuevoProducto.value.id_recurso,
    cantidad: nuevoProducto.value.cantidad,
  })

  // Resetear selector para el siguiente producto
  nuevoProducto.value = { id_recurso: 0, cantidad: 1 }
}

/** Elimina un producto de la lista por índice */
function eliminarProducto(index: number) {
  productosEntrega.value.splice(index, 1)
}

/** Registra la entrega con múltiples recursos acumulados en una sola llamada */
async function guardar() {
  // Validaciones generales
  if (!form.value.id_familia) {
    modalError.value = 'Selecciona una familia'
    return
  }
  if (productosEntrega.value.length === 0) {
    modalError.value = 'Agrega al menos un producto a la entrega'
    return
  }

  saving.value = true
  modalError.value = ''

  try {
    const res = await apiCreateEntrega({
      estado: form.value.estado,
      fecha: form.value.fecha,
      id_familia: form.value.id_familia,
      recursos: productosEntrega.value.map(prod => ({
        id_recurso: prod.id_recurso,
        cantidad: prod.cantidad
      }))
    })

    if (res.success) {
      // Recargar datos y cerrar modal
      const [resE, resR] = await Promise.all([apiGetEntregas(), apiGetRecursos()])
      if (resE.success && resE.data) entregas.value = resE.data
      if (resR.success && resR.data) recursos.value = resR.data
      modalVisible.value = false
    } else {
      modalError.value = res.message ?? 'Error al registrar la entrega'
    }
  } catch (err: any) {
    modalError.value = err.response?.data?.message ?? err.message ?? 'Error de conexión'
  } finally {
    saving.value = false
  }
}

// ─── Cambiar estado de entrega ────────────────────────────────────────────────

async function cambiarEstado(e: Entrega, nuevoEstado: string) {
  try {
    const res = await apiUpdateEntregaEstado(e.id, nuevoEstado)
    if (res.success) {
      e.estado = nuevoEstado
      // Actualizar stock
      const resR = await apiGetRecursos()
      if (resR.success && resR.data) recursos.value = resR.data
    } else {
      alert(res.message ?? 'Error al actualizar el estado')
      const resE = await apiGetEntregas()
      if (resE.success && resE.data) entregas.value = resE.data
    }
  } catch (err: any) {
    alert(err.message ?? 'Error de conexión')
    const resE = await apiGetEntregas()
    if (resE.success && resE.data) entregas.value = resE.data
  }
}

// ─── Eliminar entrega existente ───────────────────────────────────────────────

async function eliminar(e: Entrega) {
  const motivo = prompt(`¿Está seguro de anular esta entrega? Se devolverá el stock al inventario. Ingrese el motivo de la anulación:`)
  if (motivo === null) return
  if (!motivo.trim()) {
    alert('El motivo de la anulación es obligatorio.')
    return
  }
  const res = await apiDeleteEntrega(e.id, motivo.trim())
  if (res.success) {
    entregas.value = entregas.value.filter(x => x.id !== e.id)
    // Actualizar stock
    const resR = await apiGetRecursos()
    if (resR.success && resR.data) recursos.value = resR.data
  } else {
    error.value = res.message ?? 'Error al anular'
  }
}

// ─── Planificación y Focalización ─────────────────────────────────────────────

function getUltimaEntrega(familyId: number): Entrega | null {
  const fEntregas = entregas.value.filter(e => e.id_familia === familyId)
  const exitosas = fEntregas.filter(e => e.estado?.toLowerCase() === 'entregado')
  if (exitosas.length === 0) return null
  return [...exitosas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0]
}

function diasTranscurridos(fechaStr: string): number {
  const t1 = new Date(fechaStr).getTime()
  const t2 = new Date().getTime()
  const diffTime = t2 - t1
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

function infoUltimaAyuda(famId: number) {
  const ult = getUltimaEntrega(famId)
  if (!ult) return { fecha: 'Nunca', dias: null, nivel: 'critico' }
  const dias = diasTranscurridos(ult.fecha)
  let nivel = 'critico'
  if (dias < 3) nivel = 'cubierto'
  else if (dias <= 7) nivel = 'alerta'
  return { fecha: formatDate(ult.fecha), dias, nivel }
}

function planificacionFiltro(fam: Familia) {
  const info = infoUltimaAyuda(fam.id)
  if (filtroAlerta.value && info.nivel !== filtroAlerta.value) return false
  if (busquedaPlaning.value) {
    const q = busquedaPlaning.value.toLowerCase()
    return fam.representante.toLowerCase().includes(q) || (fam.cedula ?? '').includes(q)
  }
  return true
}

const familiasPlanificadas = computed(() => {
  return familias.value.filter(planificacionFiltro)
})

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', { dateStyle: 'short' })
  } catch {
    return dateStr
  }
}

function alertaStyling(nivel: string) {
  if (nivel === 'cubierto') return 'bg-green-50 text-green-700 border-green-200 bg-green-50/60'
  if (nivel === 'alerta') return 'bg-amber-50 text-amber-700 border-amber-200 bg-amber-50/60'
  return 'bg-rose-50 text-rose-700 border-rose-200 bg-rose-50/60'
}

function alertaLabel(nivel: string) {
  if (nivel === 'cubierto') return 'Cubierto'
  if (nivel === 'alerta') return 'Reabastecer'
  return 'Crítico'
}

function planificarEntrega(family: Familia) {
  abrirModal()
  form.value.id_familia = family.id
  
  // Buscar recurso de agua
  const recAgua = recursos.value.find(r => 
    r.tipo?.toLowerCase() === 'agua' || 
    r.nombre?.toLowerCase().includes('agua')
  )
  if (recAgua && recAgua.cantidad_disponible > 0) {
    const cant = Math.min(family.cantidad_miembros * 6, recAgua.cantidad_disponible)
    productosEntrega.value.push({ id_recurso: recAgua.id, cantidad: cant })
  }
  
  // Buscar recurso de alimento
  const recComida = recursos.value.find(r => 
    r.tipo?.toLowerCase() === 'alimento' || 
    r.nombre?.toLowerCase().includes('arroz') || 
    r.nombre?.toLowerCase().includes('comida') ||
    r.nombre?.toLowerCase().includes('alimento')
  )
  if (recComida && recComida.cantidad_disponible > 0) {
    const cant = Math.min(Math.round(family.cantidad_miembros * 4.5), recComida.cantidad_disponible)
    productosEntrega.value.push({ id_recurso: recComida.id, cantidad: cant })
  }

  // Buscar kit de higiene
  const recKit = recursos.value.find(r => 
    r.tipo?.toLowerCase() === 'higiene' || 
    r.nombre?.toLowerCase().includes('kit') || 
    r.nombre?.toLowerCase().includes('jabon') ||
    r.nombre?.toLowerCase().includes('aseo')
  )
  if (recKit && recKit.cantidad_disponible > 0) {
    const cant = Math.min(family.cantidad_miembros > 3 ? 2 : 1, recKit.cantidad_disponible)
    productosEntrega.value.push({ id_recurso: recKit.id, cantidad: cant })
  }
}

const familiasCriticas = computed(() => {
  return familias.value.filter(f => infoUltimaAyuda(f.id).nivel === 'critico').length
})

const familiasReabastecer = computed(() => {
  return familias.value.filter(f => infoUltimaAyuda(f.id).nivel === 'alerta').length
})

const familiasCubiertas = computed(() => {
  return familias.value.filter(f => infoUltimaAyuda(f.id).nivel === 'cubierto').length
})

const alertasStock = computed(() => {
  const alerts: { tipo: string, mensaje: string }[] = []
  
  const famsPorAtender = familias.value.filter(f => {
    const nivel = infoUltimaAyuda(f.id).nivel
    return nivel === 'critico' || nivel === 'alerta'
  })
  
  // 1. Calcular necesidades de Agua
  const totalAguaRequerida = famsPorAtender.reduce((sum, f) => sum + (f.cantidad_miembros * 6), 0)
  const recAgua = recursos.value.find(r => r.tipo?.toLowerCase() === 'agua' || r.nombre?.toLowerCase().includes('agua'))
  const stockAgua = recAgua ? recAgua.cantidad_disponible : 0
  
  if (stockAgua < totalAguaRequerida) {
    alerts.push({
      tipo: 'agua',
      mensaje: `Se requieren ${totalAguaRequerida} Litros de Agua para abastecer a las familias en estado crítico/alerta, pero solo hay ${stockAgua} Litros disponibles en inventario.`
    })
  }

  // 2. Calcular necesidades de Alimento
  const totalComidaRequerida = famsPorAtender.reduce((sum, f) => sum + (f.cantidad_miembros * 4.5), 0)
  const recComida = recursos.value.find(r => 
    r.tipo?.toLowerCase() === 'alimento' || 
    r.nombre?.toLowerCase().includes('arroz') || 
    r.nombre?.toLowerCase().includes('comida') ||
    r.nombre?.toLowerCase().includes('alimento')
  )
  const stockComida = recComida ? recComida.cantidad_disponible : 0
  
  if (stockComida < totalComidaRequerida) {
    alerts.push({
      tipo: 'alimento',
      mensaje: `Se requieren ${Math.round(totalComidaRequerida)} kg de Alimento para abastecer a las familias en estado crítico/alerta, pero solo hay ${stockComida} kg disponibles en inventario.`
    })
  }
  
  return alerts
})
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
