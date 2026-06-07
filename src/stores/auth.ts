import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiLogin, apiLogout, type Usuario } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Usuario | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const userRol = computed(() => user.value?.rol ?? null)

  // Roles reales del backend: Admin | Logistica | Operario | Voluntario | Auditor
  const canManageFamilias = computed(() =>
    ['Admin', 'Operario', 'Voluntario'].includes(user.value?.rol ?? '')
  )
  const canManageRecursos = computed(() =>
    ['Admin', 'Logistica'].includes(user.value?.rol ?? '')
  )
  const canManageEntregas = computed(() =>
    ['Admin', 'Logistica', 'Operario', 'Voluntario'].includes(user.value?.rol ?? '')
  )
  const canViewAuditoria = computed(() =>
    ['Admin', 'Auditor'].includes(user.value?.rol ?? '')
  )
  const canViewReportes = computed(() =>
    ['Admin', 'Auditor', 'Logistica', 'Operario'].includes(user.value?.rol ?? '')
  )
  const canManageRefugios = computed(() =>
    ['Admin', 'Logistica', 'Operario'].includes(user.value?.rol ?? '')
  )

  async function login(userInput: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await apiLogin(userInput, password)
      if (response.success && response.data) {
        // Guardamos los datos del usuario para renderizar la interfaz y validar roles
        user.value = response.data.usuario
        localStorage.setItem('user', JSON.stringify(response.data.usuario))
        return true
      } else {
        error.value = response.message || 'Credenciales inválidas'
        return false
      }
    } catch (e) {
      error.value = 'Error de conexión con el servidor'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      // Llama al endpoint de logout para que el backend destruya la cookie HttpOnly
      await apiLogout()
    } catch (e) {
      console.error('Error al cerrar sesión en el servidor:', e)
    } finally {
      // Limpiamos el estado en el frontend pase lo que pase con la petición
      user.value = null
      localStorage.removeItem('user')
    }
  }

  function initAuth() {
    // Recupera la sesión visual si el usuario refresca la página
    const saved = localStorage.getItem('user')
    if (saved) {
      user.value = JSON.parse(saved)
    }
  }

  return {
    user, loading, error,
    isAuthenticated, userRol,
    canManageFamilias, canManageRecursos, canManageEntregas,
    canViewAuditoria, canViewReportes, canManageRefugios,
    login, logout, initAuth
  }
})