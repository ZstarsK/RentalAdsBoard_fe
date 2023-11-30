<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: white; /* 设置背景颜色为白色 */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 如果您的 Footer 使用了绝对定位，请确保其不会被内容遮挡 */
footer {
  flex-shrink: 0; /* 确保 footer 不会缩小 */
}
</style>
