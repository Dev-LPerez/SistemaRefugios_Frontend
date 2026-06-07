# 📡 Documentación de Servicios y Tipos — Frontend SistemaRefugio

> Referencia técnica detallada de la capa de servicios, tipos TypeScript y contratos con la API del backend.

---

## 📑 Tabla de Contenidos

1. [Flujo de una Petición HTTP](#-flujo-de-una-petición-http)
2. [Referencia de Helpers HTTP](#-referencia-de-helpers-http)
3. [Módulos de Servicio — Referencia Completa](#-módulos-de-servicio--referencia-completa)
4. [Contratos de la API (Rutas del Backend)](#-contratos-de-la-api-rutas-del-backend)
5. [Tipos TypeScript — Referencia Completa](#-tipos-typescript--referencia-completa)
6. [Normalización de Respuestas](#-normalización-de-respuestas)
7. [Manejo de Errores](#-manejo-de-errores)

---

## 🔄 Flujo de una Petición HTTP

```
Vista (Vue)
  └─ apiGetFamilias()          ← services/modules/familias.ts
       └─ get("familias")      ← services/helpers.ts
            └─ apiClient.get("", { params: { route: "familias" } })
                               ← services/axios.ts (interceptor agrega JWT)
                 └─ Backend PHP: GET index.php?route=familias
                      └─ Respuesta JSON: { status: 200, data: [...] }
            └─ normalize<Familia[]>(res)
       └─ ApiResponse<Familia[]>
  └─ res.data → familias.value
```

---

## 🔧 Referencia de Helpers HTTP

Archivo: `src/services/helpers.ts`

### `get<T>(route, params?)`
```typescript
get<Familia[]>("familias")
// GET ?route=familias

get<Familia[]>("familias", { id_refugio: 3 })
// GET ?route=familias&id_refugio=3
```

### `post<T>(route, data, params?)`
```typescript
post<void>("familias", {
  cedula: "123456",
  representante: "Juan Pérez",
  id_refugio: 1
})
// POST ?route=familias   body: { cedula, representante, id_refugio }
```

### `put<T>(route, id, data)`
```typescript
put<void>("entregas", 5, { estado: "entregado" })
// PUT ?route=entregas&id=5   body: { estado: "entregado" }
```

### `del<T>(route, id, motivo?)`
```typescript
del<void>("donaciones", 3, "Registro duplicado")
// DELETE ?route=donaciones&id=3&motivo=Registro%20duplicado

del<void>("recursos", 7)
// DELETE ?route=recursos&id=7
```

---

## 📦 Módulos de Servicio — Referencia Completa

---

### `modules/auth.ts`

#### `apiLogin(user, password)`
- **Descripción:** Inicia sesión con credenciales.
- **Usa:** `publicClient` (sin token — endpoint público).
- **Retorna:** `ApiResponse<{ usuario: Usuario; token: string }>`
- **Ejemplo:**
```typescript
const res = await apiLogin("admin", "1234")
if (res.success) {
  console.log(res.data.usuario.rol) // "Admin"
}
```

#### `apiLogout()`
- **Descripción:** Cierra la sesión en el backend.
- **Retorna:** `ApiResponse<null>`

---

### `modules/usuarios.ts`

| Función | Descripción | Body / Params |
|---------|-------------|---------------|
| `apiGetUsuarios()` | Lista todos los usuarios | — |
| `apiCreateUsuario(data)` | Crea un nuevo usuario | nombre, user, password, rol |
| `apiUpdateUsuario(id, data)` | Actualiza un usuario | nombre, user, rol |
| `apiDeleteUsuario(id)` | Elimina un usuario | — |

---

### `modules/dashboard.ts`

#### `apiGetDashboard()`
- **Retorna:** `ApiResponse<DashboardStats>`
- **Datos incluidos:**
  - `total_familias_registradas`
  - `total_personas_damnificadas`
  - `total_entregas_completadas`
  - `total_unidades_kg_almacen`
  - `recursos_alertas_stock[]` (recursos con cantidad_disponible <= 10)

---

### `modules/refugios.ts`

| Función | Descripción | Body |
|---------|-------------|------|
| `apiGetRefugios()` | Lista todos los refugios | — |
| `apiCreateRefugio(data)` | Crea un refugio | nombre, dirección, capacidad_maxima, ocupacion_actual, estado |
| `apiUpdateRefugio(id, data)` | Actualiza un refugio | campos a actualizar |
| `apiDeleteRefugio(id)` | Elimina un refugio | — |

---

### `modules/familias.ts`

| Función | Descripción | Body |
|---------|-------------|------|
| `apiGetFamilias()` | Lista todas las familias | — |
| `apiCreateFamilia(data)` | Crea una familia | cedula, representante, telefono, direccion, cantidad_miembros, prioridad, id_refugio, ubicacion_actual, aceptacion_habeas_data |
| `apiUpdateFamilia(id, data)` | Actualiza una familia | campos a actualizar |
| `apiDeleteFamilia(id)` | Elimina una familia | — |

---

### `modules/miembros.ts`

| Función | Descripción |
|---------|-------------|
| `apiGetMiembros(familiaId)` | Obtiene miembros de una familia específica |
| `apiGetTodosMiembros()` | Obtiene todos los miembros del sistema |
| `apiCreateMiembro(data)` | Crea un miembro de familia |
| `apiUpdateMiembro(id, data)` | Actualiza un miembro |
| `apiDeleteMiembro(id)` | Elimina un miembro |

**Campos de MiembroFamilia:**
- `familia_id`, `nombre`, `edad`, `tipo_documento`, `numero_documento`, `parentezco`
- `es_embarazada` (boolean), `tiene_discapacidad` (boolean), `enfermedad_cronica` (boolean)
- `vulnerable` (boolean), `tipo_vulnerabilidad`

---

### `modules/recursos.ts`

| Función | Descripción | Body |
|---------|-------------|------|
| `apiGetRecursos()` | Lista todos los recursos | — |
| `apiCreateRecurso(data)` | Crea un recurso | nombre, tipo, unidad, cantidad_disponible |
| `apiUpdateRecurso(id, data)` | Actualiza un recurso | campos a actualizar |
| `apiDeleteRecurso(id)` | Elimina un recurso | — |

**Tipos de recurso comunes:** Alimento, Agua, Medicamento, Higiene, Ropa, Herramienta.

---

### `modules/donantes.ts`

| Función | Descripción | Body |
|---------|-------------|------|
| `apiGetDonantes()` | Lista todos los donantes | — |
| `apiCreateDonante(data)` | Crea un donante | identificacion, nombre, tipo, telefono |
| `apiUpdateDonante(id, data)` | Actualiza un donante | campos a actualizar |
| `apiDeleteDonante(id)` | Elimina un donante | — |

---

### `modules/donaciones.ts`

| Función | Descripción | Body |
|---------|-------------|------|
| `apiGetDonaciones()` | Lista todas las donaciones | — |
| `apiCreateDonacion(data)` | Crea una donación | fecha, descripcion, id_donante, origen, categoria |
| `apiUpdateDonacion(id, data)` | Actualiza una donación | campos a actualizar |
| `apiDeleteDonacion(id)` | Elimina una donación | — |
| `apiAgregarDetalleDonacion(data)` | Agrega un recurso a una donación | id_donacion, id_recurso, cantidad |

---

### `modules/entregas.ts`

#### `apiGetEntregas()`
- Retorna todas las entregas con sus detalles (recursos entregados).
- El mapeo interno convierte `familia_representante` → `familia` para compatibilidad con la vista.

#### `apiCreateEntrega(data: EntregaPayload)`
```typescript
{
  estado: "pendiente",
  fecha: "2026-06-07",
  id_familia: 3,
  recursos: [
    { id_recurso: 1, cantidad: 5 },
    { id_recurso: 4, cantidad: 10 }
  ]
}
```

#### `apiUpdateEntregaEstado(id, estado)`
- Estado debe ser exactamente: `"pendiente"` | `"entregado"` | `"cancelado"` (minúsculas).
- Valores en minúsculas requeridos por el ENUM del backend MySQL.

#### `apiDeleteEntrega(id, motivo?)`
- El motivo se registra en el log de auditoría del backend.

---

### `modules/priorizacion.ts`

| Función | Descripción |
|---------|-------------|
| `apiGetPriorizacion()` | Priorización general de todas las familias |
| `apiGetPriorizacionFamilia(id)` | Priorización de una familia específica |
| `apiGetFamiliasPriorizadas()` | Lista ordenada por puntaje descendente |

**PriorizacionItem retornado:**
```typescript
{
  id_familia: number,
  representante: string,
  ubicacion: string,
  miembros: number,
  puntaje_prioridad: number,
  raciones_necesarias: {
    dias_cobertura: number,
    agua_litros: number,
    alimentos_kilos: number
  }
}
```

---

### `modules/reportes.ts`

#### `apiGetTrazabilidad(params?)`
- Acepta parámetros opcionales de filtrado: `fecha_desde`, `fecha_hasta`, `id_recurso`.
- **TrazabilidadItem retornado:**
```typescript
{
  id_entrega: number,
  fecha_entrega: string,       // Formato: YYYY-MM-DD HH:MM:SS (UTC-5 Colombia)
  recurso: string,
  cantidad_entregada: number,
  familia_receptora: string,
  ubicacion_receptora: string,
  posibles_origenes: string    // Donantes que pudieron originar ese recurso
}
```

---

### `modules/auditoria.ts`

#### `apiGetAuditoria()`
- **AuditoriaLog retornado:**
```typescript
{
  id: number,
  usuario: string,
  rol: string,
  accion: string,     // "CREATE" | "UPDATE" | "DELETE"
  modulo: string,     // "familias" | "entregas" | "recursos" | ...
  detalle: string,    // Descripción libre del cambio
  ip: string,         // IP del cliente
  fecha: string       // Timestamp Colombia (UTC-5)
}
```

---

## 🔌 Contratos de la API (Rutas del Backend)

Todas las peticiones van a `index.php` con el parámetro `?route=`:

| route | GET | POST | PUT | DELETE |
|-------|-----|------|-----|--------|
| `login` | — | Login/logout | — | — |
| `usuarios` | Listar | Crear | Actualizar (?id) | Eliminar (?id) |
| `dashboard` | Stats | — | — | — |
| `refugios` | Listar | Crear | Actualizar (?id) | Eliminar (?id) |
| `familias` | Listar | Crear | Actualizar (?id) | Eliminar (?id) |
| `miembros` | Listar (?familia_id) | Crear | Actualizar (?id) | Eliminar (?id) |
| `recursos` | Listar | Crear | Actualizar (?id) | Eliminar (?id) |
| `donantes` | Listar | Crear | Actualizar (?id) | Eliminar (?id) |
| `donaciones` | Listar | Crear | Actualizar (?id) | Eliminar (?id) |
| `donaciones_detalle` | — | Agregar detalle | — | — |
| `entregas` | Listar | Crear | Estado (?id) | Eliminar (?id&motivo) |
| `priorizacion` | General / ?id | — | — | — |
| `trazabilidad` | Filtros opcionales | — | — | — |
| `auditoria` | Listar | — | — | — |

### Formato de Respuesta del Backend PHP

```json
{
  "status": 200,
  "message": "Operación exitosa",
  "data": [ ... ]
}
```

En caso de error:
```json
{
  "status": 400,
  "error": "Descripción del error"
}
```

---

## 📐 Tipos TypeScript — Referencia Completa

Archivo: `src/types/index.ts`

### Usuario
```typescript
interface Usuario {
  id: number
  nombre: string
  user: string
  rol: string  // "Admin" | "Logistica" | "Operario" | "Voluntario" | "Auditor"
}
```

### Refugio
```typescript
interface Refugio {
  id: number
  nombre: string
  direccion: string
  capacidad_maxima: number
  ocupacion_actual: number
  estado: "activo" | "inactivo"
}
```

### Familia
```typescript
interface Familia {
  id: number
  cedula: string
  representante: string
  telefono: string
  direccion: string
  cantidad_miembros: number
  prioridad: number
  id_refugio: number
  ubicacion_actual: string
  aceptacion_habeas_data: boolean
}
```

### MiembroFamilia
```typescript
interface MiembroFamilia {
  id: number
  familia_id: number
  nombre: string
  edad?: number
  tipo_documento: string
  numero_documento: string
  parentezco: string
  es_embarazada: boolean
  tiene_discapacidad: boolean
  enfermedad_cronica: boolean
  vulnerable: boolean
  tipo_vulnerabilidad: string
}
```

### Recurso
```typescript
interface Recurso {
  id: number
  nombre: string
  tipo: string
  unidad: string
  cantidad_disponible: number
}
```

### Donante
```typescript
interface Donante {
  id: number
  identificacion: string
  nombre: string
  tipo: string
  telefono: string
}
```

### Donacion / DetalleDonacion
```typescript
interface Donacion {
  id: number
  fecha: string
  descripcion: string
  id_donante: number
  origen: string
  categoria: string
  donante?: string  // nombre del donante (JOIN)
}

interface DetalleDonacion {
  id_donacion: number
  id_recurso: number
  cantidad: number
}
```

### Entrega / EntregaDetalle / EntregaPayload
```typescript
interface EntregaDetalle {
  id_detalle: number
  id_recurso: number
  recurso_nombre: string
  unidad: string
  cantidad: number
}

interface Entrega {
  id: number
  estado: string  // "pendiente" | "entregado" | "cancelado"
  fecha: string
  id_familia: number
  familia?: string  // nombre del representante (JOIN)
  detalles: EntregaDetalle[]
}

interface EntregaPayload {
  estado: string
  fecha: string
  id_familia: number
  recursos: { id_recurso: number; cantidad: number }[]
}
```

### DashboardStats
```typescript
interface DashboardStats {
  total_familias_registradas: number
  total_personas_damnificadas: number
  total_entregas_completadas: number
  total_unidades_kg_almacen: number
  recursos_alertas_stock: {
    nombre: string
    cantidad_disponible: number
    unidad: string
  }[]
}
```

### TrazabilidadItem
```typescript
interface TrazabilidadItem {
  id_entrega: number
  fecha_entrega: string
  recurso: string
  cantidad_entregada: number
  familia_receptora: string
  ubicacion_receptora: string
  posibles_origenes: string
}
```

### PriorizacionItem
```typescript
interface PriorizacionItem {
  id_familia: number
  representante: string
  ubicacion: string
  miembros: number
  puntaje_prioridad: number
  raciones_necesarias: {
    dias_cobertura: number
    agua_litros: number
    alimentos_kilos: number
  }
}
```

### AuditoriaLog
```typescript
interface AuditoriaLog {
  id: number
  usuario: string
  rol: string
  accion: string
  modulo: string
  detalle: string
  ip: string
  fecha: string
}
```

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}
```

---

## 🔄 Normalización de Respuestas

La función `normalize<T>()` en `helpers.ts` convierte la respuesta cruda del backend PHP al tipo `ApiResponse<T>`:

```typescript
function normalize<T>(res: AxiosResponse): ApiResponse<T> {
  const json = res.data
  // Si el backend devuelve { status, message/error, data }
  if (typeof json?.status === "number") {
    const ok = json.status >= 200 && json.status < 300
    return {
      success: ok,
      message: json.message ?? json.error,
      data: json.data ?? json
    }
  }
  // Fallback: evaluar el status HTTP directamente
  return {
    success: res.status >= 200 && res.status < 300,
    data: json
  }
}
```

---

## ⚠️ Manejo de Errores

### Errores de red
Todos los helpers capturan excepciones de Axios y retornan un `ApiResponse` de fallo:
```typescript
catch (err: any) {
  return {
    success: false,
    message: err.response?.data?.message
      ?? err.response?.data?.error
      ?? "Error de conexión"
  }
}
```

### Errores HTTP globales (interceptor)
| Código | Acción |
|--------|--------|
| 401 Unauthorized | Borra token y user de localStorage → redirige a /login |
| 403 Forbidden | Registra advertencia en consola |
| Otros | Propaga el error a la función llamante |

### Patrón de uso en vistas
```typescript
const res = await apiGetRecursos()
if (res.success && res.data) {
  recursos.value = res.data
} else {
  error.value = res.message ?? "No se pudieron cargar los recursos"
}
```

---

*Documentación técnica del proyecto Sistema de Gestión de Refugios — 2026.*
