<template>
  <AppLayout title="Familias">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Censo de Familias</h1>
          <p class="text-sm text-slate-500 mt-0.5">Registro de familias damnificadas y sus miembros</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex bg-slate-100 rounded-lg p-1 gap-1">
            <button @click="tab='familias'" :class="['px-3 py-1.5 text-xs font-medium rounded-md transition-colors', tab==='familias' ? 'bg-white shadow text-emerald-700' : 'text-slate-500 hover:text-slate-700']">Familias</button>
            <button @click="tab='miembros'" :class="['px-3 py-1.5 text-xs font-medium rounded-md transition-colors', tab==='miembros' ? 'bg-white shadow text-emerald-700' : 'text-slate-500 hover:text-slate-700']">Miembros</button>
          </div>
          <button v-if="authStore.canManageFamilias" @click="abrirModal()" class="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ tab === 'familias' ? 'Nueva Familia' : 'Nuevo Miembro' }}
          </button>
        </div>
      </div>

      <!-- Mobile tabs -->
      <div class="sm:hidden flex bg-slate-100 rounded-lg p-1 gap-1 mb-4">
        <button @click="tab='familias'" :class="['flex-1 py-1.5 text-xs font-medium rounded-md transition-colors', tab==='familias' ? 'bg-white shadow text-emerald-700' : 'text-slate-500']">Familias</button>
        <button @click="tab='miembros'" :class="['flex-1 py-1.5 text-xs font-medium rounded-md transition-colors', tab==='miembros' ? 'bg-white shadow text-emerald-700' : 'text-slate-500']">Miembros</button>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error }}</div>

      <!-- ── TAB FAMILIAS ── -->
      <template v-if="tab === 'familias'">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Total Familias</p><p class="text-2xl font-bold text-slate-800">{{ familias.length }}</p></div>
          <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Total Personas</p><p class="text-2xl font-bold text-emerald-600">{{ totalPersonas }}</p></div>
          <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Puntaje Promedio</p><p class="text-2xl font-bold text-blue-600">{{ puntajePromedio }}</p></div>
          <div class="bg-white rounded-xl p-4 border border-slate-200"><p class="text-xs text-slate-500 mb-1">Alta Prioridad</p><p class="text-2xl font-bold text-red-500">{{ familiasAltaPrioridad }}</p></div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3">
          <input v-model="busqueda" type="text" placeholder="Buscar por cédula, representante o dirección..."
            class="flex-1 min-w-48 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div v-if="loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cédula</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Representante</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Teléfono</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Dirección</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Miembros</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Prioridad</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Habeas</th>
                  <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="f in familiasPaginadas" :key="f.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3"><span class="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{{ f.cedula }}</span></td>
                  <td class="px-4 py-3 font-medium text-slate-800">{{ f.representante }}</td>
                  <td class="px-4 py-3 text-slate-500 hidden sm:table-cell">{{ f.telefono }}</td>
                  <td class="px-4 py-3 text-slate-500 text-xs hidden md:table-cell max-w-40 truncate">{{ f.direccion }}</td>
                  <td class="px-4 py-3 text-center">
                    <button @click="verMiembros(f)" class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer" :title="'Ver miembros de ' + f.representante">
                      {{ f.cantidad_miembros }}
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                  </td>
                  <td class="px-4 py-3 text-center"><span :class="['inline-block px-2 py-0.5 rounded-full text-xs font-semibold', f.prioridad >= 85 ? 'bg-red-100 text-red-700' : f.prioridad >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700']">{{ f.prioridad }}</span></td>
                  <td class="px-4 py-3 text-center hidden sm:table-cell"><span :class="f.aceptacion_habeas_data ? 'text-green-600' : 'text-red-400'">{{ f.aceptacion_habeas_data ? '✓' : '✗' }}</span></td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="abrirModalMiembro(undefined, f)" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Agregar miembro">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                      </button>
                      <button v-if="authStore.canManageFamilias" @click="abrirModal(f)" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar familia">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button v-if="authStore.canManageFamilias" @click="eliminarFamilia(f)" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="familiasFiltradas.length === 0"><td colspan="8" class="px-4 py-12 text-center text-slate-400 text-sm">No se encontraron familias</td></tr>
              </tbody>
            </table>
          </div>
          <PaginationBar v-if="familiasFiltradas.length > 0" v-model:page="pageF" v-model:perPage="perPageF" :total="familiasFiltradas.length" />
        </div>
      </template>

      <!-- ── TAB MIEMBROS ── -->
      <template v-else>
        <div class="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div>
            <label class="text-xs font-medium text-slate-600 block mb-1">Familia *</label>
            <select v-model="familiaSeleccionada" @change="cargarMiembros" class="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400 min-w-56">
              <option value="">— Selecciona una familia —</option>
              <option v-for="f in familias" :key="f.id" :value="f.id">{{ f.representante }} ({{ f.cedula }})</option>
            </select>
          </div>
          <input v-model="busquedaMiembro" type="text" placeholder="Buscar miembro..."
            class="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/>
          <button v-if="authStore.canManageFamilias && familiaSeleccionada" @click="abrirModalMiembro()" class="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Agregar miembro
          </button>
        </div>

        <!-- Info de la familia seleccionada -->
        <div v-if="familiaSeleccionada" class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-sm text-emerald-800 font-medium">{{ familiaActual?.representante }}</span>
          <span class="text-xs text-emerald-600">· {{ miembrosFiltrados.length }} miembro(s) registrado(s)</span>
        </div>

        <div v-if="!familiaSeleccionada" class="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <p class="text-slate-400 text-sm">Selecciona una familia para ver sus miembros</p>
        </div>

        <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div v-if="loadingMiembros" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Edad</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Doc.</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Número</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Parentesco</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Emb.</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Discap.</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Enf.Cr.</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Vuln.</th>
                  <th v-if="authStore.canManageFamilias" class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acc.</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="m in miembrosPaginados" :key="m.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3 font-medium text-slate-800">{{ m.nombre }}</td>
                  <td class="px-4 py-3 text-center text-slate-500 hidden sm:table-cell">{{ m.edad ?? '—' }}</td>
                  <td class="px-4 py-3 text-slate-500 hidden sm:table-cell">{{ m.tipo_documento }}</td>
                  <td class="px-4 py-3 text-slate-500 hidden md:table-cell font-mono text-xs">{{ m.numero_documento }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ m.parentezco }}</td>
                  <td class="px-4 py-3 text-center"><span :class="m.es_embarazada ? 'text-pink-600 font-bold' : 'text-slate-300'">{{ m.es_embarazada ? '✓' : '–' }}</span></td>
                  <td class="px-4 py-3 text-center hidden md:table-cell"><span :class="m.tiene_discapacidad ? 'text-amber-600 font-bold' : 'text-slate-300'">{{ m.tiene_discapacidad ? '✓' : '–' }}</span></td>
                  <td class="px-4 py-3 text-center hidden md:table-cell"><span :class="m.enfermedad_cronica ? 'text-orange-600 font-bold' : 'text-slate-300'">{{ m.enfermedad_cronica ? '✓' : '–' }}</span></td>
                  <td class="px-4 py-3 text-center"><span :class="['px-2 py-0.5 rounded-full text-xs font-medium', m.vulnerable ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">{{ m.vulnerable ? 'Sí' : 'No' }}</span></td>
                  <td v-if="authStore.canManageFamilias" class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="abrirModalMiembro(m)" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                      <button @click="eliminarMiembro(m)" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="miembrosFiltrados.length === 0 && !loadingMiembros">
                  <td :colspan="authStore.canManageFamilias ? 10 : 9" class="px-4 py-12 text-center text-slate-400 text-sm">
                    Esta familia no tiene miembros registrados aún
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
    <div v-if="modalVisible" class="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl my-6">
        <div class="p-5 border-b border-slate-100"><h2 class="font-bold text-slate-800">{{ editando ? 'Editar Familia' : 'Registrar Familia' }}</h2></div>
        <div class="p-5 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Cédula *</label><input v-model="form.cedula" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label><input v-model="form.telefono" type="tel" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
          </div>
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Representante *</label><input v-model="form.representante" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Dirección *</label><input v-model="form.direccion" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Ubicación actual</label><input v-model="form.ubicacion_actual" type="text" placeholder="Ej: Refugio Norte" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Cant. miembros</label><input v-model.number="form.cantidad_miembros" type="number" min="1" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
              <input :value="editando ? form.prioridad : 'Calculada automáticamente'" type="text" disabled class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none"/>
            </div>
          </div>
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Refugio asignado</label>
            <select v-model.number="form.id_refugio" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400">
              <option :value="0">Sin asignar</option>
              <option v-for="r in refugios" :key="r.id" :value="r.id">{{ r.nombre }}</option>
            </select>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <input id="habeas" v-model="form.aceptacion_habeas_data" type="checkbox" class="w-4 h-4 text-emerald-600 rounded"/>
            <label for="habeas" class="text-sm text-slate-700">Acepta Habeas Data *</label>
          </div>
          <div v-if="modalError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ modalError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 flex gap-3">
          <button @click="cerrarModal" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="guardar" :disabled="saving" class="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Miembro -->
    <div v-if="modalMiembroVisible" class="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl my-6">
        <div class="p-5 border-b border-slate-100">
          <h2 class="font-bold text-slate-800">{{ editandoMiembro ? 'Editar Miembro' : 'Agregar Miembro' }}</h2>
          <p class="text-xs text-slate-400 mt-0.5">Familia: {{ familiaParaMiembro?.representante }}</p>
        </div>
        <div class="p-5 space-y-4">
          <div><label class="block text-sm font-medium text-slate-700 mb-1">Nombre completo *</label><input v-model="formMiembro.nombre" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
          <div class="grid grid-cols-3 gap-3">
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Tipo doc.</label>
              <select v-model="formMiembro.tipo_documento" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"><option>CC</option><option>TI</option><option>CE</option><option>RC</option></select>
            </div>
            <div class="col-span-2"><label class="block text-sm font-medium text-slate-700 mb-1">Número doc. *</label><input v-model="formMiembro.numero_documento" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Edad</label><input v-model.number="formMiembro.edad" type="number" min="0" max="120" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/></div>
            <div><label class="block text-sm font-medium text-slate-700 mb-1">Parentesco</label>
              <select v-model="formMiembro.parentezco" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"><option>Cabeza de hogar</option><option>Cónyuge</option><option>Hijo</option><option>Padre/Madre</option><option>Abuelo/a</option><option>Otro</option></select>
            </div>
          </div>
          <div class="space-y-2 p-3 bg-slate-50 rounded-lg">
            <p class="text-sm font-medium text-slate-700 mb-2">Condiciones de vulnerabilidad</p>
            <label class="flex items-center gap-3 cursor-pointer"><input v-model="formMiembro.es_embarazada" type="checkbox" class="w-4 h-4 text-pink-600 rounded"/><span class="text-sm text-slate-700">Está embarazada</span></label>
            <label class="flex items-center gap-3 cursor-pointer"><input v-model="formMiembro.tiene_discapacidad" type="checkbox" class="w-4 h-4 text-amber-600 rounded"/><span class="text-sm text-slate-700">Tiene discapacidad</span></label>
            <label class="flex items-center gap-3 cursor-pointer"><input v-model="formMiembro.enfermedad_cronica" type="checkbox" class="w-4 h-4 text-orange-600 rounded"/><span class="text-sm text-slate-700">Enfermedad crónica</span></label>
            <label class="flex items-center gap-3 cursor-pointer"><input v-model="formMiembro.vulnerable" type="checkbox" class="w-4 h-4 text-red-600 rounded"/><span class="text-sm text-slate-700">Vulnerable genérico</span></label>
            <div v-if="formMiembro.vulnerable">
              <input v-model="formMiembro.tipo_vulnerabilidad" type="text" placeholder="Tipo de vulnerabilidad..." class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-400"/>
            </div>
          </div>
          <div v-if="modalMiembroError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ modalMiembroError }}</div>
        </div>
        <div class="p-5 border-t border-slate-100 flex gap-3">
          <button @click="cerrarModalMiembro" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="guardarMiembro" :disabled="savingM" class="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors">{{ savingM ? 'Guardando...' : 'Guardar' }}</button>
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
