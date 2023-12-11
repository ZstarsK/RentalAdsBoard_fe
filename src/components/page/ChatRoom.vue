<template>
  <Navbar/>
  <n-layout has-sider style="height: 100vh;">
    <n-layout-sider bordered width="300px">
      <!-- 在线用户列表的卡片 -->
      <n-card title="Users" :bordered="false" style="height: 100%;">
        <n-list size="medium">
          <n-list-item v-for="user in users" :key="user.userId" @click="selectUser(user)">
            <div style="display: flex;flex-direction: row">
              <n-avatar :src="user.avatarBase64" style="margin-right: 8px;border-radius: 50px" />
              <div style="font-size: large; padding-top: 10px">{{ user.username }}</div>
            </div>
          </n-list-item>
        </n-list>
      </n-card>
    </n-layout-sider>

    <n-layout>
      <n-layout-content style="padding: 20px;">
        <!-- 选中的用户聊天内容的卡片 -->
        <n-card v-if="selectedUser" :title="`Chat with ${selectedUser.username}`" :bordered="false" style="height: calc(100vh - 120px);">
          <!-- 聊天内容 -->
          <div class="chat-content" style="overflow-y: auto; height: calc(100% - 60px);">
            <div v-for="message in messages" :key="message.id" :class="{ 'from-self': message.fromSelf }" class="chat-message">
              <!-- 如果 message.fromSelf 为 true，则会添加 from-self 类 -->
              <n-avatar v-if="message.fromSelf" :src="myAvatar" class="avatar"></n-avatar>
              <n-avatar v-else :src="selectedUser.avatarBase64" class="avatar"></n-avatar>
              <div class="message">{{ message.content }}</div>
            </div>
          </div>
          <template #footer>
            <div class="chat-input">
              <n-input v-model:value="currentMessage" @keydown.enter="sendMessage" placeholder="Type a message..." />
              <n-button @click="sendMessage">Send</n-button>
            </div>
          </template>
        </n-card>
        <div v-else class="no-selection">Select a user to start chatting</div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { NLayout, NLayoutSider, NLayoutContent, NCard, NList, NListItem, NAvatar, NInput, NButton } from 'naive-ui';
import Navbar from "@/components/Navbar.vue";
import axios from "axios";
import {useRoute} from "vue-router";

//const users = ref(['11','22']); // 在线用户列表
const users = ref([]);
const selectedUser = ref(null);
const messages = ref([]);
const currentMessage = ref('');
let ws = null; // WebSocket 实例
const username = localStorage.getItem("userName")
const myAvatar = ref(localStorage.getItem("userAvatar"))
const route = useRoute();
const target_username = ref(route.query.target_username);

// 创建 WebSocket 连接
const createWebSocketConnection = (targetUsername) => {
  ws = new WebSocket(`ws://localhost:8091/websocket/${username}/${targetUsername}`);
  
};

onMounted(() => {
  getTargetUserInfo(target_username.value);
});

// 在组件卸载时关闭 WebSocket 连接
onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});

const getTargetUserInfo = async (target_username) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token')
  };
  const response = await axios.get(`http://localhost:8091/board/home?username=${target_username}`, { headers });
  const _target = response.data.obj;
  selectUser(_target);
}

// 选择用户进行聊天
const selectUser = async (user) => {
  if (ws) {
    ws.close();
  }
  selectedUser.value = user;
  messages.value = []; // 清空当前消息数组
  createWebSocketConnection(user.username); // 创建与新用户的 WebSocket 连接
  
  // 获取与选中用户的历史聊天记录
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') 
    };
    const response = await axios.get(`http://localhost:8091/chat/get/history?username=${username}&target_username=${user.username}`, { headers });

    if (response.status === 200 && Array.isArray(response.data.obj)) {
      const historyMessages = response.data.obj.map(msg => {
        return {
          content: msg.message, // 消息内容
          fromSelf: msg.userFrom === username, // 检查消息是否由当前用户发送
          //timestamp: msg.timestamp // 消息时间戳（如果有的话）
        };
      });

      // 更新 messages 数组以显示历史消息
      messages.value = historyMessages;
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
  }
  
  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    messages.value.push({
      content: messageData,
      fromSelf: false
    });
  };
};

// 发送消息
const sendMessage = () => {
  if (currentMessage.value.trim() && selectedUser.value) {
    const messageContent = currentMessage.value;

    messages.value.push({
      content: messageContent,
      fromSelf: true
    });
    
    // 使用 WebSocket 发送消息
    ws.send(JSON.stringify(messageContent));

    // 清空输入框
    currentMessage.value = '';
  }
};


const getUserList = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
    const response = await axios.get('http://localhost:8091/board/root?page_number=0&size=9999',{headers});
    users.value = response.data.obj.voList;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
onMounted(() => {
  // 在这里可以发送初始化消息或请求用户列表等
  getUserList();
});
</script>

<style scoped>
.chat-message {
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-radius: 10px;
  word-break: break-word;
  align-items: center;
  
}
.message {
  word-break: break-word;
}

.chat-input {
  display: flex;
  padding: 10px;
}

.chat-input .n-input {
  flex-grow: 1;
  margin-right: 10px;
}

.from-self {
  flex-direction: row-reverse;
  background: #a8ffbc;
}

.avatar {
  width: 40px; /* 或其他大小 */
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

</style>
