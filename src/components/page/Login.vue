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
import { ref } from 'vue';
import Navbar from "@/App.vue";
const username = ref('');
const password = ref('');

const sendRequest = () => {
  const payload = { username: username.value, password: password.value };

  fetch('http://localhost:8091/board/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => console.error('Error:', error));
};

const redirectToRegister = () => {
  window.location.href = "register"; // 修改为你的注册页面 URL
};
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
  margin: 10px auto;
  margin-top: 20px;
  //border: 1px solid black;
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