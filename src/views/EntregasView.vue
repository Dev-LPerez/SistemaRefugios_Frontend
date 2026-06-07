<template>
  <AppLayout title="Entregas">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-650"></span>
            Distribución & Focalización de Ayuda
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Control y entrega de raciones humanitarias a familias damnificadas</p>
        </div>
        <button v-if="authStore.canManageEntregas" @click="abrirModal()" 
          class="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 shadow-sm transition-all cursor-pointer">
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nueva Entrega
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Entregas</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-2">{{ entregas.length }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Entregadas</p>
          <p class="text-2xl font-extrabold text-emerald-600 mt-2">{{ entregadas }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm">
          <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pendientes</p>
          <p class="text-2xl font-extrabold text-amber-600 mt-2">{{ pendientes }}</p>
        </div>
      </div>

      <!-- Aviso regla de 3 días -->
      <div class="bg-amber-50 border border-amber-250 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-800"><strong>Seguridad Humanitaria:</strong> Se impide registrar dos entregas a una misma familia en menos de 3 días para garantizar un reparto equitativo de suministros.</p>
      </div>

      <!-- Tabs Selector -->
      <div class="flex border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
        <button 
          @click="activeTab = 'list'" 
          :class="['px-5 py-3 border-b-2 transition-all cursor-pointer font-display', activeTab === 'list' ? 'border-indigo-650 text-indigo-650' : 'border-transparent text-slate-400 hover:text-slate-650']"
        >
          Historial de Entregas
        </button>
        <button 
          @click="activeTab = 'planning'" 
          :class="['px-5 py-3 border-b-2 transition-all cursor-pointer font-display flex items-center gap-2', activeTab === 'planning' ? 'border-indigo-650 text-indigo-650' : 'border-transparent text-slate-400 hover:text-slate-650']"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Planificación y Focalización Crítica
        </button>
      </div>

      <!-- Tab: Historial -->
      <div v-if="activeTab === 'list'" class="space-y-6">
        <!-- Filters -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
          <div class="flex-1 min-w-[240px]">
            <input v-model="busqueda" type="text" placeholder="Buscar por familia o recurso..."
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-inner"/>
          </div>
          <div class="flex gap-1.5 text-[10px] uppercase tracking-wider flex-wrap font-bold">
            <button @click="filtroEstado=''" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Todas</button>
            <button @click="filtroEstado='entregado'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='entregado' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Entregadas</button>
            <button @click="filtroEstado='pendiente'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='pendiente' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Pendientes</button>
            <button @click="filtroEstado='cancelado'" :class="['px-3 py-2 rounded-lg border transition-all cursor-pointer', filtroEstado==='cancelado' ? 'bg-rose-50 border-rose-250 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700']">Canceladas</button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div v-if="loading" class="p-1"><SkeletonTable :rows="6" /></div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-550 font-bold">
                  <th class="px-5 py-3.5">Familia / ID</th>
                  <th class="px-5 py-3.5">Recursos Entregados</th>
                  <th class="px-5 py-3.5 text-center">Estado</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Fecha</th>
                  <th v-if="authStore.canManageEntregas" class="px-5 py-3.5 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="e in paginados" :key="e.id" class="border-b border-slate-150 hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-4">
                    <div class="font-semibold text-slate-900 text-sm">{{ e.familia ?? `Familia #${e.id_familia}` }}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">REGISTRO: #{{ e.id }}</div>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex flex-wrap gap-1.5">
                      <div v-for="det in e.detalles" :key="det.id_detalle" class="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 font-medium shadow-sm">
                        <span>{{ det.recurso_nombre }}</span>
                        <span class="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 text-[9px]">x{{ det.cantidad }}</span>
                        <span class="text-slate-400 text-[9px] uppercase font-sans">{{ det.unidad }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-center">
                    <div class="inline-block relative">
                      <select 
                        v-if="authStore.canManageEntregas"
                        :value="e.estado" 
                        @change="cambiarEstado(e, ($event.target as HTMLSelectElement).value)"
                        :class="['pl-3 pr-8 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:ring-0 focus:outline-none transition-colors appearance-none text-center', estadoColor(e.estado)]"
                      >
                        <option class="bg-white text-slate-800" value="entregado">Entregado</option>
                        <option class="bg-white text-slate-800" value="pendiente">Pendiente</option>
                        <option class="bg-white text-slate-800" value="cancelado">Cancelado</option>
                      </select>
                      <span v-else :class="['inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border', estadoColor(e.estado)]">
                        {{ e.estado }}
                      </span>
                      <span v-if="authStore.canManageEntregas" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[8px]">▼</span>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">{{ e.fecha }}</td>
                  <td v-if="authStore.canManageEntregas" class="px-5 py-4 text-right">
                    <button @click="eliminar(e)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Anular entrega (devuelve stock)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filtrados.length === 0">
                  <td :colspan="authStore.canManageEntregas ? 5 : 4" class="px-5 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">NO SE ENCONTRARON REGISTROS</td>
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
        <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <svg class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2"/></svg>
          <div class="text-xs text-indigo-900 space-y-1">
            <p class="font-bold uppercase tracking-wider text-[10px]">Focalizador Inteligente de Necesidades</p>
            <p>Este panel analiza el historial de entregas de cada familia censada, calcula el tiempo transcurrido desde su última ayuda y formula raciones sugeridas personalizadas en base al tamaño de su grupo familiar. Las familias catalogadas como <span class="font-bold text-rose-750 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">Crítico</span> o <span class="font-bold text-amber-750 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">Reabastecer</span> requieren atención prioritaria.</p>
          </div>
        </div>

        <!-- Planning Stats Summary & Stock Warnings -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Familias en Censo</p>
            <p class="text-2xl font-extrabold text-slate-900 mt-2">{{ familias.length }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-rose-500 relative overflow-hidden group">
            <p class="text-[10px] font-bold uppercase text-rose-550 tracking-wider">Estado Crítico</p>
            <p class="text-2xl font-extrabold text-rose-600 mt-2">{{ familiasCriticas }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-amber-500 relative overflow-hidden group">
            <p class="text-[10px] font-bold uppercase text-amber-550 tracking-wider">Reabastecer</p>
            <p class="text-2xl font-extrabold text-amber-600 mt-2">{{ familiasReabastecer }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-emerald-500 relative overflow-hidden group">
            <p class="text-[10px] font-bold uppercase text-emerald-550 tracking-wider">Cubiertos</p>
            <p class="text-2xl font-extrabold text-emerald-600 mt-2">{{ familiasCubiertas }}</p>
          </div>
        </div>

        <!-- Stock Coverage Alerts -->
        <div v-if="alertasStock.length > 0" class="space-y-2">
          <div v-for="alerta in alertasStock" :key="alerta.tipo" class="bg-rose-50 border border-rose-250 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <svg class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div class="text-xs text-rose-900 font-semibold">
              <strong>Insuficiencia de stock en bodega:</strong> {{ alerta.mensaje }}
            </div>
          </div>
        </div>

        <!-- Planning Filters -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <input v-model="busquedaPlaning" type="text" placeholder="Buscar familia por representante o cédula..."
            class="flex-1 min-w-40 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-inner"/>
          <select v-model="filtroAlerta" class="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-indigo-500 outline-none cursor-pointer">
            <option value="">Todos los estados de alerta</option>
            <option value="critico">Crítico (Sin recibir o >7 días)</option>
            <option value="alerta">Reabastecer (3 a 7 días)</option>
            <option value="cubierto">Cubierto (menos de 3 días)</option>
          </select>
        </div>

        <!-- Planning Table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-550 font-bold">
                <th class="px-5 py-3.5">Familia</th>
                <th class="px-5 py-3.5">Integrantes</th>
                <th class="px-5 py-3.5">Último Despacho</th>
                <th class="px-5 py-3.5 text-center">Estado Alerta</th>
                <th class="px-5 py-3.5">Raciones Recomendadas (3 días)</th>
                <th class="px-5 py-3.5 text-right">Focalizar</th>
              </tr>
            </thead>
            <tbody class="text-xs text-slate-700">
              <tr v-for="fam in familiasPlanificadas" :key="fam.id" class="border-b border-slate-150 hover:bg-slate-50 transition-colors">
                <td class="px-5 py-4 font-semibold text-slate-900">
                  <div>{{ fam.representante }}</div>
                  <div class="text-[9px] text-slate-400 font-mono mt-0.5">CED: {{ fam.cedula }}</div>
                </td>
                <td class="px-5 py-4 text-center font-bold">{{ fam.cantidad_miembros }} pers.</td>
                <td class="px-5 py-4">
                  <div class="font-medium text-slate-800">{{ infoUltimaAyuda(fam.id).fecha }}</div>
                  <div class="text-[9px] text-slate-450" v-if="infoUltimaAyuda(fam.id).dias !== null">Hace {{ infoUltimaAyuda(fam.id).dias }} días</div>
                </td>
                <td class="px-5 py-4 text-center">
                  <span :class="['inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider', alertaStyling(infoUltimaAyuda(fam.id).nivel)]">
                    {{ alertaLabel(infoUltimaAyuda(fam.id).nivel) }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex flex-col gap-1 mt-0.5">
                    <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-650">
                      <svg class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                      </svg>
                      {{ fam.cantidad_miembros * 6 }}L Agua
                    </span>
                    <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-650">
                      <svg class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      {{ Math.round(fam.cantidad_miembros * 4.5) }}kg Alimentos
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click="planificarEntrega(fam)" 
                    :disabled="infoUltimaAyuda(fam.id).nivel === 'cubierto'"
                    :class="['px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer', infoUltimaAyuda(fam.id).nivel === 'cubierto' ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700']"
                  >
                    Despachar
                  </button>
                </td>
              </tr>
              <tr v-if="familiasPlanificadas.length === 0">
                <td colspan="6" class="px-5 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">No se encontraron registros de planificación</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Entrega Multi-recurso (REDISEÑADO ANCHO MULTI-RECURSO DINÁMICO) -->
    <div v-if="modalVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-xl max-h-[90vh] flex flex-col animate-[fadeIn_0.25s_ease-out] overflow-hidden">
        <!-- Cabecera -->
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 class="font-extrabold text-slate-800 font-sans text-sm uppercase tracking-wider">Registrar Despacho Humanitario</h2>
          <p class="text-xs text-slate-500 mt-0.5 uppercase tracking-wide">El inventario se debita en tiempo real al registrar</p>
        </div>

        <!-- Formulario (Grid + Insumos Inline) -->
        <div class="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <!-- Metadata general: Grid de 2 Columnas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Familia Beneficiaria *</label>
              <select v-model.number="form.id_familia" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs">
                <option :value="0">Seleccionar familia destinataria...</option>
                <option v-for="f in familias" :key="f.id" :value="f.id">{{ f.representante }} ({{ f.cedula }})</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Fecha de Entrega *</label>
              <input v-model="form.fecha" type="date" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Estado Inicial del Despacho</label>
              <select v-model="form.estado" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs">
                <option value="entregado">Entregado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <!-- Insumos en Fila Inline -->
          <div class="border-t border-slate-200 pt-4 space-y-3">
            <p class="text-xs font-bold text-slate-700 uppercase tracking-wider">Detalle de Insumos Logísticos a Entregar</p>

            <div class="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                    <th class="px-4 py-2.5">Recurso a Despachar</th>
                    <th class="px-4 py-2.5 text-center w-36">Cantidad</th>
                    <th class="px-4 py-2.5 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="(item, idx) in productosEntrega" :key="idx" class="hover:bg-slate-50/50 transition-colors">
                    <!-- Select Recurso Inline -->
                    <td class="px-3 py-2">
                      <select v-model.number="item.id_recurso" class="w-full py-1.5 px-2 bg-transparent border-0 outline-none text-xs font-semibold text-slate-800 focus:ring-0">
                        <option :value="0">Seleccionar recurso...</option>
                        <option 
                          v-for="r in recursos" 
                          :key="r.id" 
                          :value="r.id" 
                          :disabled="r.cantidad_disponible === 0 && r.id !== item.id_recurso"
                        >
                          {{ r.nombre }} (Disponibles: {{ r.cantidad_disponible }} {{ r.unidad }})
                        </option>
                      </select>
                    </td>
                    <!-- Input Cantidad Inline -->
                    <td class="px-3 py-2 flex items-center gap-1.5 justify-center">
                      <input 
                        v-model.number="item.cantidad" 
                        type="number" 
                        min="1" 
                        class="w-20 text-center py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold shadow-inner"
                      />
                      <span class="text-[9px] text-slate-400 font-sans uppercase whitespace-nowrap">{{ unidadRecurso(item.id_recurso) }}</span>
                    </td>
                    <!-- Eliminar Fila -->
                    <td class="px-3 py-2 text-center">
                      <button 
                        @click="productosEntrega.splice(idx, 1)" 
                        class="p-1.5 rounded-lg text-slate-400 hover:text-rose-650 hover:bg-rose-50 transition-colors cursor-pointer" 
                        title="Quitar fila"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                  <!-- Fila vacía si no hay recursos -->
                  <tr v-if="productosEntrega.length === 0">
                    <td colspan="3" class="px-4 py-8 text-center text-slate-400 font-bold uppercase tracking-wider">Sin recursos asignados a la entrega</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Botón Agregar Insumo con Estilo Punteado -->
            <button 
              @click="productosEntrega.push({ id_recurso: 0, cantidad: 1 })"
              class="w-full border-dashed border-2 border-slate-300 hover:border-indigo-500 text-slate-650 hover:text-indigo-600 rounded-xl py-2 px-4 text-xs font-semibold text-center transition-colors cursor-pointer"
            >
              + AGREGAR FILA DE RECURSO
            </button>
          </div>

          <div v-if="modalError" class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-750 font-semibold whitespace-pre-line">{{ modalError }}</div>
        </div>

        <!-- Botones con Estado de Carga / Deshabilitado -->
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider font-semibold">
          <button @click="cerrarModal" :disabled="saving" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 bg-white transition-colors cursor-pointer disabled:opacity-50">Cancelar</button>
          <button 
            @click="guardar" 
            :disabled="saving || productosEntrega.length === 0 || !form.id_familia" 
            class="flex-1 py-2.5 rounded-xl bg-indigo-650 text-white font-bold hover:bg-indigo-750 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <svg v-if="saving" class="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="saving">Procesando operación logística unificada...</span>
            <span v-else>Confirmar Despacho</span>
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
import SkeletonTable from '@/components/SkeletonTable.vue'
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
const form = ref({
  id_familia: 0,
  fecha: today,
  estado: 'entregado',
})

// ─── Array de productos para entrega multi-recurso ────────────────────────────
interface ProductoEntrega {
  id_recurso: number
  cantidad: number
}

const productosEntrega = ref<ProductoEntrega[]>([])

// Producto que se está configurando antes de agregar (mantenido por compatibilidad)
const nuevoProducto = ref<ProductoEntrega>({ id_recurso: 0, cantidad: 1 })

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
function nombreRecurso(id: number): string {
  return recursos.value.find(r => r.id === id)?.nombre ?? `Recurso #${id}`
}
function unidadRecurso(id: number): string {
  return recursos.value.find(r => r.id === id)?.unidad ?? ''
}
function recursoYaAgregado(id: number): boolean {
  return productosEntrega.value.some(p => p.id_recurso === id)
}

function stockDisponibleParaRecurso(id: number): number {
  const recurso = recursos.value.find(r => r.id === id)
  if (!recurso) return 0
  const yaAsignado = productosEntrega.value
    .filter(p => p.id_recurso === id)
    .reduce((sum, p) => sum + p.cantidad, 0)
  return recurso.cantidad_disponible - yaAsignado
}

// ─── Estilo de estado (badge de color) ────────────────────────────────────────
function estadoColor(estado: string) {
  const e = estado?.toLowerCase() ?? ''
  if (e === 'entregado') return 'border-emerald-300 !text-emerald-800 bg-emerald-50 font-bold'
  if (e === 'cancelada' || e === 'cancelado') return 'border-rose-300 !text-rose-800 bg-rose-50 font-bold'
  return 'border-amber-300 !text-amber-800 bg-amber-50 font-bold'
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
  form.value = { id_familia: 0, fecha: today, estado: 'entregado' }
  productosEntrega.value = [{ id_recurso: 0, cantidad: 1 }] // Inicializar con una fila vacía inline
  nuevoProducto.value = { id_recurso: 0, cantidad: 1 }
  modalError.value = ''
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
}

// Mantenido por compatibilidad
function agregarProducto() {
  if (!nuevoProducto.value.id_recurso || nuevoProducto.value.cantidad < 1) return
  productosEntrega.value.push({
    id_recurso: nuevoProducto.value.id_recurso,
    cantidad: nuevoProducto.value.cantidad
  })
  nuevoProducto.value = { id_recurso: 0, cantidad: 1 }
}

async function guardar() {
  if (!form.value.id_familia) {
    modalError.value = 'Selecciona una familia'
    return
  }
  
  const validos = productosEntrega.value.filter(p => p.id_recurso !== 0 && p.cantidad > 0)
  if (validos.length === 0) {
    modalError.value = 'Agrega al menos un recurso válido a la entrega'
    return
  }

  // Validar stock disponible
  for (const item of validos) {
    const rec = recursos.value.find(r => r.id === item.id_recurso)
    if (rec && rec.cantidad_disponible < item.cantidad) {
      modalError.value = `Stock insuficiente para "${rec.nombre}". Disponible actual: ${rec.cantidad_disponible} ${rec.unidad}`
      return
    }
  }

  saving.value = true
  modalError.value = ''

  try {
    const res = await apiCreateEntrega({
      estado: form.value.estado,
      fecha: form.value.fecha,
      id_familia: form.value.id_familia,
      recursos: validos.map(prod => ({
        id_recurso: prod.id_recurso,
        cantidad: prod.cantidad
      }))
    })

    if (res.success) {
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

async function cambiarEstado(e: Entrega, nuevoEstado: string) {
  try {
    const res = await apiUpdateEntregaEstado(e.id, nuevoEstado)
    if (res.success) {
      e.estado = nuevoEstado
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
  if (nivel === 'cubierto') return 'bg-green-50/90 !text-green-800 border-green-300 font-bold'
  if (nivel === 'alerta') return 'bg-amber-50/90 !text-amber-800 border-amber-300 font-bold'
  return 'bg-rose-50/90 !text-rose-800 border-rose-300 font-bold'
}

function alertaLabel(nivel: string) {
  if (nivel === 'cubierto') return 'Cubierto'
  if (nivel === 'alerta') return 'Reabastecer'
  return 'Crítico'
}

function planificarEntrega(family: Familia) {
  abrirModal()
  form.value.id_familia = family.id
  productosEntrega.value = [] // Resetear
  
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

  // Si no se pudo agregar ningún producto predefinido, agregar fila vacía
  if (productosEntrega.value.length === 0) {
    productosEntrega.value.push({ id_recurso: 0, cantidad: 1 })
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
      mensaje: `Se requieren ${totalAguaRequerida} Litros de Agua para abastecer a las familias en estado crítico/alerta, pero solo hay ${stockAgua} Litros en inventario.`
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
      mensaje: `Se requieren ${Math.round(totalComidaRequerida)} kg de Alimento para abastecer a las familias en estado crítico/alerta, pero solo hay ${stockComida} kg en inventario.`
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
