<template>
  <AppLayout title="Familias">
    <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Censo de Familias
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Registro de familias damnificadas y sus miembros</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 text-[10px] uppercase tracking-wider font-semibold">
            <button @click="tab='familias'" :class="['px-3.5 py-1.5 rounded-lg transition-all cursor-pointer', tab==='familias' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent']">Familias</button>
            <button @click="tab='miembros'" :class="['px-3.5 py-1.5 rounded-lg transition-all cursor-pointer', tab==='miembros' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent']">Miembros</button>
          </div>
          <button v-if="authStore.canManageFamilias" @click="abrirModal()" class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-sm transition-all cursor-pointer">
            <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ tab === 'familias' ? 'Nueva Familia' : 'Nuevo Miembro' }}
          </button>
        </div>
      </div>

      <!-- Mobile tabs -->
      <div class="sm:hidden flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 mb-4 text-[10px] uppercase tracking-wider font-semibold">
        <button @click="tab='familias'" :class="['flex-1 py-2 text-center rounded-lg transition-all cursor-pointer', tab==='familias' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500']">Familias</button>
        <button @click="tab='miembros'" :class="['flex-1 py-2 text-center rounded-lg transition-all cursor-pointer', tab==='miembros' ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm' : 'text-slate-500']">Miembros</button>
      </div>

      <!-- ── TAB FAMILIAS ── -->
      <template v-if="tab === 'familias'">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md animate-[fadeIn_0.3s_ease-out]">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Familias</p>
            <p class="text-2xl font-bold text-slate-900 mt-2">{{ familias.length }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md animate-[fadeIn_0.3s_ease-out]">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-50/50 group-hover:bg-emerald-50 blur-lg transition-all"></div>
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Personas</p>
            <p class="text-2xl font-bold text-emerald-600 mt-2">{{ totalPersonas }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md animate-[fadeIn_0.3s_ease-out]">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-cyan-50/50 group-hover:bg-cyan-50 blur-lg transition-all"></div>
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Prioridad Promedio</p>
            <p class="text-2xl font-bold text-cyan-600 mt-2">{{ puntajePromedio }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md animate-[fadeIn_0.3s_ease-out]">
            <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-rose-50/50 group-hover:bg-rose-50 blur-lg transition-all"></div>
            <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Alta Prioridad</p>
            <p class="text-2xl font-bold text-rose-600 mt-2">{{ familiasAltaPrioridad }}</p>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
          <input v-model="busqueda" type="text" placeholder="Buscar por cédula, representante o dirección..."
            class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"/>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <div v-if="loading" class="flex justify-center py-16">
            <svg class="animate-spin h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                  <th class="px-5 py-3.5">Cédula</th>
                  <th class="px-5 py-3.5">Representante</th>
                  <th class="px-5 py-3.5 hidden sm:table-cell">Teléfono</th>
                  <th class="px-5 py-3.5 hidden md:table-cell">Dirección</th>
                  <th class="px-5 py-3.5 text-center">Miembros</th>
                  <th class="px-5 py-3.5 text-center">Puntaje Prioridad</th>
                  <th class="px-5 py-3.5 text-center hidden sm:table-cell">Habeas</th>
                  <th class="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="f in familiasPaginadas" :key="f.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                  <td class="px-5 py-4 border-b border-slate-100/40"><span class="text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-slate-700 font-semibold">{{ f.cedula }}</span></td>
                  <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ f.representante }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden sm:table-cell border-b border-slate-100/40">{{ f.telefono || '—' }}</td>
                  <td class="px-5 py-4 text-slate-500 text-xs hidden md:table-cell max-w-40 truncate border-b border-slate-100/40">{{ f.direccion }}</td>
                  <td class="px-5 py-4 text-center border-b border-slate-100/40">
                    <button @click="verMiembros(f)" class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-xs font-semibold hover:bg-emerald-100/50 transition-all cursor-pointer shadow-sm" :title="'Ver miembros de ' + f.representante">
                      {{ f.cantidad_miembros }}
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                  </td>
                  <td class="px-5 py-4 text-center border-b border-slate-100/40">
                    <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border', f.prioridad >= 85 ? 'bg-rose-50 text-rose-700 border-rose-200' : f.prioridad >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200']">
                      {{ f.prioridad }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-center hidden sm:table-cell border-b border-slate-100/40">
                    <span :class="f.aceptacion_habeas_data ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'">{{ f.aceptacion_habeas_data ? '✓' : '✗' }}</span>
                  </td>
                  <td class="px-5 py-4 text-right border-b border-slate-100/40">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="abrirModalMiembro(undefined, f)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Agregar miembro">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                      </button>
                      <button v-if="authStore.canManageFamilias" @click="abrirModal(f)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Editar familia">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button v-if="authStore.canManageFamilias" @click="eliminarFamilia(f)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="familiasFiltradas.length === 0">
                  <td colspan="8" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">NO SE ENCONTRARON REGISTROS</td>
                </tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="familiasFiltradas.length > 0" v-model:page="pageF" v-model:perPage="perPageF" :total="familiasFiltradas.length" />
        </div>
      </template>

      <!-- ── TAB MIEMBROS ── -->
      <template v-else>
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-end justify-between shadow-md">
          <div class="flex-1 min-w-[260px] space-y-1.5 text-xs">
            <label class="text-slate-500 font-semibold uppercase tracking-wider block">Filtrar por Familia *</label>
            <select v-model="familiaSeleccionada" @change="cargarMiembros" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-emerald-500 cursor-pointer">
              <option value="">— Selecciona una familia —</option>
              <option v-for="f in familias" :key="f.id" :value="f.id">{{ f.representante }} ({{ f.cedula }})</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <input v-model="busquedaMiembro" type="text" placeholder="Buscar miembro..."
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 outline-none transition-all shadow-inner"/>
          </div>
          <button v-if="authStore.canManageFamilias && familiaSeleccionada" @click="abrirModalMiembro()" class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-sm transition-all cursor-pointer">
            <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Agregar miembro
          </button>
        </div>

        <!-- Info de la familia seleccionada -->
        <div v-if="familiaSeleccionada" class="bg-emerald-50 border border-emerald-250 rounded-2xl p-3.5 flex items-center gap-2 text-xs text-emerald-800 shadow-md">
          <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-emerald-700 font-bold uppercase">{{ familiaActual?.representante }}</span>
          <span class="text-slate-500">· {{ miembrosFiltrados.length }} miembro(s) registrado(s)</span>
        </div>

        <div v-if="!familiaSeleccionada" class="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 shadow-md">
          <svg class="w-12 h-12 text-slate-355 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <p class="text-slate-400 font-semibold text-xs uppercase tracking-wider">Selecciona una familia para visualizar su estructura de miembros</p>
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <div v-if="loadingMiembros" class="flex justify-center py-16">
            <svg class="animate-spin h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-emerald-50/80 border-b border-emerald-200 text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                  <th class="px-5 py-3.5 font-bold">Nombre</th>
                  <th class="px-5 py-3.5 font-bold text-center hidden sm:table-cell">Edad</th>
                  <th class="px-5 py-3.5 font-bold hidden sm:table-cell">Doc.</th>
                  <th class="px-5 py-3.5 font-bold hidden md:table-cell">Número</th>
                  <th class="px-5 py-3.5 font-bold">Parentesco</th>
                  <th class="px-5 py-3.5 font-bold text-center">Emb.</th>
                  <th class="px-5 py-3.5 font-bold text-center hidden md:table-cell">Discap.</th>
                  <th class="px-5 py-3.5 font-bold text-center hidden md:table-cell">Enf.Cr.</th>
                  <th class="px-5 py-3.5 font-bold text-center">Vuln.</th>
                  <th v-if="authStore.canManageFamilias" class="px-5 py-3.5 font-bold text-right">Acc.</th>
                </tr>
              </thead>
              <tbody class="text-xs text-slate-700">
                <tr v-for="m in miembrosPaginados" :key="m.id" class="odd:bg-white even:bg-emerald-50/20 hover:bg-emerald-100/30 transition-colors">
                  <td class="px-5 py-4 font-semibold text-slate-900 text-sm border-b border-slate-100/40">{{ m.nombre }}</td>
                  <td class="px-5 py-4 text-center text-slate-500 hidden sm:table-cell border-b border-slate-100/40">{{ m.edad ?? '—' }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden sm:table-cell border-b border-slate-100/40">{{ m.tipo_documento }}</td>
                  <td class="px-5 py-4 text-slate-500 hidden md:table-cell text-xs border-b border-slate-100/40">{{ m.numero_documento }}</td>
                  <td class="px-5 py-4 text-slate-700 border-b border-slate-100/40">{{ m.parentezco }}</td>
                  <td class="px-5 py-4 text-center border-b border-slate-100/40"><span :class="m.es_embarazada ? 'text-pink-600 font-bold' : 'text-slate-350'">{{ m.es_embarazada ? '✓' : '–' }}</span></td>
                  <td class="px-5 py-4 text-center hidden md:table-cell border-b border-slate-100/40"><span :class="m.tiene_discapacidad ? 'text-amber-600 font-bold' : 'text-slate-350'">{{ m.tiene_discapacidad ? '✓' : '–' }}</span></td>
                  <td class="px-5 py-4 text-center hidden md:table-cell border-b border-slate-100/40"><span :class="m.enfermedad_cronica ? 'text-rose-600 font-bold' : 'text-slate-350'">{{ m.enfermedad_cronica ? '✓' : '–' }}</span></td>
                  <td class="px-5 py-4 text-center border-b border-slate-100/40">
                    <span :class="['inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider', m.vulnerable ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200']">
                      {{ m.vulnerable ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td v-if="authStore.canManageFamilias" class="px-5 py-4 text-right border-b border-slate-100/40">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="abrirModalMiembro(m)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                      <button @click="eliminarMiembro(m)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="miembrosFiltrados.length === 0 && !loadingMiembros">
                  <td :colspan="authStore.canManageFamilias ? 10 : 9" class="px-5 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100/40">
                    ESTA FAMILIA NO TIENE MIEMBROS REGISTRADOS AÚN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="miembrosFiltrados.length > 0" v-model:page="pageM" v-model:perPage="perPageM" :total="miembrosFiltrados.length" />
        </div>
      </template>
    </div>

    <!-- Modal Familia -->
    <div v-if="modalVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl my-6 animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">{{ editando ? 'Editar Familia' : 'Registrar Familia' }}</h2>
          <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Cédula *</label>
              <input v-model="form.cedula" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Representante (Cabeza de Hogar) *</label>
            <input v-model="form.representante" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Dirección Física *</label>
            <input v-model="form.direccion" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Ubicación de Origen / Zona</label>
            <input v-model="form.ubicacion_actual" type="text" placeholder="Ej: Zona inundada, barrio..." class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Cant. Miembros</label>
              <input v-model.number="form.cantidad_miembros" type="number" min="1" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Prioridad</label>
              <input :value="editando ? form.prioridad : 'Calculada por motor'" type="text" disabled class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs"/>
            </div>
          </div>
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Refugio Temporal Asignado</label>
            <select v-model.number="form.id_refugio" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs">
              <option :value="0">Sin asignar / Pendiente</option>
              <option v-for="r in refugios" :key="r.id" :value="r.id">{{ r.nombre }}</option>
            </select>
          </div>
          <div class="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl select-none cursor-pointer">
            <input id="habeas" v-model="form.aceptacion_habeas_data" type="checkbox" class="w-4 h-4 bg-white border-slate-350 text-emerald-600 rounded focus:ring-0 focus:ring-offset-0"/>
            <label for="habeas" class="text-xs text-slate-600 font-semibold cursor-pointer uppercase tracking-wide">Acepta Políticas Habeas Data *</label>
          </div>
          <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 shadow-md">{{ error }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="cerrarModal" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardar" :disabled="saving" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">
            {{ saving ? 'Procesando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Miembro -->
    <div v-if="modalMiembroVisible" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl my-6 animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 class="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">{{ editandoMiembro ? 'Editar Miembro' : 'Agregar Miembro' }}</h2>
            <p class="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">Representante: {{ familiaParaMiembro?.representante }}</p>
          </div>
          <button @click="cerrarModalMiembro" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Nombre Completo *</label>
            <input v-model="formMiembro.nombre" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Tipo Doc.</label>
              <select v-model="formMiembro.tipo_documento" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs">
                <option>CC</option><option>TI</option><option>CE</option><option>RC</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Número Documento *</label>
              <input v-model="formMiembro.numero_documento" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Edad</label>
              <input v-model.number="formMiembro.edad" type="number" min="0" max="120" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"/>
            </div>
            <div>
              <label class="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Parentesco</label>
              <select v-model="formMiembro.parentezco" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs">
                <option>Cabeza de hogar</option><option>Cónyuge</option><option>Hijo</option><option>Padre/Madre</option><option>Abuelo/a</option><option>Otro</option>
              </select>
            </div>
          </div>
          <div class="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <p class="text-slate-600 uppercase tracking-wider font-bold mb-3 border-b border-slate-200/60 pb-1.5">Condiciones de vulnerabilidad</p>
            <label class="flex items-center gap-3 cursor-pointer select-none"><input v-model="formMiembro.es_embarazada" type="checkbox" class="w-4 h-4 bg-white border-slate-350 text-pink-600 rounded focus:ring-0"/><span class="text-slate-600 text-xs font-semibold uppercase tracking-wide">Está embarazada</span></label>
            <label class="flex items-center gap-3 cursor-pointer select-none"><input v-model="formMiembro.tiene_discapacidad" type="checkbox" class="w-4 h-4 bg-white border-slate-350 text-amber-600 rounded focus:ring-0"/><span class="text-slate-600 text-xs font-semibold uppercase tracking-wide">Tiene discapacidad</span></label>
            <label class="flex items-center gap-3 cursor-pointer select-none"><input v-model="formMiembro.enfermedad_cronica" type="checkbox" class="w-4 h-4 bg-white border-slate-350 text-rose-600 rounded focus:ring-0"/><span class="text-slate-600 text-xs font-semibold uppercase tracking-wide">Enfermedad crónica</span></label>
            <label class="flex items-center gap-3 cursor-pointer select-none"><input v-model="formMiembro.vulnerable" type="checkbox" class="w-4 h-4 bg-white border-slate-350 text-rose-600 rounded focus:ring-0"/><span class="text-slate-600 text-xs font-semibold uppercase tracking-wide">Vulnerabilidad Crítica</span></label>
            <div v-if="formMiembro.vulnerable" class="pt-2 animate-[fadeIn_0.2s_ease-out]">
              <input v-model="formMiembro.tipo_vulnerabilidad" type="text" placeholder="Especificar condición especial..." class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-sans shadow-inner"/>
            </div>
          </div>
          <div v-if="modalMiembroError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">{{ modalMiembroError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 text-xs uppercase tracking-wider">
          <button @click="cerrarModalMiembro" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer bg-white">Cancelar</button>
          <button @click="guardarMiembro" :disabled="savingM" class="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer">
            {{ savingM ? 'Procesando...' : 'Confirmar' }}
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
import {
  apiGetFamilias, apiCreateFamilia, apiUpdateFamilia, apiDeleteFamilia,
  apiGetMiembros, apiCreateMiembro, apiUpdateMiembro, apiDeleteMiembro,
  apiGetRefugios,
  type Familia, type MiembroFamilia, type Refugio
} from '@/services/api'

const authStore = useAuthStore()
const tab = ref<'familias' | 'miembros'>('familias')

// ── Data ──────────────────────────────────────────────────────────────────────
const familias = ref<Familia[]>([])
const miembros = ref<MiembroFamilia[]>([])
const refugios = ref<Refugio[]>([])
const familiaSeleccionada = ref<number | ''>('')
const loadingMiembros = ref(false)

// ── UI state ──────────────────────────────────────────────────────────────────
const loading = ref(true)
const saving = ref(false)
const savingM = ref(false)
const error = ref('')
const modalError = ref('')
const modalMiembroError = ref('')
const busqueda = ref('')
const busquedaMiembro = ref('')
const pageF = ref(1); const perPageF = ref(20)
const pageM = ref(1); const perPageM = ref(20)
const modalVisible = ref(false)
const editando = ref<Familia | null>(null)
const modalMiembroVisible = ref(false)
const editandoMiembro = ref<MiembroFamilia | null>(null)
const familiaParaMiembro = ref<Familia | null>(null)

// ── Forms ─────────────────────────────────────────────────────────────────────
const form = ref({
  cedula: '', representante: '', telefono: '', direccion: '',
  cantidad_miembros: 1, prioridad: 10, id_refugio: 0,
  ubicacion_actual: 'Vivienda', aceptacion_habeas_data: false
})
const formMiembro = ref({
  familia_id: 0, nombre: '', edad: 0, tipo_documento: 'CC',
  numero_documento: '', parentezco: 'Hijo',
  es_embarazada: false, tiene_discapacidad: false,
  enfermedad_cronica: false, vulnerable: false, tipo_vulnerabilidad: ''
})

// ── Computed ──────────────────────────────────────────────────────────────────
const totalPersonas = computed(() => familias.value.reduce((a, f) => a + f.cantidad_miembros, 0))
const puntajePromedio = computed(() => { const validos = familias.value.filter(f => !isNaN(Number(f.prioridad))); return validos.length ? Math.round(validos.reduce((a, f) => a + Number(f.prioridad), 0) / validos.length) : 0 })
const familiasAltaPrioridad = computed(() => familias.value.filter(f => Number(f.prioridad) >= 85).length)
const familiaActual = computed(() => familias.value.find(f => f.id === familiaSeleccionada.value) ?? null)

const familiasFiltradas = computed(() => {
  if (!busqueda.value) return familias.value
  const q = busqueda.value.toLowerCase()
  return familias.value.filter(f =>
    f.representante.toLowerCase().includes(q) ||
    f.cedula.includes(q) ||
    f.direccion.toLowerCase().includes(q)
  )
})
const familiasPaginadas = computed(() =>
  familiasFiltradas.value.slice((pageF.value - 1) * perPageF.value, pageF.value * perPageF.value)
)

const miembrosFiltrados = computed(() => {
  if (!busquedaMiembro.value) return miembros.value
  const q = busquedaMiembro.value.toLowerCase()
  return miembros.value.filter(m =>
    m.nombre.toLowerCase().includes(q) ||
    m.numero_documento.includes(q)
  )
})
const miembrosPaginados = computed(() =>
  miembrosFiltrados.value.slice((pageM.value - 1) * perPageM.value, pageM.value * perPageM.value)
)

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  const [resF, resR] = await Promise.all([apiGetFamilias(), apiGetRefugios()])
  if (resF.success && resF.data) familias.value = resF.data
  else error.value = resF.message ?? 'Error al cargar familias'
  if (resR.success && resR.data) refugios.value = resR.data
  loading.value = false
})

// ── Cargar miembros de una familia ────────────────────────────────────────────
async function cargarMiembros() {
  if (!familiaSeleccionada.value) { miembros.value = []; return }
  loadingMiembros.value = true
  miembros.value = []
  const res = await apiGetMiembros(familiaSeleccionada.value as number)
  if (res.success && res.data) miembros.value = res.data
  else error.value = res.message ?? 'Error al cargar miembros'
  loadingMiembros.value = false
  pageM.value = 1
}

/** Ir al tab miembros con la familia ya seleccionada */
function verMiembros(f: Familia) {
  familiaSeleccionada.value = f.id
  tab.value = 'miembros'
  cargarMiembros()
}

// ── CRUD Familia ──────────────────────────────────────────────────────────────
function abrirModal(f?: Familia) {
  editando.value = f ?? null
  form.value = f
    ? { cedula: f.cedula, representante: f.representante, telefono: f.telefono, direccion: f.direccion, cantidad_miembros: f.cantidad_miembros, prioridad: f.prioridad, id_refugio: f.id_refugio, ubicacion_actual: f.ubicacion_actual, aceptacion_habeas_data: f.aceptacion_habeas_data }
    : { cedula: '', representante: '', telefono: '', direccion: '', cantidad_miembros: 1, prioridad: 10, id_refugio: 0, ubicacion_actual: 'Vivienda', aceptacion_habeas_data: false }
  modalError.value = ''
  modalVisible.value = true
}
function cerrarModal() { modalVisible.value = false }

async function guardar() {
  if (!form.value.cedula.trim() || !form.value.representante.trim() || !form.value.direccion.trim()) {
    modalError.value = 'Cédula, representante y dirección son obligatorios'; return
  }
  saving.value = true; modalError.value = ''
  try {
    if (editando.value) {
      const res = await apiUpdateFamilia(editando.value.id, form.value)
      if (res.success) {
        const idx = familias.value.findIndex(x => x.id === editando.value!.id)
        if (idx !== -1) familias.value[idx] = { ...familias.value[idx], ...form.value }
      } else { modalError.value = res.message ?? 'Error al actualizar' }
    } else {
      const res = await apiCreateFamilia(form.value)
      if (res.success) {
        const r = await apiGetFamilias()
        if (r.success && r.data) familias.value = r.data
      } else { modalError.value = res.message ?? 'Error al crear' }
    }
    if (!modalError.value) cerrarModal()
  } finally { saving.value = false }
}

async function eliminarFamilia(f: Familia) {
  if (!confirm(`¿Eliminar familia de "${f.representante}"?`)) return
  const res = await apiDeleteFamilia(f.id)
  if (res.success) familias.value = familias.value.filter(x => x.id !== f.id)
  else error.value = res.message ?? 'Error al eliminar'
}

// ── CRUD Miembro ──────────────────────────────────────────────────────────────
function abrirModalMiembro(m?: MiembroFamilia, familiaDesdeFila?: Familia) {
  editandoMiembro.value = m ?? null

  // Determinar a qué familia pertenece
  const familiaId = m?.familia_id ?? familiaDesdeFila?.id ?? (familiaSeleccionada.value as number) ?? 0
  familiaParaMiembro.value = familias.value.find(f => f.id === familiaId) ?? null

  formMiembro.value = m
    ? {
        familia_id: m.familia_id,
        nombre: m.nombre, edad: m.edad ?? 0,
        tipo_documento: m.tipo_documento, numero_documento: m.numero_documento,
        parentezco: m.parentezco,
        es_embarazada: m.es_embarazada, tiene_discapacidad: m.tiene_discapacidad,
        enfermedad_cronica: m.enfermedad_cronica, vulnerable: m.vulnerable,
        tipo_vulnerabilidad: m.tipo_vulnerabilidad
      }
    : {
        familia_id: familiaId,
        nombre: '', edad: 0, tipo_documento: 'CC', numero_documento: '',
        parentezco: 'Hijo', es_embarazada: false, tiene_discapacidad: false,
        enfermedad_cronica: false, vulnerable: false, tipo_vulnerabilidad: ''
      }
  modalMiembroError.value = ''
  modalMiembroVisible.value = true
}
function cerrarModalMiembro() { modalMiembroVisible.value = false }

async function guardarMiembro() {
  if (!formMiembro.value.nombre.trim() || !formMiembro.value.numero_documento.trim()) {
    modalMiembroError.value = 'Nombre y número de documento son obligatorios'; return
  }
  if (!formMiembro.value.familia_id) {
    modalMiembroError.value = 'No se pudo determinar la familia'; return
  }
  savingM.value = true; modalMiembroError.value = ''
  try {
    if (editandoMiembro.value) {
      const res = await apiUpdateMiembro(editandoMiembro.value.id, formMiembro.value)
      if (res.success) {
        const idx = miembros.value.findIndex(x => x.id === editandoMiembro.value!.id)
        if (idx !== -1) miembros.value[idx] = { ...miembros.value[idx], ...formMiembro.value }
      } else { modalMiembroError.value = res.message ?? 'Error al actualizar' }
    } else {
      const res = await apiCreateMiembro(formMiembro.value as any)
      if (res.success) {
        // Recargar miembros de esta familia
        await cargarMiembros()
        // Si se agregó desde la fila de familia, cambiar al tab de miembros
        if (tab.value === 'familias') {
          familiaSeleccionada.value = formMiembro.value.familia_id
          tab.value = 'miembros'
        }
      } else { modalMiembroError.value = res.message ?? 'Error al crear' }
    }
    if (!modalMiembroError.value) cerrarModalMiembro()
  } finally { savingM.value = false }
}

async function eliminarMiembro(m: MiembroFamilia) {
  if (!confirm(`¿Eliminar a "${m.nombre}"?`)) return
  const res = await apiDeleteMiembro(m.id)
  if (res.success) miembros.value = miembros.value.filter(x => x.id !== m.id)
  else error.value = res.message ?? 'Error al eliminar'
}
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
