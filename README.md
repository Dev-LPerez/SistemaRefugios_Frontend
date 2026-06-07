# 🏠 Sistema de Gestión de Refugios — Frontend

> **Vue 3 + Vite + TypeScript + Tailwind CSS**
> Plataforma web para la gestión humanitaria de refugios de emergencia: familias damnificadas, recursos, entregas, donaciones, reportes y auditoría.

---

## 📑 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Instalación y Ejecución](#-instalación-y-ejecución)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Arquitectura de la Aplicación](#-arquitectura-de-la-aplicación)
7. [Módulos / Vistas](#-módulos--vistas)
8. [Componentes Reutilizables](#-componentes-reutilizables)
9. [Servicios y API](#-servicios-y-api)
10. [Tipos TypeScript](#-tipos-typescript)
11. [Estado Global (Pinia)](#-estado-global-pinia)
12. [Router y Guardias de Navegación](#-router-y-guardias-de-navegación)
13. [Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
14. [Exportación PDF](#-exportación-pdf)
15. [Zona Horaria](#-zona-horaria)
16. [Scripts de Desarrollo](#-scripts-de-desarrollo)
17. [Convenciones de Código](#-convenciones-de-código)

---

## 🌐 Descripción General

El frontend es una **Single Page Application (SPA)** que se comunica con la API REST del Backend PHP.
Permite a los operadores humanitarios:

- Registrar y priorizar familias damnificadas y sus miembros.
- Gestionar el inventario de recursos (alimentos, agua, medicamentos, etc.).
- Crear entregas y actualizar su estado en tiempo real.
- Registrar donantes y donaciones vinculadas al inventario.
- Consultar un dashboard estadístico en tiempo real.
- Generar reportes de trazabilidad logística en PDF.
- Auditar toda acción realizada en el sistema.

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework UI | Vue 3 (Composition API) | ^3.5 |
| Build tool | Vite | ^6.x |
| Tipado | TypeScript | ^5.x |
| Estilos | Tailwind CSS | ^3.x |
| Estado global | Pinia | ^2.x |
| Enrutamiento | Vue Router 4 | ^4.x |
| HTTP Client | Axios | ^1.x |
| Fuente tipográfica | Inter (Google Fonts) | — |

---

## 📁 Estructura del Proyecto

```
Frontend SistemaRefugio/
├── public/                    # Archivos estáticos públicos
├── src/
│   ├── assets/
│   │   └── main.css           # Estilos globales + importaciones Tailwind
│   ├── components/            # Componentes reutilizables de UI
│   │   ├── AppLayout.vue      # Layout principal (sidebar + header + slot)
│   │   ├── TheSidebar.vue     # Menú lateral colapsable con roles
│   │   ├── TheNavbar.vue      # Barra superior de navegación
│   │   ├── StatCard.vue       # Tarjeta de estadística del dashboard
│   │   ├── PaginationBar.vue  # Barra de paginación reutilizable
│   │   ├── SkeletonTable.vue  # Skeleton loader para tablas
│   │   └── TheWelcome.vue     # Pantalla de bienvenida (landing)
│   ├── router/
│   │   └── index.ts           # Rutas y guardias de navegación
│   ├── services/
│   │   ├── axios.ts           # Configuración de Axios + interceptores
│   │   ├── api.ts             # Barrel de re-exportación (compatibilidad)
│   │   ├── helpers.ts         # Wrappers HTTP genéricos (get/post/put/del)
│   │   └── modules/           # Módulos de servicio por entidad
│   │       ├── index.ts       # Barrel export de todos los módulos
│   │       ├── auth.ts
│   │       ├── usuarios.ts
│   │       ├── dashboard.ts
│   │       ├── refugios.ts
│   │       ├── familias.ts
│   │       ├── miembros.ts
│   │       ├── recursos.ts
│   │       ├── donantes.ts
│   │       ├── donaciones.ts
│   │       ├── entregas.ts
│   │       ├── gestiones.ts
│   │       ├── priorizacion.ts
│   │       ├── reportes.ts
│   │       └── auditoria.ts
│   ├── stores/
│   │   └── auth.ts            # Store de autenticación (Pinia)
│   ├── types/
│   │   └── index.ts           # Interfaces TypeScript centralizadas
│   ├── views/                 # Páginas de la aplicación
│   │   ├── HomeView.vue       # Landing page pública
│   │   ├── LoginView.vue      # Pantalla de inicio de sesión
│   │   ├── DashboardView.vue  # Panel estadístico principal
│   │   ├── RefugiosView.vue   # CRUD de refugios
│   │   ├── FamiliasView.vue   # CRUD de familias + miembros
│   │   ├── RecursosView.vue   # Inventario de recursos
│   │   ├── DonacionesView.vue # Donantes y donaciones
│   │   ├── EntregasView.vue   # Gestión de entregas
│   │   ├── PriorizacionView.vue # Motor de priorización
│   │   ├── ReportesView.vue   # Trazabilidad + exportación PDF
│   │   ├── AuditoriaView.vue  # Log de auditoría del sistema
│   │   └── AboutView.vue      # Créditos / acerca de
│   ├── App.vue                # Raíz de la aplicación
│   ├── main.ts                # Punto de entrada; inicialización
│   └── vite-env.d.ts          # Tipos de entorno Vite
├── .env                       # Variables de entorno (local, no en git)
├── index.html                 # HTML raíz de Vite
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Ingresar al directorio del frontend
cd "Frontend SistemaRefugio"

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
# (ver sección siguiente)

# 4. Iniciar el servidor de desarrollo
npm run dev
```

El servidor de desarrollo quedará disponible en **http://localhost:5173**.

---

## 🔑 Variables de Entorno

Crear un archivo `.env` en la raíz del frontend:

```env
# URL base del backend PHP (sin barra al final)
VITE_API_URL=http://localhost/Backend_Refugios
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API REST | `https://sistemarefugios-backend.onrender.com` |

> El archivo `.env` NO se versiona. Nunca incluya credenciales en el repositorio.

---

## 🏗 Arquitectura de la Aplicación

```
Vistas (Views)
    |  importan
Capa de Servicios (services/modules/*.ts)
    |  HTTP via Axios
Backend PHP REST API (XAMPP / Render)
    |  PDO
MySQL / MariaDB
```

**Estado global:** Pinia (auth.ts)
**Navegación:** Vue Router 4 + guardias de roles
**Tipos:** types/index.ts (interfaces TypeScript centralizadas)

### Patrón de comunicación con la API

El backend recibe todas las peticiones en el mismo endpoint (`index.php`) distinguiéndolas por el parámetro `route`:

```
GET    ?route=familias
POST   ?route=entregas           body: { ...payload }
PUT    ?route=entregas&id=5      body: { estado: "entregado" }
DELETE ?route=donaciones&id=3&motivo=duplicado
```

Los helpers en `services/helpers.ts` abstraen este patrón:

```typescript
get("familias")
post("entregas", payload)
put("entregas", id, { estado })
del("donaciones", id, motivo)
```

---

## 📄 Módulos / Vistas

### LoginView
- Formulario de autenticación con usuario y contraseña.
- Consume `apiLogin` → llama al store Pinia `useAuthStore`.
- Redirige automáticamente al Dashboard si ya hay sesión activa.
- Muestra errores de credenciales inválidas o fallo de red.

### DashboardView
- KPIs en tiempo real: familias registradas, personas damnificadas, entregas completadas, unidades en almacén.
- Tarjetas de alerta de stock crítico (recursos con cantidad_disponible menor o igual a 10).
- Usa el componente `StatCard` para cada métrica.
- Consume `apiGetDashboard`.

### RefugiosView
- Tabla paginada de refugios con búsqueda.
- CRUD completo: crear, editar, eliminar refugio.
- Campos: nombre, dirección, capacidad máxima, ocupación actual, estado (activo/inactivo).
- Acceso: Admin, Logistica, Operario.

### FamiliasView
- Tabla de familias con búsqueda y paginación.
- CRUD de familia (representante, cédula, teléfono, dirección, refugio asignado, habeas data).
- Sub-módulo de Miembros: modal para agregar/editar miembros de cada familia con campos de vulnerabilidad (embarazo, discapacidad, enfermedad crónica).
- Acceso: Admin, Operario, Voluntario.

### RecursosView
- Vista de inventario en tarjetas (cards) con diseño Indigo/Slate.
- Muestra: nombre, tipo, unidad, cantidad disponible.
- Indicador visual de stock crítico (menor o igual a 10 unidades → badge rojo).
- CRUD: crear, editar y eliminar recursos.
- Búsqueda en tiempo real por nombre o tipo.
- Acceso: Admin, Logistica.

### DonacionesView
- Gestión de Donantes (identificación, nombre, tipo, teléfono).
- Gestión de Donaciones: cada donación referencia un donante, tiene origen, categoría y fecha.
- Sub-módulo de Detalles de Donación: recursos específicos aportados en cada donación.
- Acceso: Admin, Logistica, Operario.

### EntregasView
- Tabla de entregas con estado, familia beneficiada y detalles de recursos entregados.
- Crear entrega: seleccionar familia, agregar recursos con cantidades.
- Actualizar estado: pendiente / entregado / cancelado — persiste en base de datos.
- Eliminar entrega con motivo (auditado).
- Acceso: Admin, Logistica, Operario, Voluntario.

### PriorizacionView
- Motor de priorización que calcula el puntaje de vulnerabilidad de cada familia.
- Ordena familias por puntaje descendente.
- Muestra raciones necesarias estimadas (agua en litros, alimentos en kg) por días de cobertura.
- Acceso: Admin, Logistica, Operario.

### ReportesView
- Tabla de trazabilidad logística: cada entrega con su recurso, cantidad, familia receptora, ubicación y posibles orígenes de la donación.
- Filtros por fecha (desde/hasta) y por recurso.
- Exportación a PDF: genera un documento profesional con cabecera institucional, tabla de datos y bloques de firmas al imprimir.
- El layout de impresión oculta toda la interfaz web y muestra sólo el documento.
- Acceso: Admin, Auditor, Logistica, Operario.

### AuditoriaView
- Log de todas las acciones del sistema (creación, edición, eliminación).
- Campos: usuario, rol, acción, módulo, detalle, IP, fecha/hora.
- Paginación y búsqueda.
- Solo lectura — sin capacidad de edición.
- Acceso: Admin, Auditor.

---

## 🧩 Componentes Reutilizables

### AppLayout.vue
Layout general que envuelve todas las vistas protegidas. Incluye:
- TheSidebar colapsable con print:hidden para ocultar en impresión.
- Header superior con selector de Refugio Operativo (dropdown dinámico), indicador de stock crítico animado y badge de estado ONLINE.
- Slot principal para el contenido de cada vista.

Props:
- `title` (string, default: "Refugios"): título mostrado en móvil.

### TheSidebar.vue
Menú lateral con:
- Logo/marca del sistema.
- Panel de usuario (avatar inicial, nombre, rol, indicador online).
- Ítems de menú por módulo con ícono SVG y badge de sección.
- Colapso a modo icono (w-16) en desktop; overlay en móvil.
- Navegación adaptada al rol: sólo muestra los módulos permitidos.
- Botón de cerrar sesión al final.

### StatCard.vue
Tarjeta de KPI para el dashboard.

Props:
- `title` (string): etiqueta de la métrica.
- `value` (number): valor principal.
- `total` (number, opcional): denominador ("de N total").
- `icon` ('home' | 'users' | 'truck' | 'alert'): ícono SVG.
- `color` ('blue' | 'green' | 'amber' | 'red'): paleta de color.

### PaginationBar.vue
Barra de paginación reutilizable.

Props: `page`, `perPage`, `total`.
Emits: `update:page`, `update:perPage`.
Opciones de registros por página: 10, 20, 50, 100.

### SkeletonTable.vue
Loader de esqueleto animado para tablas mientras se cargan los datos.

---

## ⚙️ Servicios y API

### services/axios.ts
Configura dos instancias de Axios:

| Cliente | Uso | Token |
|---------|-----|-------|
| `apiClient` | Endpoints protegidos | Bearer JWT automático |
| `publicClient` | Login / endpoints públicos | Sin interceptor |

Interceptores de apiClient:
- Request: Agrega Authorization Bearer desde localStorage.
- Response: Si recibe 401, borra sesión y redirige a /login.

### services/helpers.ts
Wrappers genéricos sobre apiClient:

```typescript
get<T>(route, params?)         // GET  ?route=X
post<T>(route, data, params?)  // POST ?route=X  body=data
put<T>(route, id, data)        // PUT  ?route=X&id=N  body=data
del<T>(route, id, motivo?)     // DELETE ?route=X&id=N[&motivo=Y]
```

Todos normalizan la respuesta mediante `normalize<T>()`.

### services/modules/
Un archivo por entidad. Cada módulo exporta funciones `apiXxx` tipadas:

| Módulo | Funciones exportadas |
|--------|---------------------|
| auth.ts | apiLogin, apiLogout |
| usuarios.ts | apiGetUsuarios, apiCreateUsuario, apiUpdateUsuario, apiDeleteUsuario |
| dashboard.ts | apiGetDashboard |
| refugios.ts | apiGetRefugios, apiCreateRefugio, apiUpdateRefugio, apiDeleteRefugio |
| familias.ts | apiGetFamilias, apiCreateFamilia, apiUpdateFamilia, apiDeleteFamilia |
| miembros.ts | apiGetMiembros, apiGetTodosMiembros, apiCreateMiembro, apiUpdateMiembro, apiDeleteMiembro |
| recursos.ts | apiGetRecursos, apiCreateRecurso, apiUpdateRecurso, apiDeleteRecurso |
| donantes.ts | apiGetDonantes, apiCreateDonante, apiUpdateDonante, apiDeleteDonante |
| donaciones.ts | apiGetDonaciones, apiCreateDonacion, apiUpdateDonacion, apiDeleteDonacion, apiAgregarDetalleDonacion |
| entregas.ts | apiGetEntregas, apiCreateEntrega, apiUpdateEntregaEstado, apiDeleteEntrega |
| gestiones.ts | apiGetGestiones, apiCreateGestion |
| priorizacion.ts | apiGetPriorizacion, apiGetPriorizacionFamilia, apiGetFamiliasPriorizadas |
| reportes.ts | apiGetTrazabilidad |
| auditoria.ts | apiGetAuditoria |

---

## 📐 Tipos TypeScript

Todas las interfaces en `src/types/index.ts`:

| Interface | Descripción |
|-----------|-------------|
| Usuario | id, nombre, user, rol |
| Refugio | id, nombre, dirección, capacidad, ocupación, estado |
| Familia | id, cédula, representante, miembros, prioridad, refugio, habeas_data |
| MiembroFamilia | id, familia_id, nombre, edad, documento, vulnerabilidad |
| Recurso | id, nombre, tipo, unidad, cantidad_disponible |
| Donante | id, identificación, nombre, tipo, teléfono |
| Donacion | id, fecha, descripción, donante, origen, categoría |
| DetalleDonacion | id_donacion, id_recurso, cantidad |
| Entrega | id, estado, fecha, familia, detalles[] |
| EntregaDetalle | id_detalle, id_recurso, recurso_nombre, unidad, cantidad |
| EntregaPayload | estado, fecha, id_familia, recursos[] |
| Gestion | id, id_usuario, id_recurso, accion |
| DashboardStats | totales, alertas de stock |
| TrazabilidadItem | entrega, recurso, familia, ubicación, posibles_orígenes |
| PriorizacionItem | familia, puntaje, raciones_necesarias |
| AuditoriaLog | usuario, rol, acción, módulo, detalle, IP, fecha |
| ApiResponse<T> | success, message?, data? |

---

## 🗃 Estado Global (Pinia)

### stores/auth.ts — useAuthStore

Estado reactivo: user, token, loading, error.

Getters computados:
- `isAuthenticated`: true si hay usuario autenticado.
- `userRol`: rol actual del usuario.
- `canManageFamilias`: Admin, Operario, Voluntario.
- `canManageRecursos`: Admin, Logistica.
- `canManageEntregas`: Admin, Logistica, Operario, Voluntario.
- `canViewAuditoria`: Admin, Auditor.
- `canViewReportes`: Admin, Auditor, Logistica, Operario.
- `canManageRefugios`: Admin, Logistica, Operario.

Acciones:
- `login(user, password)`: llama apiLogin, guarda sesión en localStorage.
- `logout()`: llama apiLogout, limpia estado y localStorage.
- `initAuth()`: restaura sesión desde localStorage al recargar (llamado en main.ts).

---

## 🧭 Router y Guardias de Navegación

### Rutas

| Path | Vista | Auth | Roles permitidos |
|------|-------|------|-----------------|
| / | HomeView | No | — |
| /login | LoginView | No | — |
| /dashboard | DashboardView | Sí | Todos |
| /refugios | RefugiosView | Sí | Admin, Logistica, Operario |
| /familias | FamiliasView | Sí | Admin, Operario, Voluntario |
| /recursos | RecursosView | Sí | Admin, Logistica |
| /donaciones | DonacionesView | Sí | Admin, Logistica, Operario |
| /entregas | EntregasView | Sí | Admin, Logistica, Operario, Voluntario |
| /priorizacion | PriorizacionView | Sí | Admin, Logistica, Operario |
| /reportes | ReportesView | Sí | Admin, Auditor, Logistica, Operario |
| /auditoria | AuditoriaView | Sí | Admin, Auditor |

### Lógica del guardia beforeEach
1. Si la ruta requiere auth y el usuario no está autenticado → redirige a /login.
2. Si el usuario ya está autenticado e intenta acceder a /login → redirige a /dashboard.
3. Si la ruta tiene restricción de roles y el usuario no tiene el rol adecuado → redirige a /dashboard.

---

## 🔒 Sistema de Roles y Permisos

| Rol | Dashboard | Refugios | Familias | Recursos | Donaciones | Entregas | Priorización | Reportes | Auditoría |
|-----|:---------:|:--------:|:--------:|:--------:|:----------:|:--------:|:------------:|:--------:|:---------:|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Logistica | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Operario | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | — |
| Voluntario | ✅ | — | ✅ | — | — | ✅ | — | — | — |
| Auditor | ✅ | — | — | — | — | — | — | ✅ | ✅ |

---

## 🖨 Exportación PDF

El módulo de Reportes genera un PDF profesional usando la impresión nativa del navegador (`window.print()`):

### Estrategia
- Toda la interfaz web tiene `print:hidden` → invisible al imprimir.
- El div `#print-area` sólo es visible al imprimir (`hidden print:block`).

### Contenido del documento impreso
- Cabecera institucional (nombre del sistema, fecha y hora de generación en zona horaria Colombia).
- Tabla de trazabilidad con columnas: Entrega, Fecha, Recurso, Cantidad, Familia Receptora, Ubicación, Posibles Orígenes.
- Pie de página con bloques de firma: Elaborado por / Revisado por / Aprobado por.
- Formato A4 horizontal para mejor aprovechamiento del ancho.

### Uso
1. Aplicar filtros de fecha y recurso en la pantalla.
2. Hacer clic en "Exportar PDF".
3. Se abre el diálogo nativo de impresión → guardar como PDF.

---

## 🕐 Zona Horaria

El sistema opera en la zona horaria de **Colombia (America/Bogota — UTC-5)**.

La corrección se aplica en el backend en dos capas:
- `index.php`: `date_default_timezone_set("America/Bogota")` — funciones PHP de fecha.
- `src/config/database.php`: `SET time_zone = "-05:00"` — funciones MySQL (NOW, CURRENT_TIMESTAMP).

El frontend no manipula zonas horarias directamente; confía en las fechas recibidas del backend ya normalizadas.

---

## 📜 Scripts de Desarrollo

```bash
npm run dev        # Servidor de desarrollo con HMR (http://localhost:5173)
npm run build      # Build de producción (output: dist/)
npm run preview    # Vista previa del build de producción
npm run type-check # Verificación de tipos TypeScript
npm run lint       # Linting con ESLint
```

---

## 📝 Convenciones de Código

### Nombres
- Componentes: PascalCase (TheSidebar.vue, StatCard.vue).
- Vistas: PascalCase con sufijo View (DashboardView.vue).
- Funciones API: camelCase con prefijo api (apiGetFamilias).
- Stores: camelCase con prefijo use y sufijo Store (useAuthStore).
- Interfaces TypeScript: PascalCase (Familia, AuditoriaLog).

### Estructura de un componente Vue

```vue
<template>
  <!-- HTML semántico -->
</template>

<script setup lang="ts">
// Imports
// Props / Emits
// Estado reactivo
// Computed
// Funciones
// onMounted
</script>
```

### Manejo de errores

```typescript
const res = await apiGetXxx()
if (res.success && res.data) {
  // usar res.data
} else {
  // mostrar res.message
}
```

### Estilos
- Tailwind CSS con clases utilitarias.
- Paleta del tema: Indigo/Slate (indigo-600, slate-800, slate-50).
- Clases `print:hidden` / `print:block` para controlar la impresión.
- Animaciones con `animate-pulse` para indicadores críticos.

---

*Documentación del proyecto académico Sistema de Gestión de Refugios — 2026.*
