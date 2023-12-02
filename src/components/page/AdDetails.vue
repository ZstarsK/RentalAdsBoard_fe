<template>
  <div class="main-container">
    <Navbar/>
    <div class="details-container">
      <div class="card image-section">
        <img class="ad-image" :src="currentImage" alt="Property Image">
        <label class="imageNum"><b>{{ currentImageIndex+1 }}/{{ totalImage }}</b></label>
        <div class="image-nav-button-wrapper">
          <i class="bi bi-chevron-double-left image-nav-button" @click="previousImage"></i>
          <i class="bi bi-chevron-double-right image-nav-button" @click="nextImage"></i>
        </div>
      </div>
      <div>
        
      </div>
      <div class="card text-section">
        <h1>{{ adDetails.title }}</h1>
        <p>Address: {{ adDetails.address }}</p>
        <p>Description: {{ adDetails.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import {useRoute} from "vue-router";

const route = useRoute();
const adId = ref(route.query.ad_id);

const adDetails = ref({
  title: '',
  address: '',
  description: '',
})

const pictures = ref([]);
const currentImageIndex = ref(0);
const totalImage = computed(() => {
  return pictures.value.length
})

const getAdVo = async (adId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.get(`http://localhost:8091/ads/user/get?ad_id=${adId}`,{headers});
    return response.data.obj;
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchPictures = async (adId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.get(`http://localhost:8091/picture/list?ad_id=${adId}`,{headers});
    if (response.data.stateCode === 200 && Array.isArray(response.data.obj)) {
      // 清空之前的图片
      pictures.value = response.data.obj.map(pic => pic.pictureBase64);
    } else {
      // 如果没有图片或请求失败，清空图片数组
      pictures.value = [];
    }
  } catch (error) {
    console.error('Error fetching pictures:', error);
    pictures.value = []; // 出错时清空数组
  }
};


const updatePage = async () => {
  const adVo = await getAdVo(adId.value); // Dynamic adId can be passed here
  if (adVo) {
    adDetails.value = { ...adVo };
    await fetchPictures(adVo.adId);
  }
};

const nextImage = () => {
  if (currentImageIndex.value < pictures.value.length - 1) {
    currentImageIndex.value++;
  }
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const currentImage = computed(() => {
  return pictures.value.length > 0 ? pictures.value[currentImageIndex.value] : '';
});

onMounted(updatePage);
</script>

<style scoped>
html {
  position: relative;
  min-height: 100%;
}


.ad-card img {
  width: 100%;
  border-radius: 10px;
}

.details-container {
  display: flex;
  padding: 20px;
  gap: 20px; /* 添加空隙以分隔两个卡片 */
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
}

.ad-image {
  max-width: 100%; /* 确保图片不超出容器 */
  height: 600px; /* 保持图片的纵横比 */
  border-radius: 100px;
  
  object-fit: contain;
}

.text-section {
  flex: 1;
  padding: 20px;
}

.card {
  flex: 1;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); /* 添加阴影 */
  border-radius: 50px; /* 圆角边框 */
  overflow: hidden; /* 隐藏溢出的内容 */
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  padding-right: 10px;
}

.image-nav-button-wrapper {
  display: flex;
  flex-direction: row;
  height: 50px;
}

.image-nav-button {
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

.image-nav-button:hover {
  background-color: #0a84d3;
}

</style>

