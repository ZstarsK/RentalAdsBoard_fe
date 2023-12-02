import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/page/Login.vue'
import Register from '@/components/page/Register.vue'
import MainPage from "@/components/page/MainPage.vue";
import AdDetails from "@/components/page/AdDetails.vue";
import AdPostPage from "@/components/page/AdPostPage.vue";


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
  },
  {
    path: '/addetails',
    name: 'AdDetails',
    component: AdDetails
  },
  {
    path: '/adpost',
    name: 'AdPost',
    component: AdPostPage
  }
  
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
