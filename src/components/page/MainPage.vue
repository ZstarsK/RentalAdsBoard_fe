<template>
  <div class="main-container">
    <Navbar />

    <div class="content">
      <div class="search-bar-container">
        <input type="text" class="search-bar" placeholder="Search ads...">
      </div>

      <div class="ad-container">
        <div class="ad-card" v-for="ad in displayedAds" :key="ad.adId">
          <img v-if="ad.pictures.length > 0" :src="ad.pictures[0].path" alt="Ad Image">
          <h3>{{ ad.title }}</h3>
          <p>{{ ad.address }}</p>
          <p>{{ ad.description }}</p>
          <button class="action-button">View Details</button>
        </div>
      </div>

      <button v-if="hasMoreAds" @click="nextPage">Next Page</button>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const ads = ref([]);
const currentPage = ref(1);
const pageSize = 5;

const displayedAds = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return ads.value.slice(startIndex, startIndex + pageSize);
});

const hasMoreAds = computed(() => {
  return ads.value.length > currentPage.value * pageSize;
});

onMounted(() => {
  fetchAds();
});

const fetchAds = () => {
  const userId = 1;
  axios.get(`http://192.168.1.109:8091/ads/get?user_id=${userId}`)
      .then((resp) => {
        ads.value = resp.data.obj;
        console.log(resp)
      })
      .catch((err) => {
        console.error(err);
      });
};

const nextPage = () => {
  if (hasMoreAds.value) {
    currentPage.value++;
  }
};
</script>


<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  //min-height: 100vh; /* 设置最小高度为视口高度 */
  flex-grow: 1;
}

.search-bar-container {
  padding: 10px;
}

.search-bar {
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}

.ad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  width: 1000px;
}

.ad-card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  margin: 8px;
  padding: 20px;
  width: 70%;
  text-align: center;
  border-radius: 10px;
}

.ad-card img {
  width: 100%;
  border-radius: 10px;
}

.action-button {
  background-color: #66bfbf;
  color: white;
  padding: 10px 15px;
  margin: 8px 3px;
  border: none;
  cursor: pointer;
  border-radius: 9999px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.action-button:hover {
  background-color: #3fbac2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
