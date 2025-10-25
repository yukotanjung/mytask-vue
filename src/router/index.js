import { createRouter, createWebHistory } from 'vue-router'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import MyTasks from '../views/MyTasks.vue'
import AdminLayout from '../layouts/AdminLayout.vue'


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: AdminLogin
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', name: 'Dashboard', component: AdminDashboard },
      { path: 'tasks', name: 'Tasks', component: MyTasks }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token && to.path !== '/login') {
    return next('/login')
  }

  if (to.path.startsWith('/tasks') && !user.abilities?.includes('task_read')) {
    return next('/')
  }

  if (token && to.path === '/login') {
    return next('/')
  }

  next()
})


export default router
