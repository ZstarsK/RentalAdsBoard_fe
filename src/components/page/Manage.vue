<template>
  <Navbar/>
  <div class="admin-dashboard">
    
    <div class="user-management">
      <h1>User Management</h1>
      <div v-for="user in users" :key="user.userId" class="user-item">
        <!-- Display user info -->
        <img :src="user.avatarBase64" alt="Avatar">
        <p>{{ user.username }}</p>
        <p>{{ user.email }}</p>
        <select v-model="user.role">
          <option value=2>Admin</option>
          <option value=1>User</option>
        </select>
        <button @click="updateUser(user)">Update</button>
      </div>
    </div>
    <div class="pagination-buttons">
      <button @click="previousPage" class="page-button"> &lt;</button>
      <button @click="nextPage" class="page-button"> &gt;</button>
    </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import {computed, onMounted, ref} from 'vue';
import router from "@/router";
import Navbar from "@/components/Navbar.vue";
const currentPage = ref(0);
const maxPage = ref(1);
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const users = ref([]);

onMounted(async () => {
  if (!localStorage.getItem("AdminPermission")){
    alert("No permission!!!")
    router.push('/login')
  }else {
    fetchUsers();
  }
});

const fetchUsers = async () => {
  NProgress.start();
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    };
    const response = await axios.get(`http://localhost:8091/board/root?page_number=${currentPage.value}&size=10`, { headers });
    if (response.status === 200) {
      maxPage.value = response.data.obj.totalPages;
      users.value = response.data.obj.voList;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    NProgress.done();
  }
};
const updateUser = async (user) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    //user.role = parseInt(user.role)
    const resp = await axios.put(`http://localhost:8091/board/root/manage?roleChanged=${parseInt(user.role)}&username=${user.username}`, null, {headers});
    if (user.username === localStorage.getItem('userName')){
      const _token = "Bearer "+resp.data.obj;
      localStorage.setItem('token', _token);
      if (parseInt(user.role) == 1){
        localStorage.setItem('AdminPermission',false);
        localStorage.setItem('role',1)
        router.push('mainpage')
      }
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const nextPage = () => {
  if (currentPage.value < maxPage.value - 1) {
    currentPage.value++;
    fetchUsers();
  }
};

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchUsers();
  }
};


// Add similar functions for ad management
</script>

<style>
.admin-dashboard {
  width: 80%;
  margin: 20px auto;
}

.user-management, .ad-management {
  margin-bottom: 40px;
}

.user-item, .ad-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.user-item img, .ad-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-item p, .ad-item p {
  margin: 0 10px;
}

.user-item select, .ad-item select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.user-item button, .ad-item button {
  padding: 5px 10px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.user-item button:hover, .ad-item button:hover {
  background-color: #218838;
}
.pagination-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-button {
  background-color: #0f9df8;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 50%; /* 圆形按钮 */
  cursor: pointer;
  font-size: 20px;
  width: 40px; /* 按钮宽度 */
  height: 40px; /* 按钮高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-button:hover {
  background-color: #0a84d3;
}

</style>
