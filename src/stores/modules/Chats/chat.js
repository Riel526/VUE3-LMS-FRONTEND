import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useChatStore = defineStore('chat', () => {
  const socket = ref(null)
  const messages = ref([])
  const isConnected = ref(false)

  const getChats = async () => {
    try {
      const response = await api.get('/api/chat/get-chats')
      messages.value = response.data
    } catch (error) {
      console.error(error)
    }
  }

  const sendChat = async (textPayload) => {
    try {
      const response = await api.post('/api/chat/add-chat', {
        text: textPayload
      })
      
      
      const newSavedMessage = response.data
      messages.value.push(newSavedMessage)

      if (socket.value && isConnected.value) {
        socket.value.send(JSON.stringify({
          event: 'client-message',
          channel: 'classroom-chat',
          data: newSavedMessage
        }))
      }

      return response.data
    } catch (error) {
      console.error(error)
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
    }
  }

  const connectWebSocket = () => {
    if (socket.value) return 

    const appKey = import.meta.env.VITE_REVERB_APP_KEY
    const host = import.meta.env.VITE_REVERB_HOST_URL
    

    socket.value = new WebSocket(
      `${host}/app/${appKey}?protocol=7&client=js&version=4.3.0`
    )
    socket.value.onopen = () => {
      isConnected.value = true
      subscribeToChannel('classroom-chat')
    }

    socket.value.onmessage = (event) => {
      const payload = JSON.parse(event.data)
      if (payload.event === 'client-message' || payload.event === 'App\\Events\\MessageSent') {
        const messageData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data
        
        if (messages.value.some(m => m.id === messageData.id)) return

        messages.value.push(messageData)
      }
    }

    socket.value.onclose = () => {
      isConnected.value = false
      socket.value = null
      setTimeout(() => connectWebSocket(), 3000)
    }
  }

  const disconnectWebSocket = () => {
  if (socket.value) {
    socket.value.close() // Manually close the connection
    socket.value = null
    isConnected.value = false
    console.log('Disconnected from Reverb')
  }
}

  const subscribeToChannel = (channelName) => {
    if (!socket.value) return
    socket.value.send(JSON.stringify({
      event: 'pusher:subscribe',
      data: { channel: channelName }
    }))
  }

  // Return everything so your components can use it
  return {
    messages,
    isConnected,
    getChats,
    sendChat,
    connectWebSocket,
    disconnectWebSocket
  }
})