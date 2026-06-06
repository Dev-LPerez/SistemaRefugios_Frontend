# Plan de Desarrollo: Reestructuración y Buenas Prácticas del Frontend

Este documento detalla el análisis del estado actual del frontend en Vue 3 + TypeScript y propone un **Plan de Desarrollo y Arquitectura** para reorganizar el código, hacerlo escalable, modular y corregir las limitaciones en el registro de donaciones y entregas (evitando bloqueos de 72 horas).

---

## 1. Auditoría de Código y Buenas Prácticas

Tras analizar el frontend actual, identificamos los siguientes puntos de mejora estructural y de diseño:

*   **Vistas Monolíticas y Acopladas:** Las vistas principales como [DonacionesView.vue](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/views/DonacionesView.vue) y [FamiliasView.vue](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/views/FamiliasView.vue) superan las 500 líneas y contienen todo mezclado: HTML estructurado, estilos CSS locales, control de paginación, filtros de búsqueda, lógica de red directa (Axios client) y hasta **4 modales incrustados en línea**. Esto limita severamente la reutilización de código y la mantenibilidad.
*   **Servicio API Centralizado Sobrecargado:** El archivo [api.ts](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/services/api.ts) contiene tanto la definición de tipos TypeScript, los métodos de mapeo de entidades (para renombrar las claves de base de datos del backend a camelCase), y las funciones HTTP de Axios. Debe dividirse para que cada entidad tenga su tipo e interfaz limpios.
*   **Inconsistencia de Clientes HTTP:** Se utiliza [axios.ts](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/services/axios.ts) con interceptores para casi todo, pero la función de inicio de sesión (`apiLogin`) utiliza un `fetch` directo con una URL hardcodeada en el código. Esto se puede resolver configurando una instancia limpia de Axios para endpoints públicos y otra para protegidos.
*   **Valores Hardcodeados en Código:** La URL del backend en producción (`https://sistemarefugios-backend.onrender.com`) está escrita de forma rígida directamente en los archivos de servicio, en lugar de importarse desde variables de entorno (`.env` / `import.meta.env`).
*   **Falta de Caché/Estado Compartido:** Módulos estáticos o de carga recurrente (como *Recursos*, *Donantes* y *Refugios*) se descargan mediante llamadas a la API repetidas veces al cambiar entre pantallas. No existe un almacenamiento compartido que actúe de caché rápida, lo cual ralentiza la experiencia de usuario.

---

## 2. Propuesta de Nueva Arquitectura (Front)

Para lograr un sistema altamente escalable y limpio, proponemos la siguiente estructura de carpetas:

```
src/
├── assets/             # Estilos globales y multimedia
├── components/         # Componentes transversales reutilizables (Botones, Inputs, Layout)
│   └── ui/             # Componentes base de diseño (modales, alertas)
├── types/              # Definición de interfaces TypeScript (Usuario, Familia, Recurso, etc.)
│   └── index.ts
├── services/           # Clientes HTTP y configuración de endpoints
│   ├── axios.ts        # Instancia única y exportación de clientes
│   └── modules/        # Llamadas organizadas por entidad
│       ├── auth.ts
│       ├── familias.ts
│       ├── recursos.ts
│       ├── donaciones.ts
│       └── entregas.ts
├── stores/             # Gestión de estados globales y cachés con Pinia
│   ├── auth.ts
│   ├── recursosStore.ts  # Almacena el inventario cargado para uso en entregas y donaciones
│   └── familiasStore.ts  # Cache de familias censadas
└── views/              # Vistas principales (limpias de modales y lógica compleja)
    ├── donaciones/
    │   ├── DonacionesView.vue
    │   └── components/   # Modales y formularios exclusivos de donaciones
    └── entregas/
        ├── EntregasView.vue
        └── components/   # Modales y formularios exclusivos de entregas
```

---

## 3. Plan de Soluciones a Problemas Específicos

### A. Listado de Donaciones mediante API Real
*   **Diagnóstico:** [DonacionesView.vue](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/views/DonacionesView.vue) asume que la API no tiene un endpoint para listar donaciones y utiliza una función de escaneo (`escanearTodas()`) que realiza peticiones HTTP secuenciales en lotes por ID, esperando detenerse tras 15 errores consecutivos. Esto consume demasiados recursos del cliente y del servidor.
*   **Solución:**
    1.  Eliminar completamente la lógica de escaneo (`escanearTodas`, `progresoEscaneo`, etc.) en el frontend.
    2.  Implementar la llamada al endpoint `GET /donaciones` mediante la función existente `apiGetDonaciones()`.
    3.  Alinear el frontend para que en la carga de la vista (`onMounted`) llame al listado de donaciones y cargue toda la colección de inmediato, permitiendo paginación estándar de cliente o servidor.

### B. Registro de Donación con Múltiples Recursos
*   **Diagnóstico:** Actualmente, al registrar una donación, el formulario sólo permite definir el donante y los datos generales. Tras registrar la cabecera, se obliga al usuario a abrir otro modal para agregar un recurso, y si desea añadir más, debe hacerlo de uno en uno desde la lista.
*   **Solución en la Interfaz (Frontend):**
    1.  Crear un sub-formulario dinámico de **"Detalle de Insumos"** dentro del formulario de Donación.
    2.  Utilizar una lista reactiva local (`detallesArray: { id_recurso: number, cantidad: number }[]`) en la que el usuario pueda añadir filas en el mismo modal con un botón (+ Agregar Fila) y seleccionar el recurso e indicar la cantidad antes de enviar.
    3.  Al presionar **"Registrar Donación"**, la lógica del frontend hará lo siguiente de manera coordinada en segundo plano:
        *   Enviar la petición de cabecera (`POST /donaciones`) para crear la donación y retornar el `id_donacion`.
        *   Con el `id_donacion` obtenido, gatillar llamadas simultáneas (`Promise.all`) o secuenciales a `POST /donaciones?action=agregar_detalle` para registrar cada insumo del arreglo.
        *   Mostrar un spinner de carga unificado y devolver retroalimentación de éxito final cuando todos los recursos estén procesados.

