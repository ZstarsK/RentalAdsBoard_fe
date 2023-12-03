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
    </div>
</template>

<script setup>
import axios from 'axios';
import {computed, onMounted, ref} from 'vue';
import router from "@/router";
import Navbar from "@/components/Navbar.vue";

const users = ref([]);

onMounted(async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.get('http://localhost:8091/board/root',{headers});
    users.value = response.data.obj;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

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
        localStorage.setItem('AdminPremission',false);
        localStorage.setItem('role',1)
        router.push('mainpage')
      }
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

onMounted(() => {
  if (!localStorage.getItem("AdminPremission")){
    alert("No permission!!!")
    router.push('/login')
  }
})


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
</style>
