import { defineStore, acceptHMRUpdate } from 'pinia'
import { renderToast } from 'src/utils/notify'
import { api } from 'src/boot/axios'
import { fasBullseye } from '@quasar/extras/fontawesome-v6'


export const userAuthStore = defineStore('auth', {
  state: () => ({
    user: '',
    loading: fasBullseye
  }),

  actions: {
    async loginUser(credentials) {
      this.loading = true
      try {
        const response = await api.post('/login', credentials)
        
        this.user = response.data.user

        renderToast('success', 'Login Success', 'Logged in Successfully')
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed'
        renderToast('error', 'Error', message)
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userAuthStore, import.meta.hot))
}
