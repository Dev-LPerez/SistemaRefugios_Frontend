<template>
  <AppLayout title="Donaciones">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Registro de Donaciones
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Control de aportes humanitarios, benefactores y stock entrante</p>
        </div>
        <div class="flex gap-2">
          <!-- Desktop Tabs -->
          <div class="hidden sm:flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 text-[10px] uppercase tracking-wider font-bold">
            <button @click="tab='donaciones'" :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', tab==='donaciones' ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent']">Donaciones</button>
            <button @click="tab='donantes'" :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', tab==='donantes' ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent']">Donantes</button>
          </div>
          <button @click="tab==='donaciones' ? abrirModalDonacion() : abrirModalDonante()" class="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 shadow-sm transition-all cursor-pointer">
            <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            {{ tab === 'donaciones' ? 'Nueva Donación' : 'Nuevo Donante' }}
          </button>
        </div>
      </div>

      <!-- Mobile tabs -->
      <div class="sm:hidden flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 mb-4 text-[10px] uppercase tracking-wider font-bold">
        <button @click="tab='donaciones'" :class="['flex-1 py-2 text-center rounded-lg transition-all cursor-pointer', tab==='donaciones' ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm' : 'text-slate-500']">Donaciones</button>
        <button @click="tab='donantes'" :class="['flex-1 py-2 text-center rounded-lg transition-all cursor-pointer', tab==='donantes' ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm' : 'text-slate-500']">Donantes</button>
      </div>

      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 shadow-sm">{{ error }}</div>

      <!-- ── TAB DONACIONES ── -->
      <template v-if="tab === 'donaciones'">
        <!-- Stats + controles (3 columnas) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Donaciones encontradas</p>
            <p class="text-2xl font-extrabold text-slate-900 mt-2">{{ donaciones.length }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Donantes Activos</p>
            <p class="text-2xl font-extrabold text-indigo-600 mt-2">{{ donantes.length }}</p>
          </div>
          <!-- Buscar por ID -->
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Buscar por ID de donación</p>
            <div class="flex gap-1.5 mt-2">
              <input v-model.number="buscarId" type="number" min="1" placeholder="ID..." class="flex-1 w-0 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-inner"/>
              <button @click="buscarDonacion" :disabled="!buscarId || buscando" class="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm cursor-pointer">
                <svg v-if="buscando" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <span v-else>Ir</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Detalle de donación buscada -->
        <div v-if="donacionDetalle" class="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm animate-[fadeIn_0.3s_ease-out]">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Donación #{{ donacionDetalle.id_donacion ?? donacionDetalle.id }}</h3>
            <button @click="donacionDetalle=null" class="text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"><svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4 text-slate-600">
            <div><p class="text-[9px] text-slate-400 font-bold uppercase">Fecha</p><p class="font-semibold text-slate-800 mt-0.5">{{ donacionDetalle.fecha }}</p></div>
            <div><p class="text-[9px] text-slate-400 font-bold uppercase">Categoría</p><p class="font-semibold text-slate-800 mt-0.5">{{ donacionDetalle.categoria }}</p></div>
            <div><p class="text-[9px] text-slate-400 font-bold uppercase">Origen</p><p class="font-semibold text-slate-800 mt-0.5">{{ donacionDetalle.origen }}</p></div>
            <div><p class="text-[9px] text-slate-400 font-bold uppercase">Descripción</p><p class="font-semibold text-slate-800 mt-0.5 truncate">{{ donacionDetalle.descripcion }}</p></div>
          </div>
          <div v-if="donacionDetalle.detalles?.length">
            <p class="text-[9px] font-bold text-slate-400 uppercase mb-2">Recursos incluidos</p>
            <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <table class="w-full text-xs">
                <thead><tr class="text-left bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wider">
                  <th class="px-3 py-2">Recurso</th>
                  <th class="px-3 py-2">Tipo</th>
                  <th class="px-3 py-2 text-center">Cantidad</th>
                  <th class="px-3 py-2">Unidad</th>
                </tr></thead>
                <tbody class="divide-y divide-slate-150 text-slate-700 bg-white">
                  <tr v-for="d in donacionDetalle.detalles" :key="d.id_detalle" class="hover:bg-slate-50 transition-colors">
                    <td class="px-3 py-2 font-semibold text-slate-900">{{ d.nombre }}</td>
                    <td class="px-3 py-2 text-slate-500">{{ d.tipo }}</td>
                    <td class="px-3 py-2 text-center font-bold text-emerald-600">{{ d.cantidad }}</td>
                    <td class="px-3 py-2 text-slate-400">{{ d.unidad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 uppercase tracking-wide">Sin detalles de recursos registrados</p>
        </div>

        <!-- Tabla de donaciones -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <!-- loading skeleton -->
          <div v-if="loadingDonaciones" class="p-1">
            <SkeletonTable :rows="6" />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-550 font-bold">
                  <th class="px-5 py-3.5">ID</th>
                  <th class="px-5 py-3.5">Descripción</th>
                  <th class="px-5 py-3.5 hidden sm:table-cell">Donante</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Categoría</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Origen</th>
                  <th class="px-5 py-3.5">Fecha</th>
                  <th class="px-5 py-3.5 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="d in donacionesPaginadas" :key="d.id" class="border-b border-slate-150 hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-4"><span class="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold text-xs">#{{ d.id }}</span></td>
                  <td class="px-5 py-4 font-semibold text-slate-900 max-w-40 truncate">{{ d.descripcion }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden sm:table-cell">{{ nombreDonante(d.id_donante) }}</td>
                  <td class="px-5 py-4 hidden md:table-cell"><span class="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-semibold uppercase tracking-wider">{{ d.categoria }}</span></td>
                  <td class="px-5 py-4 text-slate-500 hidden md:table-cell">{{ d.origen }}</td>
                  <td class="px-5 py-4 text-slate-500">{{ d.fecha }}</td>
                  <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="verDetalle(d.id)" class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Ver detalle y recursos">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button @click="abrirModalDetalleExistente(d.id)" class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Agregar recurso">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="donaciones.length === 0">
                  <td colspan="7" class="px-5 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                    No hay donaciones registradas.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="donaciones.length > 0" v-model:page="pageD" v-model:perPage="perPageD" :total="donaciones.length" />
        </div>
      </template>

      <!-- ── TAB DONANTES ── -->
      <template v-else>
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <input v-model="busquedaDonante" type="text" placeholder="Buscar donante por nombre o identificación..."
            class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-inner"/>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div v-if="loadingDonantes" class="p-1"><SkeletonTable :rows="5" /></div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-550 font-bold">
                  <th class="px-5 py-3.5">Nombre</th>
                  <th class="px-5 py-3.5 hidden sm:table-cell">Identificación</th>
                  <th class="px-5 py-3.5">Tipo</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Teléfono</th>
                  <th class="px-5 py-3.5 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="d in donantesPaginados" :key="d.id" class="border-b border-slate-150 hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-4 font-semibold text-slate-900 text-sm">{{ d.nombre }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden sm:table-cell">{{ d.identificacion }}</td>
                  <td class="px-5 py-4"><span class="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-semibold uppercase tracking-wider">{{ d.tipo }}</span></td>
                  <td class="px-5 py-4 text-slate-500 hidden md:table-cell">{{ d.telefono }}</td>
                  <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="abrirModalDonante(d)" class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                      <button @click="eliminarDonante(d)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="donantesFiltrados.length === 0"><td colspan="5" class="px-5 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">No hay donantes registrados</td></tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="donantesFiltrados.length > 0" v-model:page="pageDo" v-model:perPage="perPageDo" :total="donantesFiltrados.length" />
        </div>
      </template>
    </div>

    <!-- Modal Nueva Donación (REDISEÑADO ANCHO MULTI-RECURSO DINÁMICO) -->
    <div v-if="modalDonacionVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-xl max-h-[90vh] flex flex-col animate-[fadeIn_0.25s_ease-out] overflow-hidden">
        <!-- Cabecera -->
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 class="font-extrabold text-slate-800 font-sans text-sm uppercase tracking-wider">Registrar Nueva Donación</h2>
          <p class="text-xs text-slate-500 mt-0.5">Control de entrada de ayuda humanitaria unificada</p>
        </div>
        
        <!-- Formulario (Grid + Insumos) -->
        <div class="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <!-- Metadata general: Grid de 2 Columnas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Donante Autorizado *</label>
              <select v-model.number="formDon.id_donante" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs">
                <option :value="0">Seleccionar donante...</option>
                <option v-for="d in donantes" :key="d.id" :value="d.id">{{ d.nombre }} ({{ d.tipo }})</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Fecha de Recepción *</label>
              <input v-model="formDon.fecha" type="date" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Categoría Logística *</label>
              <select v-model="formDon.categoria" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs">
                <option value="">Seleccionar...</option>
                <option>Alimentos</option><option>Agua</option><option>Medicamentos</option><option>Ropa</option><option>Dinero</option><option>Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Origen Geográfico</label>
              <input v-model="formDon.origen" type="text" placeholder="Ej: Nacional, Internacional..." class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs shadow-inner"/>
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Descripción / Observaciones</label>
              <textarea v-model="formDon.descripcion" rows="2" placeholder="Detalles de la entrega, origen particular..." class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs resize-none shadow-inner"></textarea>
            </div>
          </div>

          <!-- Insumos en Fila Inline -->
          <div class="border-t border-slate-200 pt-4 space-y-3">
            <p class="text-xs font-bold text-slate-700 uppercase tracking-wider">Detalle de Insumos Recibidos</p>

            <div class="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                    <th class="px-4 py-2.5">Recurso a Incrementar</th>
                    <th class="px-4 py-2.5 text-center w-32">Cantidad</th>
                    <th class="px-4 py-2.5 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="(item, idx) in detallesArray" :key="idx" class="hover:bg-slate-50/50 transition-colors">
                    <!-- Select Recurso Inline -->
                    <td class="px-3 py-2">
                      <select v-model.number="item.id_recurso" class="w-full py-1.5 px-2 bg-transparent border-0 outline-none text-xs font-semibold text-slate-800 focus:ring-0">
                        <option :value="0">Seleccionar recurso...</option>
                        <option v-for="r in recursos" :key="r.id" :value="r.id">{{ r.nombre }} ({{ r.tipo }} · {{ r.unidad }})</option>
                      </select>
                    </td>
                    <!-- Input Cantidad Inline -->
                    <td class="px-3 py-2">
                      <input 
                        v-model.number="item.cantidad" 
                        type="number" 
                        min="1" 
                        class="w-full text-center py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold shadow-inner"
                      />
                    </td>
                    <!-- Eliminar Fila -->
                    <td class="px-3 py-2 text-center">
                      <button 
                        @click="detallesArray.splice(idx, 1)" 
                        class="p-1.5 rounded-lg text-slate-400 hover:text-rose-650 hover:bg-rose-50 transition-colors cursor-pointer" 
                        title="Quitar fila"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                  <!-- Fila vacía si no hay recursos -->
                  <tr v-if="detallesArray.length === 0">
                    <td colspan="3" class="px-4 py-8 text-center text-slate-400 font-bold uppercase tracking-wider">Sin insumos en la lista de donación</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Botón Agregar Insumo con Estilo Punteado -->
            <button 
              @click="detallesArray.push({ id_recurso: 0, cantidad: 1 })"
              class="w-full border-dashed border-2 border-slate-300 hover:border-indigo-500 text-slate-650 hover:text-indigo-600 rounded-xl py-2 px-4 text-xs font-semibold text-center transition-colors cursor-pointer"
            >
              + AGREGAR FILA DE RECURSO
            </button>
          </div>

          <div v-if="modalDonError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{{ modalDonError }}</div>
        </div>

        <!-- Botones con Estado de Carga / Deshabilitado -->
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider font-semibold">
          <button @click="modalDonacionVisible=false" :disabled="savingDon" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 bg-white transition-colors cursor-pointer disabled:opacity-50">Cancelar</button>
          <button 
            @click="guardarDonacion" 
            :disabled="savingDon || detallesArray.length === 0 || !formDon.id_donante || !formDon.categoria" 
            class="flex-1 py-2.5 rounded-xl bg-indigo-650 text-white font-bold hover:bg-indigo-750 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm animate-none"
          >
            <svg v-if="savingDon" class="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="savingDon">Procesando operación logística unificada...</span>
            <span v-else>Registrar Donación Entrante</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Recurso a Donación Existente -->
    <div v-if="modalDetalleVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 class="font-extrabold text-slate-800 font-display text-sm uppercase tracking-wider">Agregar Recurso a Donación #{{ detalleIdDonacion }}</h2>
          <p class="text-xs text-slate-500 mt-0.5 uppercase tracking-wide">El stock del recurso aumentará automáticamente</p>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Recurso *</label>
            <select v-model.number="formDetalle.id_recurso" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-indigo-500 text-xs">
              <option :value="0">Seleccionar recurso</option>
              <option v-for="r in recursos" :key="r.id" :value="r.id">{{ r.nombre }} ({{ r.tipo }} · {{ r.unidad }})</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Cantidad *</label>
            <input v-model.number="formDetalle.cantidad" type="number" min="1" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-inner"/>
          </div>
          <div v-if="modalDetalleError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{{ modalDetalleError }}</div>
          <div v-if="modalDetalleOk" class="p-3 bg-emerald-50 border border-emerald-250 rounded-lg text-emerald-700 font-bold">{{ modalDetalleOk }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="modalDetalleVisible=false; modalDetalleOk=''" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cerrar</button>
          <button @click="guardarDetalle" :disabled="savingDetalle" class="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-750 disabled:bg-slate-200 disabled:text-slate-455 transition-all cursor-pointer">
            {{ savingDetalle ? 'Agregando...' : 'Agregar Recurso' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Donante -->
    <div v-if="modalDonanteVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50"><h2 class="font-extrabold text-slate-800 font-display text-sm uppercase tracking-wider">{{ editandoDonante ? 'Editar Donante' : 'Nuevo Donante' }}</h2></div>
        <div class="p-5 space-y-4 text-xs">
          <div><label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Nombre *</label><input v-model="formDonante.nombre" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-inner"/></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Identificación *</label><input v-model="formDonante.identificacion" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-inner"/></div>
            <div><label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Tipo *</label>
              <select v-model="formDonante.tipo" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-indigo-500 text-xs">
                <option>Persona Natural</option><option>Empresa</option><option>ONG</option><option>Gobierno</option>
              </select>
            </div>
          </div>
          <div><label class="block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Teléfono</label><input v-model="formDonante.telefono" type="tel" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-inner"/></div>
          <div v-if="modalDonanteError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{{ modalDonanteError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="modalDonanteVisible=false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardarDonante" :disabled="savingDonante" class="flex-1 py-2.5 rounded-xl bg-indigo-650 text-white font-bold hover:bg-indigo-750 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">
            {{ savingDonante ? 'Guardando...' : 'Confirmar' }}
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
import {
  apiGetDonaciones, apiAgregarDetalleDonacion, apiGetDonantes,
  apiCreateDonante, apiUpdateDonante, apiDeleteDonante, apiGetRecursos,
  type Donacion, type Donante, type Recurso
} from '@/services/api'
import apiClient from '@/services/axios'

const authStore = useAuthStore()
const tab = ref<'donaciones' | 'donantes'>('donaciones')
const today = new Date().toISOString().split('T')[0]

// ── Data ──────────────────────────────────────────────────────────────────────
const donaciones = ref<Donacion[]>([])
const donantes = ref<Donante[]>([])
const recursos = ref<Recurso[]>([])

// ── UI state ──────────────────────────────────────────────────────────────────
const loadingDonaciones = ref(true)
const loadingDonantes = ref(true)
const savingDon = ref(false)
const savingDetalle = ref(false)
const savingDonante = ref(false)
const buscando = ref(false)
const error = ref('')
const modalDonError = ref('')
const modalDetalleError = ref('')
const modalDetalleOk = ref('')
const modalDonanteError = ref('')
const busquedaDonante = ref('')
const buscarId = ref<number | ''>('')
const donacionDetalle = ref<any | null>(null)

const pageD = ref(1); const perPageD = ref(20)
const pageDo = ref(1); const perPageDo = ref(20)

const modalDonacionVisible = ref(false)
const modalDetalleVisible = ref(false)
const modalDonanteVisible = ref(false)
const editandoDonante = ref<Donante | null>(null)
const detalleIdDonacion = ref(0)

// ── Forms ─────────────────────────────────────────────────────────────────────
const formDon = ref({
  id_donante: 0,
  descripcion: '',
  categoria: '',
  fecha: today,
  origen: 'Nacional'
})
const detallesArray = ref<{ id_recurso: number, cantidad: number }[]>([])

const formDetalle = ref({
  id_recurso: 0,
  cantidad: 1
})
const formDonante = ref({
  nombre: '',
  identificacion: '',
  tipo: 'Persona Natural',
  telefono: ''
})

// ── Computed ──────────────────────────────────────────────────────────────────
const donacionesPaginadas = computed(() =>
  donaciones.value.slice((pageD.value - 1) * perPageD.value, pageD.value * perPageD.value)
)
const donantesFiltrados = computed(() => {
  if (!busquedaDonante.value) return donantes.value
  const q = busquedaDonante.value.toLowerCase()
  return donantes.value.filter(d =>
    d.nombre.toLowerCase().includes(q) ||
    d.identificacion.includes(q)
  )
})
const donantesPaginados = computed(() =>
  donantesFiltrados.value.slice((pageDo.value - 1) * perPageDo.value, pageDo.value * perPageDo.value)
)

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  const [resD, resDo, resR] = await Promise.all([
    apiGetDonaciones(),
    apiGetDonantes(),
    apiGetRecursos()
  ])
  
  if (resD.success && resD.data) donaciones.value = resD.data
  else error.value = resD.message ?? 'Error'
  loadingDonaciones.value = false

  if (resDo.success && resDo.data) donantes.value = resDo.data
  else error.value = resDo.message ?? 'Error'
  loadingDonantes.value = false

  if (resR.success && resR.data) recursos.value = resR.data
})

// ── Methods ───────────────────────────────────────────────────────────────────
function nombreDonante(id: number) {
  const d = donantes.value.find(x => x.id === id)
  return d ? d.nombre : `Donante #${id}`
}
function nombreRecurso(id: number) {
  const r = recursos.value.find(x => x.id === id)
  return r ? r.nombre : `Recurso #${id}`
}

async function buscarDonacion() {
  if (!buscarId.value) return
  buscando.value = true
  donacionDetalle.value = null
  try {
    const res = await apiClient.get('', { params: { route: 'donaciones', id: buscarId.value } })
    if (res.data && res.data.status === 200 && res.data.data) {
      donacionDetalle.value = res.data.data
    } else {
      error.value = 'No se encontró la donación solicitada'
    }
  } catch (e) {
    error.value = 'Error al buscar la donación'
  } finally {
    buscando.value = false
  }
}

async function verDetalle(id: number) {
  buscarId.value = id
  await buscarDonacion()
}

async function recargarDonaciones() {
  const res = await apiGetDonaciones()
  if (res.success && res.data) donaciones.value = res.data
}

// ── Nueva Donación (modal integrado con recursos) ─────────────────────────────
function abrirModalDonacion() {
  formDon.value = { id_donante: 0, descripcion: '', categoria: '', fecha: today, origen: 'Nacional' }
  detallesArray.value = [{ id_recurso: 0, cantidad: 1 }] // Comienza con una fila vacía inline
  modalDonError.value = ''
  modalDonacionVisible.value = true
}

async function guardarDonacion() {
  if (!formDon.value.id_donante || !formDon.value.categoria) { 
    modalDonError.value = 'Donante y categoría son obligatorios'
    return 
  }
  
  // Validar detalles
  const detallesValidos = detallesArray.value.filter(d => d.id_recurso !== 0 && d.cantidad > 0)
  if (detallesValidos.length === 0) {
    modalDonError.value = 'Debe agregar al menos un recurso válido con cantidad mayor a 0'
    return
  }

  savingDon.value = true
  modalDonError.value = ''
  try {
    // 1. Crear cabecera de donación
    const res = await apiClient.post('', formDon.value, { params: { route: 'donaciones' } })
    const json = res.data
    if (json.status === 201 && json.id_donacion) {
      const idDonacion = json.id_donacion

      // 2. Enviar detalles de recursos en paralelo
      await Promise.all(
        detallesValidos.map(detalle =>
          apiAgregarDetalleDonacion({
            id_donacion: idDonacion,
            id_recurso: detalle.id_recurso,
            cantidad: detalle.cantidad
          })
        )
      )
      
      // Actualizar recursos (el stock cambió)
      const resR = await apiGetRecursos()
      if (resR.success && resR.data) recursos.value = resR.data

      // 3. Recargar la lista de donaciones y cerrar
      await recargarDonaciones()
      modalDonacionVisible.value = false
    } else {
      modalDonError.value = json.message ?? json.error ?? 'Error al registrar'
    }
  } catch (e: any) {
    modalDonError.value = e.response?.data?.message ?? 'Error de conexión con el servidor'
  } finally {
    savingDon.value = false
  }
}

// ── Agregar Recurso a Donación Existente ──────────────────────────────────────
function abrirModalDetalleExistente(idDonacion: number) {
  detalleIdDonacion.value = idDonacion
  formDetalle.value = { id_recurso: 0, cantidad: 1 }
  modalDetalleError.value = ''; modalDetalleOk.value = ''
  modalDetalleVisible.value = true
}

async function guardarDetalle() {
  if (!formDetalle.value.id_recurso || formDetalle.value.cantidad < 1) { 
    modalDetalleError.value = 'Recurso y cantidad son obligatorios'
    return 
  }
  savingDetalle.value = true
  modalDetalleError.value = ''
  modalDetalleOk.value = ''
  try {
    const res = await apiClient.post('', { 
      id_donacion: detalleIdDonacion.value, 
      id_recurso: formDetalle.value.id_recurso, 
      cantidad: formDetalle.value.cantidad 
    }, { 
      params: { route: 'donaciones', action: 'agregar_detalle' } 
    })
    const json = res.data
    if (json.status === 201) {
      modalDetalleOk.value = '✓ Recurso agregado. El stock ha sido actualizado.'
      formDetalle.value = { id_recurso: 0, cantidad: 1 }
      
      const resR = await apiGetRecursos()
      if (resR.success && resR.data) recursos.value = resR.data
    } else {
      modalDetalleError.value = json.message ?? json.error ?? 'Error al agregar'
    }
  } catch (e: any) {
    modalDetalleError.value = e.response?.data?.message ?? e.response?.data?.error ?? 'Error de conexión'
  } finally {
    savingDetalle.value = false
  }
}

// ── CRUD Donantes ─────────────────────────────────────────────────────────────
function abrirModalDonante(d?: Donante) {
  editandoDonante.value = d ?? null
  formDonante.value = d 
    ? { nombre: d.nombre, identificacion: d.identificacion, tipo: d.tipo, telefono: d.telefono } 
    : { nombre: '', identificacion: '', tipo: 'Persona Natural', telefono: '' }
  modalDonanteError.value = ''
  modalDonanteVisible.value = true
}

async function guardarDonante() {
  if (!formDonante.value.nombre.trim() || !formDonante.value.identificacion.trim()) { 
    modalDonanteError.value = 'Nombre e identificación son obligatorios'
    return 
  }
  savingDonante.value = true
  modalDonanteError.value = ''
  try {
    if (editandoDonante.value) {
      const res = await apiUpdateDonante(editandoDonante.value.id, formDonante.value)
      if (res.success) { 
        const idx = donantes.value.findIndex(x => x.id === editandoDonante.value!.id)
        if (idx !== -1) donantes.value[idx] = { ...donantes.value[idx], ...formDonante.value } 
      } else {
        modalDonanteError.value = res.message ?? 'Error'
      }
    } else {
      const res = await apiCreateDonante(formDonante.value)
      if (res.success) { 
        const r = await apiGetDonantes()
        if (r.success && r.data) donantes.value = r.data 
      } else {
        modalDonanteError.value = res.message ?? 'Error'
      }
    }
    if (!modalDonanteError.value) modalDonanteVisible.value = false
  } finally {
    savingDonante.value = false
  }
}

async function eliminarDonante(d: Donante) {
  const motivo = prompt(`¿Está seguro de eliminar al donante "${d.nombre}"? Ingrese el motivo de la eliminación:`)
  if (motivo === null) return
  if (!motivo.trim()) {
    alert('El motivo de la eliminación es obligatorio.')
    return
  }
  const res = await apiDeleteDonante(d.id, motivo.trim())
  if (res.success) donantes.value = donantes.value.filter(x => x.id !== d.id)
  else error.value = res.message ?? 'Error'
}
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
