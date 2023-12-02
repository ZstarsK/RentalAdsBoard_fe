<template>
  <div class="login-container">
    <h1>Admin Login</h1>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="loginInfo.username" placeholder="Username" required>
      <input type="password" v-model="loginInfo.password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loginInfo = ref({ username: '', password: '' });

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8091/board/login', loginInfo.value);
    if (response.status === 200 ) {
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
    if (parseInt(role) === 2) {
      // Redirect to admin dashboard
      localStorage.setItem('AdminPremission', true);
      router.push('manage');
    } else {
      console.log(response)
      alert('Not authorized');
    }
  }
  }catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  }
};
</script>

<style>
.login-container {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-container h1 {
  margin-bottom: 20px;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-container button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #0056b3;
}
</style>

