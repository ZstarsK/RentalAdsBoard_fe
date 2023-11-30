<template>
  <div class="main-container">
    <Navbar />

    <div class="content">
      <div class="search-bar-container">
        <input type="text" class="search-bar" placeholder="Search ads...">
      </div>

      <div class="ad-container">
        <div class="ad-card" v-for="ad in displayedAds" :key="ad.ad_id">
          <img v-if="ad.pictures && ad.pictures.length > 0" :src="ad.pictures[0]" alt="Ad Image">
          <h3>{{ ad.title }}</h3>
          <p>{{ ad.address }}</p>
          <p>{{ ad.description }}</p>
          <button class="action-button">View Details</button>
        </div>
      </div>

      <div class="pagination-buttons">
        <button v-if="hasLessAds" @click="previousPage" class="page-button"> &lt; </button>
        <button v-if="hasMoreAds" @click="nextPage" class="page-button"> &gt; </button>
      </div>
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

const hasLessAds = computed(() => {
  return currentPage.value > 1
});


onMounted(() => {
  fetchAds();
  
});

const fetchAds = async () => {
  try {
    const response = await axios.get('http://192.168.1.109:8091/ads/home');
    if (response.status === 200) {
      ads.value = response.data.obj;
      ads.value.forEach((ad) => {
        fetchPicturesForAd(ad.adId);
      });
    }
  } catch (error) {
    console.error('Error fetching ads:', error);
  }
};

const fetchPicturesForAd = async (adId) => {
  try {
    const url = `http://192.168.1.109:8091/picture/get/first?ad_id=${adId}`;
    const response = await axios.get(url);
    if (response.status === 200 && response.data && response.data.obj) {
      const adIndex = ads.value.findIndex(ad => ad.adId === adId);
      if (adIndex !== -1) {
        ads.value[adIndex].pictures = [response.data.obj.pictureBase64];
      }
    }
  } catch (error) {
    console.error(`Error fetching picture for ad ${adId}:`, error);
  }
};




const nextPage = () => {
  if (hasMoreAds.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

</script>


<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  min-height: 100vh; /* 设置最小高度为视口高度 */
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

.page-button {
  background-color: #4CAF50; /* 绿色背景 */
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 50%; /* 圆形按钮 */
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  width: 30px; /* 按钮宽度 */
  height: 30px; /* 按钮高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-button:hover {
  background-color: #45a049;
}

.pagination-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
