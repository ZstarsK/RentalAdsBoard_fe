<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
#nprogress .bar {
  background: #b600ff !important;
  font-size: 10px !important;
}

</style>
