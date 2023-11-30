<script setup lang="ts">

</script>

<template>
  <div class="navbar">
    <div>
      <a class="button" href="#home">Home</a>
      <a class="button" href="#browse">Browse Ads</a>
      <a class="button" href="#postad">Post Ad</a>
    </div>
    <div>
      <span class="user-avatar"></span>
      <a class="button" href="#login">Login/Register</a>
    </div>
  </div>
</template>

<script setup lang="ts">
// Navbar logic goes here
</script>

<style scoped>
.navbar {
  background-color: #a6e3e9;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 35px;
}
.navbar a.button {
  color: white;
  padding: 8px 12px;
  margin: 4px 2px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
}
.navbar a.button:hover {
  background-color: #66bfbf;
}
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ddd;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}
</style>
