# Refugios Montería - Frontend

## Configuración de la API

El proyecto consume el backend en:
```
https://sistemarefugios-backend.onrender.com
```

La URL está definida en `src/services/api.ts` en la constante `BASE_URL`.

## Instalación

```bash
npm install
npm run dev
```

## Estructura de la API

| Método | Endpoint                    | Descripción                  |
|--------|-----------------------------|------------------------------|
| POST   | /auth/login                 | Login (user + password)      |
| GET    | /api/dashboard              | Estadísticas generales        |
| GET    | /api/refugios               | Lista de refugios            |
| POST   | /api/refugios               | Crear refugio                |
| PUT    | /api/refugios/:id           | Actualizar refugio           |
| DELETE | /api/refugios/:id           | Eliminar refugio             |
| GET    | /api/familias               | Lista de familias            |
| POST   | /api/familias               | Crear familia                |
| GET    | /api/familias/priorizadas   | Familias ordenadas por prioridad |
| GET    | /api/miembros               | Miembros de familias         |
| GET    | /api/miembros?familia_id=X  | Miembros de una familia      |
| GET    | /api/recursos               | Lista de recursos            |
| POST   | /api/recursos               | Crear recurso                |
| GET    | /api/auditoria              | Logs de auditoría            |

## Autenticación

El backend usa JWT. Al hacer login se guarda el token en `localStorage`.
Todas las peticiones incluyen automáticamente el header:
```
Authorization: Bearer <token>
```

Si el token expira (respuesta 401), se redirige automáticamente al login.
