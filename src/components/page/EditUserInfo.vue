<template>
  <div>
    <Navbar/>
    <h1 class="title">Edit User Info</h1>
    <div class="container">
      <form @submit.prevent="sendRequest">
        <label for="username"><b>Username</b></label>
        <input type="text" v-model="username" placeholder="">

        <label for="email"><b>Email</b></label>
        <input type="email" v-model="email" placeholder="">

        <label for="password"><b>Password</b></label>
        <input type="password" v-model="password" @focus="clearPasswordError" placeholder="">

        <label for="confirmPassword"><b>Confirm Password</b></label>
        <input type="password" v-model="confirmPassword" @focus="clearPasswordError" placeholder="">
        <label for="Avatar"><b>Choose avatar</b></label>
        <input type="file" @change="onFileChange" accept="image/*" style="opacity: 0">

        <div v-if="imageBase64">
          <img class="image-preview" :src="imageBase64" alt="Image preview">
        </div>

        <div v-if="showPasswordError" class="error-message">
          Passwords mismatch
        </div>

        <button type="button" class="action-button" @click="fileInput.click()">Choose Avatar</button>
        <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display: none;">

        <input type="submit" value="Update Info" class="action-button">
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const username = ref('');
const email = ref('');
const password = ref('');
const imageBase64 = ref('');
const role = ref(1);
const confirmPassword = ref('');
const showPasswordError = ref(false);
const passwordMismatch = computed(() => password.value !== confirmPassword.value);

const fileInput = ref(null);
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      createImage(e.target.result);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  }
};

const createImage = (src) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置压缩后的图片尺寸
    canvas.width = 250; // 示例宽度
    canvas.height = 250; // 示例高度

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    imageBase64.value = canvas.toDataURL('image/jpeg', 0.8); // 第二个参数是图片质量，范围从 0 到 1);
    console.log(imageBase64.value);
  };
  img.src = src;
};

const sendRequest = () => {
  if (passwordMismatch.value) {
    showPasswordError.value = true;
    return;
  }
  //console.log(base64.value)
  const payload = {
    username: username.value,
    email: email.value,
    password: password.value,
    avatarBase64: imageBase64.value,
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token')
  }
  axios.put('http://localhost:8091/board/update', payload, {headers})
      .then(response => {
        if (response.status === 200) {
          alert('用户信息更新成功！');
          console.log(response)
          localStorage.setItem('userName',response.data.obj.username);
          localStorage.setItem('userAvatar', response.data.obj.avatarBase64);
          window.location.href = "Login"; // 修改为你的注册页面 URL

        } else {
          alert('注册失败，请重试。');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('出现错误，请重试。');
      });
};

const clearPasswordError = () => {
  showPasswordError.value = false;
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
  margin: 0 auto;
  margin-top: 20px;
//border: 1px solid black;
  border-radius: 50px;
}
input[type=text], input[type=email], input[type=password] {
  width: 100%;
  padding: 12px;
  margin: 5px 0 16px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  color: black;
  border-radius: 9999px;
  background: rgba(245, 245, 245);
}

.actions {
  display: flex;
  justify-content: center;
}
.action-button {
  background-color: #66bfbf;
  color: white;
  padding: 10px 15px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%; /* Full width */
  border-radius: 9999px;
  transition: background-color 0.3s, box-shadow 0.3s;
}
.action-button:hover {
  background-color: #3fbac2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.error-message{
  color: red;
  margin-top: 5px;
}
.image-preview {
  width: 420px;
  height: 420px;
  object-fit: cover;
  border-radius: 20px;
}
</style>
