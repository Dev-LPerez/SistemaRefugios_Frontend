import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
    { path: '/about', name: 'About', component: () => import('@/views/AboutView.vue') },
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
    { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/refugios', name: 'Refugios', component: () => import('@/views/RefugiosView.vue'), meta: { requiresAuth: true, roles: ['Admin','Logistica','Operario'] } },
    { path: '/familias', name: 'Familias', component: () => import('@/views/FamiliasView.vue'), meta: { requiresAuth: true, roles: ['Admin','Operario','Voluntario'] } },
    { path: '/recursos', name: 'Recursos', component: () => import('@/views/RecursosView.vue'), meta: { requiresAuth: true, roles: ['Admin','Logistica'] } },
    { path: '/donaciones', name: 'Donaciones', component: () => import('@/views/DonacionesView.vue'), meta: { requiresAuth: true, roles: ['Admin','Logistica','Operario'] } },
    { path: '/entregas', name: 'Entregas', component: () => import('@/views/EntregasView.vue'), meta: { requiresAuth: true, roles: ['Admin','Logistica','Operario','Voluntario'] } },
    { path: '/priorizacion', name: 'Priorizacion', component: () => import('@/views/PriorizacionView.vue'), meta: { requiresAuth: true, roles: ['Admin','Logistica','Operario'] } },
    { path: '/reportes', name: 'Reportes', component: () => import('@/views/ReportesView.vue'), meta: { requiresAuth: true, roles: ['Admin','Auditor','Logistica','Operario'] } },
    { path: '/auditoria', name: 'Auditoria', component: () => import('@/views/AuditoriaView.vue'), meta: { requiresAuth: true, roles: ['Admin','Auditor'] } },
  ]
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  if (to.path === '/login' && auth.isAuthenticated) return next('/dashboard')
  if (to.meta.roles && !(to.meta.roles as string[]).includes(auth.userRol ?? '')) return next('/dashboard')
  next()
})

export default router
