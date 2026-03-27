import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'


export const userAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async loginUser(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        
        this.user = response.data.user
        this.token = response.data.token

        localStorage.setItem('token', this.token)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userAuthStore, import.meta.hot))
}
