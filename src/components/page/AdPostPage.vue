<template>
  <Navbar/>
  <div class="ad-post-container">
    <div class="input-section">
      <input v-model="adInfo.title" placeholder="Title">
      <input v-model="adInfo.address" placeholder="Address">
      <textarea v-model="adInfo.description" placeholder="Description"></textarea>
      <button class="action-button" @click="submitAdInfo">Post</button>
    </div>

    <div class="image-section">
      <div v-for="(image, index) in images" :key="index" class="image-preview">
        <img :src="image.base64">
        <button class="delete-button" @click="removeImage(index)">X</button>
      </div>
      <input type="file" @change="onFileChange" accept="image/*" multiple>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import {useRoute} from "vue-router";
import router from "@/router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const route = useRoute();
const adId = ref(route.query.ad_id) || null;
const originalImages = ref([]);
const images = ref([]);
const userId = ref(localStorage.getItem("userId"));

const adInfo = ref({
  userId:userId,
  title: '',
  address: '',
  description: '',
  adId: adId.value
});

const submitAdInfo = async () => {
  try {
    userId.value = localStorage.getItem("userId");
    adInfo.value.userId = userId.value;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.post('http://localhost:8091/ads/save', adInfo.value,{headers});
    if (response.status === 200) {
      if (response.data.obj && response.data.obj.adId) {
        adId.value = response.data.obj.adId;
      }
      router.push('mainpage');
      alert("Post success!!!")
      // 确定新增的图片
      const addedImages = images.value.filter(image => !originalImages.value.includes(image));
      await uploadAddedImages(addedImages);

      // 确定被删除的图片（如果需要）
      const removedImageIds = originalImages.value
          .filter(image => !images.value.includes(image))
          .map(image => image.pictureId); // 假设 originalImages 包含带有 pictureId 的对象
      await deleteRemovedImages(removedImageIds);

    }
  } catch (error) {
    console.error('Error posting ad info:', error);
  }
};

const uploadAddedImages = async (addedImages) => {
  for (const image of addedImages) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
      await axios.post('http://localhost:8091/picture/save', {
        adId: adId.value,
        pictureBase64: image.base64,
        pictureId: null
      },
          {headers});
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
};
// 删除被移除的图片
const deleteRemovedImages = async () => {
  const originalImageIds = originalImages.value.map(image => image.pictureId);
  const currentImageIds = images.value.map(image => image.pictureId);

  const removedImageIds = originalImageIds.filter(id => !currentImageIds.includes(id));

  for (const pictureId of removedImageIds) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
      await axios.delete(`http://localhost:8091/picture/delete?picture_id=${pictureId}`,{headers});
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};

// 在 submitAdInfo 中调用 deleteRemovedImages


const onFileChange = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (images.value.length < 9) {
      const reader = new FileReader();
      reader.onload = (e) => {
        images.value.push({ base64: e.target.result, pictureId: null });
      };
      reader.readAsDataURL(file);
    }
  });
};

const getAdVo = async (adId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.get(`http://localhost:8091/ads/user/get?ad_id=${adId}`,{headers});
    if (response.status === 200 && response.data.obj) {
      adInfo.value = { ...response.data.obj, userId: userId };
    }
  } catch (error) {
    console.error('Error fetching ad info:', error);
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
      // 存储图片的 base64 字符串和对应的 pictureId
      images.value = response.data.obj.map(pic => ({
        base64: pic.pictureBase64,
        pictureId: pic.pictureId
      }));
    } else {
      images.value = [];
    }
  } catch (error) {
    console.error('Error fetching pictures:', error);
    images.value = [];
  }
};


const removeImage = (index) => {
  images.value.splice(index, 1);
};

onMounted(() => {
  if (adId.value) {
    NProgress.start();
    getAdVo(adId.value);
    fetchPictures(adId.value).then(() => {
      originalImages.value = [...images.value]; // 存储原始图片列表
    });
    NProgress.done();
  }
});

</script>

<style scoped>
.ad-post-container {
  display: flex;
  margin: 20px;
}
.image-preview {
  position: relative;
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

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgb(128, 128, 128);
  color: white;
  border: none;
  border-radius: 999%;
  cursor: pointer;
}

.input-section {
  flex: 1;
  padding: 20px;
  margin-right: 10px; /* 与图片部分的间隔 */
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.input-section textarea {
  width: 100%; /* 或者指定一个固定的宽度 */
  height: 200px; /* 指定固定高度 */
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none; /* 禁止调整大小 */
}


.input-section input, .input-section textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.image-section {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 10px; /* 图片之间的间隔 */
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

/* 更多样式可以根据需要添加 */
</style>