import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'), // 首页
    meta: { title: '大麦 2.0 - 发现精彩' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/Category.vue')
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('@/views/Detail.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true } // 需要登录才能访问
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address.vue'),
    meta: { requiresAuth: true }
  },
  // 管理端路由预留
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/Dashboard.vue'),
    redirect: '/admin/users',
    children: [
      { path: 'users', component: () => import('@/views/admin/Users.vue') },
      { path: 'events', component: () => import('@/views/admin/Events.vue') }
    ],
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/home')
  } else {
    next()
  }
})

export default router
