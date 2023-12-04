<template>
  <div>
    <h1 class="title">Rental Ads Board</h1>
    <div class="container">
      <form @submit.prevent="sendRequest">
        <label for="username"><b>Username</b></label>
        <input type="text" v-model="username" placeholder="">

        <label for="password"><b>Password</b></label>
        <input type="password" v-model="password" placeholder="">

        <input type="button" value="Register" @click="redirectToRegister"
               class="action-button">
        <input type="submit" value="Login" class="action-button">
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import axios from "axios";
import router from "@/router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'



const username = ref('');
const password = ref('');



const sendRequest = async () => {
  
  const payload = { username: username.value, password: password.value };
  
  try {
    const response = await axios.post('http://localhost:8091/board/login', payload);
    if (response.data.stateCode === 200 ) {
      NProgress.start();
      const _token = "Bearer "+response.data.obj;
      localStorage.setItem('token', _token);

      const headers = {
        'Content-Type': 'application/json',
        Authorization: _token
      }
      const userResp = await axios.get('http://localhost:8091/board/home' ,{ headers })
      localStorage.setItem('role',userResp.data.obj.role);
      localStorage.setItem('userName',userResp.data.obj.username);
      localStorage.setItem('userAvatar', userResp.data.obj.avatarBase64);
      const role = localStorage.getItem('role')
      if (parseInt(role) == 2) {
        localStorage.setItem('AdminPermission', String(true));
      }
      
      router.push("mainpage");
      NProgress.done();
    }
  } catch (error) {
    console.error('Error login:', error);
  }
};

const redirectToRegister = () => {
  window.location.href = "register"; // 修改为你的注册页面 URL
};

onMounted(() =>{
  if (localStorage.getItem("token")){
   router.push("/mainpage") 
  }
});
</script>

<style scoped>


.title {
  text-align: center;
  margin-top: 70px;
  color: #006699;
}
.container {
  width: 500px;
  padding: 40px;
  background-color: #a6e3e9;
  margin: 20px auto 10px;
  border-radius: 50px;
}
input[type=text], input[type=password] {
  width: 100%;
  padding: 12px;
  margin: 5px 0 16px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  color: black;
  border-radius: 9999px;
  background: rgba(245,245,245)
}

.actions {
  display: flex;
  justify-content: space-between;
}
.action-button {
  background-color: #66bfbf; /* 更改为您喜欢的颜色 */
  color: white;
  padding: 10px 15px;
  margin: 8px 3px;
  border: none;
  cursor: pointer;
  width: 48%; /* Adjust width as needed */
  border-radius: 9999px; /* 圆角边框 */
  transition: background-color 0.3s, box-shadow 0.3s; /* 平滑的过渡效果 */
}
.action-button:hover {
  background-color: #3fbac2; /* 悬停时的背景颜色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
}
</style>