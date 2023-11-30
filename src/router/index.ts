import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/page/Login.vue'
import Register from '@/components/page/Register.vue'
import MainPage from "@/components/page/MainPage.vue";


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/mainpage',
    name: 'MainPage',
    component: MainPage
  }
  // ... 其他路由 ...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
