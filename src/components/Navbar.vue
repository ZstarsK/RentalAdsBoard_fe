<script setup lang="ts">

</script>

<template>
  <div class="navbar">
    <div>
      <a class="button" href="mainpage">Home</a>
      <a class="button" href="#browse">Browse Ads</a>
      <a class="button" href="adpost">Post Ad</a>
    </div>
    <div style="display: flex; flex-direction: row">
      <label class="username"><a>Hi, {{userName}}</a></label>
      <img class="user-avatar" :src="userAvatar">
      <div class="button" @click="logout">Logout</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const userName = ref('')
const userAvatar = ref('')

const router = useRouter()
const logout = () => {
  localStorage.clear();
  router.push('/login')
}

onMounted(() => {
  userName.value = localStorage.getItem("userName")
  userAvatar.value = localStorage.getItem("userAvatar")
})
</script>

<style scoped>
.navbar {
  background-color: #a6e3e9;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 50px;
  position: sticky;
  top: 0;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}
.navbar .button {
  color: black;
  padding: 15px 12px;
  margin: 4px 2px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
}
.navbar .button:hover {
  background-color: #66bfbf;
}
.user-avatar {
  margin-top: 6px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #ddd;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  
}
.username{
  font-size: 30px;
  padding-top: 10px;
  padding-right: 20px;
  
}
</style>
