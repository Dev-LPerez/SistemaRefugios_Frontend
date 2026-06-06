<template>
  <AppLayout title="Donaciones">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Donaciones y Donantes
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Registro de aportes y benefactores</p>
        </div>
        <div class="flex gap-2">
          <div class="hidden sm:flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 text-[10px] uppercase tracking-wider font-semibold">
            <button @click="tab='donaciones'" :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', tab==='donaciones' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent']">Donaciones</button>
            <button @click="tab='donantes'" :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', tab==='donantes' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent']">Donantes</button>
          </div>
          <button @click="tab==='donaciones' ? abrirModalDonacion() : abrirModalDonante()" class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-sm transition-all cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ tab === 'donaciones' ? 'Nueva Donación' : 'Nuevo Donante' }}
          </button>
        </div>
      </div>

      <!-- Mobile tabs -->
      <div class="sm:hidden flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 mb-4 text-[10px] uppercase tracking-wider font-semibold">
        <button @click="tab='donaciones'" :class="['flex-1 py-2 text-center rounded-lg transition-all cursor-pointer', tab==='donaciones' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500']">Donaciones</button>
        <button @click="tab='donantes'" :class="['flex-1 py-2 text-center rounded-lg transition-all cursor-pointer', tab==='donantes' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500']">Donantes</button>
      </div>

      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 shadow-sm">{{ error }}</div>

      <!-- ── TAB DONACIONES ── -->
      <template v-if="tab === 'donaciones'">
        <!-- Stats + controles (3 columnas) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Donaciones encontradas</p>
            <p class="text-2xl font-bold text-slate-900 mt-2">{{ donaciones.length }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Donantes Activos</p>
            <p class="text-2xl font-bold text-emerald-600 mt-2">{{ donantes.length }}</p>
          </div>
          <!-- Buscar por ID -->
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-md">
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Buscar por ID</p>
            <div class="flex gap-1.5 mt-2">
              <input v-model.number="buscarId" type="number" min="1" placeholder="ID..." class="flex-1 w-0 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-inner"/>
              <button @click="buscarDonacion" :disabled="!buscarId || buscando" class="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm cursor-pointer">
                <svg v-if="buscando" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <span v-else>Ir</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Detalle de donación buscada -->
        <div v-if="donacionDetalle" class="bg-white rounded-2xl border border-emerald-250 p-5 shadow-md animate-[fadeIn_0.3s_ease-out]">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">Donación #{{ donacionDetalle.id_donacion ?? donacionDetalle.id }}</h3>
            <button @click="donacionDetalle=null" class="text-slate-400 hover:text-slate-650 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4 text-slate-600">
            <div><p class="text-[10px] text-slate-400 font-bold uppercase">Fecha</p><p class="font-semibold text-slate-800 mt-0.5">{{ donacionDetalle.fecha }}</p></div>
            <div><p class="text-[10px] text-slate-400 font-bold uppercase">Categoría</p><p class="font-semibold text-slate-800 mt-0.5">{{ donacionDetalle.categoria }}</p></div>
            <div><p class="text-[10px] text-slate-400 font-bold uppercase">Origen</p><p class="font-semibold text-slate-800 mt-0.5">{{ donacionDetalle.origen }}</p></div>
            <div><p class="text-[10px] text-slate-400 font-bold uppercase">Descripción</p><p class="font-semibold text-slate-800 mt-0.5 truncate">{{ donacionDetalle.descripcion }}</p></div>
          </div>
          <div v-if="donacionDetalle.detalles?.length">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Recursos incluidos</p>
            <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <table class="w-full text-xs">
                <thead><tr class="text-left bg-emerald-50/50 border-b border-emerald-200 text-emerald-800 font-bold">
                  <th class="px-3 py-2">Recurso</th>
                  <th class="px-3 py-2">Tipo</th>
                  <th class="px-3 py-2 text-center">Cantidad</th>
                  <th class="px-3 py-2">Unidad</th>
                </tr></thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 bg-white">
                  <tr v-for="d in donacionDetalle.detalles" :key="d.id_detalle" class="odd:bg-white even:bg-emerald-50/10 hover:bg-emerald-50/30 transition-colors">
                    <td class="px-3 py-2 font-semibold">{{ d.nombre }}</td>
                    <td class="px-3 py-2 text-slate-500">{{ d.tipo }}</td>
                    <td class="px-3 py-2 text-center font-bold text-emerald-700">{{ d.cantidad }}</td>
                    <td class="px-3 py-2 text-slate-400">{{ d.unidad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 uppercase tracking-wide">Sin detalles de recursos registrados</p>
        </div>

        <!-- Tabla de donaciones -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <!-- Loading -->
          <div v-if="loadingDonaciones" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
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
                <tr v-for="d in donacionesPaginadas" :key="d.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                  <td class="px-5 py-4 border-b border-slate-100/40"><span class="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold text-xs">#{{ d.id }}</span></td>
                  <td class="px-5 py-4 font-semibold text-slate-900 max-w-40 truncate border-b border-slate-100/40">{{ d.descripcion }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden sm:table-cell border-b border-slate-100/40">{{ nombreDonante(d.id_donante) }}</td>
                  <td class="px-5 py-4 hidden md:table-cell border-b border-slate-100/40"><span class="inline-block px-2 py-0.5 bg-emerald-55 text-emerald-800 bg-emerald-50/60 border border-emerald-200 rounded-full text-[10px] font-semibold uppercase tracking-wider">{{ d.categoria }}</span></td>
                  <td class="px-5 py-4 text-slate-500 hidden md:table-cell border-b border-slate-100/40">{{ d.origen }}</td>
                  <td class="px-5 py-4 text-slate-500 border-b border-slate-100/40">{{ d.fecha }}</td>
                  <td class="px-5 py-4 text-right border-b border-slate-100/40">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="verDetalle(d.id)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Ver detalle y recursos">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button @click="abrirModalDetalleExistente(d.id)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Agregar recurso">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="donaciones.length === 0">
                  <td colspan="7" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">
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
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-md">
          <input v-model="busquedaDonante" type="text" placeholder="Buscar donante por nombre o identificación..."
            class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <div v-if="loadingDonantes" class="flex justify-center py-12"><svg class="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                  <th class="px-5 py-3.5">Nombre</th>
                  <th class="px-5 py-3.5 hidden sm:table-cell">Identificación</th>
                  <th class="px-5 py-3.5">Tipo</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Teléfono</th>
                  <th class="px-5 py-3.5 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="d in donantesPaginados" :key="d.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                  <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ d.nombre }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden sm:table-cell border-b border-slate-100/40">{{ d.identificacion }}</td>
                  <td class="px-5 py-4 border-b border-slate-100/40"><span class="inline-block px-2 py-0.5 bg-indigo-55 text-indigo-850 bg-indigo-50 border border-indigo-200 rounded-full text-[10px] font-semibold uppercase tracking-wider">{{ d.tipo }}</span></td>
                  <td class="px-5 py-4 text-slate-500 hidden md:table-cell border-b border-slate-100/40">{{ d.telefono }}</td>
                  <td class="px-5 py-4 text-right border-b border-slate-100/40 border-b border-slate-100/40">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="abrirModalDonante(d)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                      <button @click="eliminarDonante(d)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="donantesFiltrados.length === 0"><td colspan="5" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100/40">No hay donantes registrados</td></tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="donantesFiltrados.length > 0" v-model:page="pageDo" v-model:perPage="perPageDo" :total="donantesFiltrados.length" />
        </div>
      </template>
    </div>

    <!-- Modal Nueva Donación (con recursos integrados) -->
    <div v-if="modalDonacionVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">Nueva Donación</h2>
          <p class="text-xs text-slate-500 mt-0.5">Registra la donación y sus recursos en un solo paso</p>
        </div>
        <div class="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <!-- Campos básicos de la donación -->
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Donante *</label>
            <select v-model.number="formDon.id_donante" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
              <option :value="0">Seleccionar donante</option>
              <option v-for="d in donantes" :key="d.id" :value="d.id">{{ d.nombre }} ({{ d.tipo }})</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Descripción</label>
            <textarea v-model="formDon.descripcion" rows="2" placeholder="Descripción de la donación..." class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs resize-none shadow-inner"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Categoría *</label>
              <select v-model="formDon.categoria" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
                <option value="">Seleccionar</option>
                <option>Alimentos</option><option>Agua</option><option>Medicamentos</option><option>Ropa</option><option>Dinero</option><option>Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Fecha *</label>
              <input v-model="formDon.fecha" type="date" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Origen</label>
            <input v-model="formDon.origen" type="text" placeholder="Ej: Nacional, Internacional..." class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/>
          </div>

          <!-- Sección de recursos a donar -->
          <div class="border-t border-slate-200 pt-4 space-y-3">
            <p class="text-xs font-bold text-slate-700 uppercase tracking-wider">Recursos a donar</p>
            <!-- Mini-tabla de recursos agregados -->
            <div v-if="detallesArray.length > 0" class="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-550 uppercase tracking-wider font-semibold">
                    <th class="px-3 py-2">Recurso</th>
                    <th class="px-3 py-2 text-center">Cantidad</th>
                    <th class="px-3 py-2 w-10 text-right"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-750">
                  <tr v-for="(item, idx) in detallesArray" :key="idx" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-3 py-2 text-slate-900 font-medium">{{ nombreRecurso(item.id_recurso) }}</td>
                    <td class="px-3 py-2 text-center font-bold text-emerald-700">{{ item.cantidad }}</td>
                    <td class="px-3 py-2 text-right">
                      <button @click="detallesArray.splice(idx, 1)" class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer" title="Quitar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Fila para agregar nuevo recurso -->
            <div class="flex items-end gap-3 pt-2 border-t border-slate-200">
              <div class="flex-1">
                <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Recurso</label>
                <select v-model.number="nuevoDetalle.id_recurso" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
                  <option :value="0">Seleccionar recurso</option>
                  <option v-for="r in recursos" :key="r.id" :value="r.id">{{ r.nombre }} ({{ r.tipo }} · {{ r.unidad }})</option>
                </select>
              </div>
              <div class="w-24">
                <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Cantidad</label>
                <input v-model.number="nuevoDetalle.cantidad" type="number" min="1" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/>
              </div>
              <button @click="agregarDetalleAlArray" :disabled="!nuevoDetalle.id_recurso || nuevoDetalle.cantidad < 1" class="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-100/50 disabled:bg-white disabled:border-slate-200 disabled:text-slate-350 transition-all cursor-pointer shadow-sm whitespace-nowrap">
                + Agregar
              </button>
            </div>
          </div>

          <div v-if="modalDonError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">{{ modalDonError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="modalDonacionVisible=false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardarDonacion" :disabled="savingDon" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">{{ savingDon ? 'Guardando...' : 'Registrar Donación' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Recurso a Donación Existente -->
    <div v-if="modalDetalleVisible" class="fixed inset-0 bg-slate-955/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">Agregar Recurso a Donación #{{ detalleIdDonacion }}</h2>
          <p class="text-xs text-slate-550 mt-0.5">El stock del recurso aumentará automáticamente</p>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Recurso *</label>
            <select v-model.number="formDetalle.id_recurso" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
              <option :value="0">Seleccionar recurso</option>
              <option v-for="r in recursos" :key="r.id" :value="r.id">{{ r.nombre }} ({{ r.tipo }} · {{ r.unidad }})</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Cantidad *</label>
            <input v-model.number="formDetalle.cantidad" type="number" min="1" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/>
          </div>
          <div v-if="modalDetalleError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">{{ modalDetalleError }}</div>
          <div v-if="modalDetalleOk" class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-semibold">{{ modalDetalleOk }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="modalDetalleVisible=false; modalDetalleOk=''" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cerrar</button>
          <button @click="guardarDetalle" :disabled="savingDetalle" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">{{ savingDetalle ? 'Agregando...' : 'Agregar Recurso' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Donante -->
    <div v-if="modalDonanteVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100"><h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">{{ editandoDonante ? 'Editar Donante' : 'Nuevo Donante' }}</h2></div>
        <div class="p-5 space-y-4 text-xs">
          <div><label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Nombre *</label><input v-model="formDonante.nombre" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Identificación *</label><input v-model="formDonante.identificacion" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/></div>
            <div><label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Tipo *</label>
              <select v-model="formDonante.tipo" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs">
                <option>Persona Natural</option><option>Empresa</option><option>ONG</option><option>Gobierno</option>
              </select>
            </div>
          </div>
          <div><label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Teléfono</label><input v-model="formDonante.telefono" type="tel" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-emerald-500 text-xs shadow-inner"/></div>
          <div v-if="modalDonanteError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">{{ modalDonanteError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="modalDonanteVisible=false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardarDonante" :disabled="savingDonante" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">{{ savingDonante ? 'Guardando...' : 'Guardar' }}</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import type { Donante, Recurso, Donacion, DetalleDonacion } from '@/types'
import {
  apiGetDonantes, apiCreateDonante, apiUpdateDonante, apiDeleteDonante,
  apiGetRecursos, apiGetDonaciones, apiAgregarDetalleDonacion
} from '@/services/api'
import apiClient from '@/services/axios'

const tab = ref<'donaciones' | 'donantes'>('donaciones')
const error = ref('')
const loadingDonantes = ref(true)
const loadingDonaciones = ref(true)

// ── Donantes ──────────────────────────────────────────────────────────────────
const donantes = ref<Donante[]>([])
const busquedaDonante = ref('')
const pageDo = ref(1); const perPageDo = ref(20)
const modalDonanteVisible = ref(false)
const editandoDonante = ref<Donante | null>(null)
const savingDonante = ref(false)
const modalDonanteError = ref('')
const formDonante = ref({ nombre: '', identificacion: '', tipo: 'Persona Natural', telefono: '' })

// ── Recursos (para detalles) ──────────────────────────────────────────────────
const recursos = ref<Recurso[]>([])

// ── Donaciones (cargadas desde GET /donaciones) ──────────────────────────────
const donaciones = ref<Donacion[]>([])
const pageD = ref(1); const perPageD = ref(20)
const donacionesPaginadas = computed(() => donaciones.value.slice((pageD.value-1)*perPageD.value, pageD.value*perPageD.value))

// ── Buscar donación por ID ───────────────────────────────────────────────────
const buscarId = ref<number | null>(null)
const buscando = ref(false)
const donacionDetalle = ref<any>(null)

// ── Modal Nueva Donación ──────────────────────────────────────────────────────
const modalDonacionVisible = ref(false)
const savingDon = ref(false)
const modalDonError = ref('')
const today = new Date().toISOString().split('T')[0]
const formDon = ref({ id_donante: 0, descripcion: '', categoria: '', fecha: today, origen: 'Nacional' })

// ── Recursos a donar (array local dentro del modal de nueva donación) ─────────
const detallesArray = ref<{ id_recurso: number; cantidad: number }[]>([])
const nuevoDetalle = ref({ id_recurso: 0, cantidad: 1 })

// ── Modal Detalle (agregar recurso a donación EXISTENTE) ──────────────────────
const modalDetalleVisible = ref(false)
const savingDetalle = ref(false)
const modalDetalleError = ref('')
const modalDetalleOk = ref('')
const detalleIdDonacion = ref(0)
const formDetalle = ref({ id_recurso: 0, cantidad: 1 })

// ── Helpers ───────────────────────────────────────────────────────────────────
const nombreDonante = (id: number) => donantes.value.find(d => d.id === id)?.nombre ?? `Donante #${id}`
const nombreRecurso = (id: number) => {
  const r = recursos.value.find(r => r.id === id)
  return r ? `${r.nombre} (${r.unidad})` : `Recurso #${id}`
}

const donantesFiltrados = computed(() => {
  if (!busquedaDonante.value) return donantes.value
  const q = busquedaDonante.value.toLowerCase()
  return donantes.value.filter(d => d.nombre.toLowerCase().includes(q) || d.identificacion.includes(q))
})
const donantesPaginados = computed(() => donantesFiltrados.value.slice((pageDo.value-1)*perPageDo.value, pageDo.value*perPageDo.value))

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  // Cargar donantes, recursos y donaciones en paralelo
  const [resDon, resR, resDonaciones] = await Promise.all([
    apiGetDonantes(),
    apiGetRecursos(),
    apiGetDonaciones()
  ])
  if (resDon.success && resDon.data) donantes.value = resDon.data
  else error.value = resDon.message ?? 'Error al cargar donantes'
  if (resR.success && resR.data) recursos.value = resR.data
  if (resDonaciones.success && resDonaciones.data) donaciones.value = resDonaciones.data
  else if (!error.value) error.value = resDonaciones.message ?? 'Error al cargar donaciones'
  loadingDonantes.value = false
  loadingDonaciones.value = false
})

// ── Consultar una donación por ID (para detalle con recursos incluidos) ───────
async function fetchDonacionById(id: number): Promise<any | null> {
  try {
    const res = await apiClient.get('', { params: { route: 'donaciones', id } })
    const json = res.data
    if (json.status === 200 && json.data) return json.data
    return null
  } catch { return null }
}

// ── Buscar donación por ID ────────────────────────────────────────────────────
async function buscarDonacion() {
  if (!buscarId.value) return
  buscando.value = true; donacionDetalle.value = null; error.value = ''
  const data = await fetchDonacionById(buscarId.value)
  if (data) { donacionDetalle.value = data }
  else error.value = `No se encontró la donación #${buscarId.value}`
  buscando.value = false
}

async function verDetalle(id: number) {
  buscarId.value = id
  await buscarDonacion()
}

// ── Recargar lista de donaciones desde la API ─────────────────────────────────
async function recargarDonaciones() {
  const res = await apiGetDonaciones()
  if (res.success && res.data) donaciones.value = res.data
}

// ── Nueva Donación (modal integrado con recursos) ─────────────────────────────
function abrirModalDonacion() {
  formDon.value = { id_donante: 0, descripcion: '', categoria: '', fecha: today, origen: 'Nacional' }
  detallesArray.value = []
  nuevoDetalle.value = { id_recurso: 0, cantidad: 1 }
  modalDonError.value = ''
  modalDonacionVisible.value = true
}

/** Agrega un recurso al array local del modal de nueva donación */
function agregarDetalleAlArray() {
  if (!nuevoDetalle.value.id_recurso || nuevoDetalle.value.cantidad < 1) return
  // Si el recurso ya existe en el array, sumar la cantidad
  const existente = detallesArray.value.find(d => d.id_recurso === nuevoDetalle.value.id_recurso)
  if (existente) {
    existente.cantidad += nuevoDetalle.value.cantidad
  } else {
    detallesArray.value.push({ id_recurso: nuevoDetalle.value.id_recurso, cantidad: nuevoDetalle.value.cantidad })
  }
  nuevoDetalle.value = { id_recurso: 0, cantidad: 1 }
}

async function guardarDonacion() {
  if (!formDon.value.id_donante || !formDon.value.categoria) { modalDonError.value = 'Donante y categoría son obligatorios'; return }
  savingDon.value = true; modalDonError.value = ''
  try {
    // 1. Crear cabecera de donación
    const res = await apiClient.post('', formDon.value, { params: { route: 'donaciones' } })
    const json = res.data
    if (json.status === 201 && json.id_donacion) {
      const idDonacion = json.id_donacion

      // 2. Enviar todos los detalles de recursos en paralelo
      if (detallesArray.value.length > 0) {
        await Promise.all(
          detallesArray.value.map(detalle =>
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
      }

      // 3. Recargar la lista completa de donaciones
      await recargarDonaciones()
      modalDonacionVisible.value = false
    } else {
      modalDonError.value = json.message ?? json.error ?? 'Error al registrar'
    }
  } catch (e: any) {
    modalDonError.value = e.response?.data?.message ?? 'Error de conexión'
  } finally { savingDon.value = false }
}

// ── Agregar Recurso a Donación Existente ──────────────────────────────────────
function abrirModalDetalleExistente(idDonacion: number) {
  detalleIdDonacion.value = idDonacion
  formDetalle.value = { id_recurso: 0, cantidad: 1 }
  modalDetalleError.value = ''; modalDetalleOk.value = ''
  modalDetalleVisible.value = true
}

async function guardarDetalle() {
  if (!formDetalle.value.id_recurso || formDetalle.value.cantidad < 1) { modalDetalleError.value = 'Recurso y cantidad son obligatorios'; return }
  savingDetalle.value = true; modalDetalleError.value = ''; modalDetalleOk.value = ''
  try {
    const res = await apiClient.post('', { id_donacion: detalleIdDonacion.value, id_recurso: formDetalle.value.id_recurso, cantidad: formDetalle.value.cantidad }, { params: { route: 'donaciones', action: 'agregar_detalle' } })
    const json = res.data
    if (json.status === 201) {
      modalDetalleOk.value = '✓ Recurso agregado. El stock ha sido actualizado.'
      formDetalle.value = { id_recurso: 0, cantidad: 1 }
      // Actualizar recursos (el stock cambió)
      const resR = await apiGetRecursos()
      if (resR.success && resR.data) recursos.value = resR.data
    } else {
      modalDetalleError.value = json.message ?? json.error ?? 'Error al agregar'
    }
  } catch (e: any) {
    modalDetalleError.value = e.response?.data?.message ?? e.response?.data?.error ?? 'Error de conexión'
  } finally { savingDetalle.value = false }
}

// ── CRUD Donantes ─────────────────────────────────────────────────────────────
function abrirModalDonante(d?: Donante) {
  editandoDonante.value = d ?? null
  formDonante.value = d ? { nombre: d.nombre, identificacion: d.identificacion, tipo: d.tipo, telefono: d.telefono } : { nombre: '', identificacion: '', tipo: 'Persona Natural', telefono: '' }
  modalDonanteError.value = ''; modalDonanteVisible.value = true
}

async function guardarDonante() {
  if (!formDonante.value.nombre.trim() || !formDonante.value.identificacion.trim()) { modalDonanteError.value = 'Nombre e identificación son obligatorios'; return }
  savingDonante.value = true; modalDonanteError.value = ''
  try {
    if (editandoDonante.value) {
      const res = await apiUpdateDonante(editandoDonante.value.id, formDonante.value)
      if (res.success) { const idx = donantes.value.findIndex(x => x.id === editandoDonante.value!.id); if (idx !== -1) donantes.value[idx] = { ...donantes.value[idx], ...formDonante.value } }
      else modalDonanteError.value = res.message ?? 'Error'
    } else {
      const res = await apiCreateDonante(formDonante.value)
      if (res.success) { const r = await apiGetDonantes(); if (r.success && r.data) donantes.value = r.data }
      else modalDonanteError.value = res.message ?? 'Error'
    }
    if (!modalDonanteError.value) modalDonanteVisible.value = false
  } finally { savingDonante.value = false }
}

async function eliminarDonante(d: Donante) {
  if (!confirm(`¿Eliminar al donante "${d.nombre}"?`)) return
  const res = await apiDeleteDonante(d.id)
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
