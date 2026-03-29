import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const registerStore = defineStore('register', {
  actions: {
    async registerUser(data) {
      try {
        const res = await api.post('/auth/register', data)
        return res
      } catch (e) {
        return e.response
      }
    }
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(registerStore, import.meta.hot))
}