### C. Registro de Entrega Multi-recurso (Acumulada)
*   **Diagnóstico:** El formulario actual de entregas en el frontend restringe la selección a un solo recurso y cantidad por envío. Si el operador necesita entregar múltiples recursos (por ejemplo, Agua y Alimentos) a una misma familia, la interfaz actual le fuerza a realizar envíos separados. Esto no es óptimo y, al procesar los registros de forma discontinua en la sesión, se corre el riesgo de activar la regla de bloqueo de 72 horas en envíos posteriores.
*   **Aclaración sobre el Backend:** El backend admite el ingreso de múltiples productos dentro de una misma entrega consolidada (usando una estructura acumulada para los detalles de la entrega).
*   **Solución en la Interfaz (Frontend):**
    1.  Rediseñar el modal de **"Nueva Entrega"** para permitir la adición dinámica de productos.
    2.  Introducir una lista reactiva local (`productosArray: { id_recurso: number, cantidad: number }[]`) dentro del formulario. El usuario podrá seleccionar un recurso, ingresar su cantidad y agregarlo a una tabla temporal dentro del mismo modal.
    3.  Al presionar **"Registrar Entrega"**, el frontend agrupará la información de la cabecera (familia, fecha, estado) junto con el arreglo de productos agregados, enviando el registro acumulado al backend en una única transacción estructurada. Esto evita de raíz que actúe el bloqueo de seguridad de 72 horas, ya que la entrega de todos los productos se consolida en una sola operación logística multi-recurso.

---

## 4. Plan de Ejecución Fase a Fase

```mermaid
grid
  Fase 1 : Inicialización y Entorno
  Fase 2 : Desacoplamiento y Modularización
  Fase 3 : Integración API Real (Donaciones)
  Fase 4 : Formularios Dinámicos Multi-recurso
```

### Fase 1: Inicialización y Entorno
*   Crear el archivo `.env` en la raíz del proyecto para definir `VITE_API_BASE_URL=https://sistemarefugios-backend.onrender.com`.
*   Refactorizar [axios.ts](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/services/axios.ts) para inicializarse con `import.meta.env.VITE_API_BASE_URL`.
*   Modificar `apiLogin` para utilizar la misma instancia de Axios o un cliente Axios público secundario, removiendo el uso de `fetch` crudo con URLs hardcodeadas.

### Fase 2: Desacoplamiento y Modularización
*   Extraer las interfaces y tipos TypeScript de `api.ts` y moverlas a un nuevo archivo unificado en [types/index.ts](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/types/index.ts).
*   Dividir el archivo gigante `api.ts` en submódulos dentro de la carpeta `services/modules/` para agrupar las llamadas por entidad (*familias.ts*, *recursos.ts*, etc.).
*   Extraer los modales integrados en línea de las vistas principales (como los modales de familia y miembros en [FamiliasView.vue](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/views/FamiliasView.vue)) y moverlos a componentes individuales parametrizados en sus respectivas carpetas de componentes (ej: `src/views/familias/components/FamiliaModal.vue`).

### Fase 3: Integración API Real (Donaciones)
*   Sustituir el mecanismo de escaneo automático de donaciones por la llamada directa a `apiGetDonaciones()` en la inicialización de [DonacionesView.vue](file:///C:/Users/LUIS%20PEREZ/Downloads/proyecto-refugios-final/Frontend%20SistemaRefugio/src/views/DonacionesView.vue).
*   Eliminar el botón "Escanear API" y la barra de progreso asociada, mostrando en su lugar el indicador de carga estándar del sistema y cargando las donaciones desde la base de datos central inmediatamente.

### Fase 4: Formularios Dinámicos Multi-recurso
*   **Donaciones:** Reemplazar el flujo en dos pasos por un único formulario de registro de donación con listado dinámico de insumos.
*   **Entregas:** Construir el modal de entregas multi-recurso. Modificar el cliente de la API para construir y enviar el payload con el registro acumulado de productos, y verificar que el backend procese la transacción unificada correctamente.

---

## 5. Plan de Verificación y Pruebas

Para garantizar que el frontend reestructurado funciona correctamente sin romper la integración con el backend actual:

1.  **Pruebas de Autenticación y Carga:** Validar que la transición de `fetch` a Axios en el Login mantenga el almacenamiento del token en `localStorage` y persista la sesión al recargar el navegador.
2.  **Pruebas de Carga de Donaciones:** Confirmar que al acceder a la pestaña de "Donaciones", se listen todos los registros existentes sin tener que ejecutar escaneos manuales.
3.  **Verificación Multi-recurso (Donación):** Registrar una donación de 3 ítems simultáneos (ej: 10L Agua, 15Kg Arroz, 5 Cobijas) y verificar en la sección de inventario que las existencias de cada recurso hayan incrementado en tiempo real.
4.  **Verificación Multi-recurso (Entrega):**
    *   Registrar una entrega a una familia que contenga múltiples recursos acumulados (ej: 5L de agua y 2Kg de alimentos).
    *   Verificar que la petición se envíe en un único payload unificado.
    *   Comprobar en la base de datos o en la vista de inventario que todos los recursos entregados se hayan descontado correctamente y que la entrega aparezca registrada.
