<template>
  <div class="main-container">
    <Navbar/>
    <div class="content">
<!--      Search bar -->
      <div class="search-bar-container">
        <n-input-group class="input-group-rounded">
          <n-input
              v-model:value="searchQuery"
              placeholder="Search..."
              class="search-input"
              @keydown.enter="performSearch"
          />
          <i class="bi bi-search search-button" @click="performSearch"></i>
        </n-input-group>
      </div>

      <div class="ad-container">
        <div class="ad-card" v-for="ad in displayedAds" :key="ad.adId">
          <img v-if="ad.pictures && ad.pictures.length > 0" :src="ad.pictures[0]" alt="Ad Image">
          
          <div class="username-upper-right" style="display: flex; flex-direction: row; justify-content: right">
            <i class="bi bi-person-fill" style="padding-right: 3px"></i>
            <div >{{ ad.username }}</div>
          </div>
          
          <h1>{{ ad.title }}</h1>
          <div class="location" style="text-align: center;">
            <i class="bi bi-geo-alt-fill" style="padding-right: 6px"></i>
            <span style="font-size: 20px">{{ ad.address }}</span>
          </div>
          <p>{{ ad.description }}</p>
          <button class="action-button" @click="viewDetail(ad.adId)">View Details</button>
          <div v-if="userRole == 2 || ad.username === userName" class="editor">
            <i class="bi bi-trash-fill" @click="deleteAd(ad.adId)" style="margin: 0 10px"></i>
            <i class="bi bi-pencil-square" @click="editorDetail(ad.adId)" style="margin: 0 10px"></i>
          </div>
        </div>
      </div>

      <div class="pagination-buttons">
        <button @click="previousPage" class="page-button"> &lt;</button>
        <button @click="nextPage" class="page-button"> &gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {onMounted, ref, computed} from 'vue';
import Navbar from '@/components/Navbar.vue';
import {useRouter} from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { NInputGroup, NInput, NButton } from 'naive-ui';
import async from "async";

const searchQuery = ref('');

const ads = ref([]);
const currentPage = ref(0);
//const pageSize = 5;
const maxPage = ref(1)
const userName = localStorage.getItem('userName');

const userRole = ref(0);


const displayedAds = computed(() => {
  const startIndex = 0;
  return ads.value.slice(0, 5);
});


const router = useRouter();

const viewDetail = (adId) => {
  router.push({name: 'AdDetails', query: {ad_id: adId}});
};

const editorDetail = (adId) => {
  router.push({name: 'AdPost', query: {ad_id: adId}});
}

const performSearch = async () => {

  // 可以在这里发送 GET 请求
  const headers = {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token')
  }
  const resp = await axios.get(`http://localhost:8091/ads/search?Key=${searchQuery.value}&page_number=${currentPage.value}&size=5`,
      {headers});
  if (resp.status === 200) {
    ads.value = resp.data.obj.voList;
    ads.value.forEach((ad) => {
      fetchPicturesForAd(ad.adId);
    });
    maxPage.value = resp.data.obj.totalPages;
  }
};

onMounted(() => {

  if (!localStorage.getItem("token")) {
    router.push("/login")
    alert("Please login first!!!")

  } else {
    NProgress.start();
    userRole.value = parseInt(localStorage.getItem('role'));
    currentPage.value = 0;
    fetchAds();
    NProgress.done();
  }

});

const fetchAds = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.get(`http://localhost:8091/ads/index/get?page_number=${currentPage.value}&size=5`, {headers});
    if (response.status === 200) {
      ads.value = response.data.obj.voList;
      ads.value.forEach((ad) => {
        fetchPicturesForAd(ad.adId);
      });
      maxPage.value = response.data.obj.totalPages;
    }
  } catch (error) {
    console.error('Error fetching ads:', error);
  }
};

const deleteAd = async (adId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const resp = await axios.delete(`http://localhost:8091/ads/delete?ad_id=${adId}`, {headers});
    location.reload()
  } catch (error) {
    console.error('ErrorDelete', error)
  }
}


const fetchPicturesForAd = async (adId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const url = `http://localhost:8091/picture/get/first?ad_id=${adId}`;
    const response = await axios.get(url, {headers});
    if (response.status === 200 && response.data.obj) {
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
  if (currentPage.value < maxPage.value - 1) {
    currentPage.value++;
    if (searchQuery.value != null){
      performSearch()
    }else {
      fetchAds();
    }
    
  }
};

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    if (searchQuery.value === ""){
      performSearch()
    }else {
      fetchAds();
    }
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 8px;
  padding: 20px;
  width: 70%;
  text-align: center;
  border-radius: 10px;
  position: relative;
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

.username-upper-right {
  text-align: right;
}

.search-bar-container {
  position: relative;
  width: 200px; /* 初始宽度 */
  transition: width 0.3s ease-in-out;
}

.search-bar-container:hover,
.search-bar-container:focus-within {
  width: 100%; /* 鼠标悬浮或聚焦时的宽度 */
  border-radius: 50px;
}

.search-input {
  width: 100%;
  transition: width 0.3s ease-in-out;
  position: relative;
}


.search-button {
  position: absolute;
  right: 17px;
  top: 50%;
  border: none;
  background: none;
  transform: translateY(-50%);

}
</style>
