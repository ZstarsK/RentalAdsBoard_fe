<template>
  <div class="main-container">
    <Navbar />

    <div class="content">
      <div class="search-bar-container">
        <input type="text" class="search-bar" placeholder="Search ads...">
      </div>

      <div class="ad-container">
        <div class="ad-card" v-for="ad in displayedAds" :key="ad.adId">
          <img v-if="ad.pictures && ad.pictures.length > 0" :src="ad.pictures[0]" alt="Ad Image">
          <h3>{{ ad.title }}</h3>
          <p>{{ ad.address }}</p>
          <p>{{ ad.description }}</p>
          <button class="action-button" @click="viewDetail(ad.adId)">View Details</button>
          <div v-if="ad.userId.toString() === userId" class="editor">
            <i class="bi bi-trash-fill" @click="deleteAd(ad.adId,ad.userId)" style="margin: 0 10px"></i>
            <i class="bi bi-pencil-square" @click="editorDetail(ad.adId)" style="margin: 0 10px"></i>
          </div>
        </div>
      </div>

      <div class="pagination-buttons">
        <button v-if="hasLessAds" @click="previousPage" class="page-button"> &lt; </button>
        <button v-if="hasMoreAds" @click="nextPage" class="page-button"> &gt; </button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import {useRouter} from "vue-router";

const ads = ref([]);
const currentPage = ref(1);
const pageSize = 5;

const userId = localStorage.getItem("userId");


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

const router = useRouter();

const viewDetail = (adId) => {
  router.push({ name: 'AdDetails', query: { ad_id: adId } });
};

const editorDetail = (adId) => {
  router.push({ name: 'AdPost', query: { ad_id: adId } });
}


onMounted(() => {
  if (!localStorage.getItem("userId")){
    router.push("/login")
    alert("Please login first!!!")
    
  }else {
    fetchAds();
  }
  
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

const deleteAd = (adId, userid) => {
  if (userid.toString() === userId){
    _deleteAd(adId);
  }
}
const _deleteAd = async (adId) => {
  try {
    console.log(adId);
    const resp = await axios.delete(`http://192.168.1.109:8091/ads/delete?ad_id=${adId}`);
    location.reload()
  }catch (error){
    console.error('ErrorDelete',error)
  }
}


const fetchPicturesForAd = async (adId) => {
  try {
    const url = `http://192.168.1.109:8091/picture/get/first?ad_id=${adId}`;
    const response = await axios.get(url);
    if (response.status === 200  && response.data.obj) {
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
    window.scrollTo(0,0);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo(0,0);
  }
};

</script>


<style scoped>
.main-container {
  overflow-x: hidden;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
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

.pagination-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
