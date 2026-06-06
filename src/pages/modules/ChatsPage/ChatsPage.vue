<template>
  <q-page class="flex flex-column chat-container q-pa-md">
    <div class="chat-messages-box col q-mb-md scroll" ref="chatWindow">
      <div v-for="msg in messages" :key="msg.id">
        <q-chat-message
          :name="msg.user.first_name || msg.user.name"
          :text="[msg.text]"
          :sent="msg.user_id === currentUser.id"
          :bg-color="msg.user_id === currentUser.id ? 'primary' : 'grey-4'"
          :text-color="msg.user_id === currentUser.id ? 'white' : 'black'"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm items-center">
      <div class="col">
        <q-input
          v-model="newMessage"
          outlined
          placeholder="Type a message..."
          autofocus
          @keyup.enter="sendChat"
        />
      </div>
      <div>
        <q-btn
          round
          color="primary"
          icon="send"
          :disable="!newMessage.trim()"
          @click="sendChat"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { currUserStore } from 'src/stores/user/user'
import { useChatStore } from 'src/stores/modules/Chats/chat'

const chatStore = useChatStore()
const currUser = currUserStore()
const messages = computed(() => chatStore.messages)
const newMessage = ref('')
const chatWindow = ref(null)

const currentUser = computed(() => currUser.userData)

const scrollToBottom = async () => {
  await nextTick()
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight
  }
}


const fetchChats = async () => {
  try {
    const response = await chatStore.getChats()
    messages.value = response
    scrollToBottom()
  } catch (error) {
    console.error('Failed fetching chat history:', error)
  }
}

const sendChat = async () => {
  if (!newMessage.value.trim()) return

  try {
    await chatStore.sendChat(newMessage.value)
    
    newMessage.value = ''
    scrollToBottom()
    } catch (error) {
    console.error('Failed sending message:', error)
  }
}

onMounted(() => {
  fetchChats()
  chatStore.connectWebSocket()
})

onUnmounted(() => {
  chatStore.disconnectWebSocket() 
})
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 100px); /* Adjust based on your header layout height */
  display: flex;
  flex-direction: column;
}
.chat-messages-box {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
}
</style>