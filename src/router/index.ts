import AdDetails from "@/components/page/AdDetails.vue";
import AdminLogin from "@/components/page/AdminLogin.vue";
import AdPostPage from "@/components/page/AdPostPage.vue";
import ChatRoom from "@/components/page/ChatRoom.vue";
import EditUserInfo from "@/components/page/EditUserInfo.vue";
import Login from '@/components/page/Login.vue'
import MainPage from "@/components/page/MainPage.vue";
import Manage from "@/components/page/Manage.vue";
import Register from '@/components/page/Register.vue'
import {createRouter, createWebHistory} from 'vue-router'


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
    },
    {
        path: '/adminlogin',
        name: 'adminlogin',
        component: AdminLogin
    },
    {
        path: '/manage',
        name: 'manage',
        component: Manage
    },
    {
        path: '/edituserinfo',
        name: 'edituserinfo',
        component: EditUserInfo
    },
    {
        path:'/chatroom',
        name: 'chatroom',
        component: ChatRoom
    }


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
