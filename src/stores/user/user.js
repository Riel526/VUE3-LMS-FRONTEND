import { defineStore, acceptHMRUpdate } from 'pinia'

export const currUserStore = defineStore('currUser', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),


  actions: {
    async setCurrUser(data) {
      this.userData = data.user
      this.token = data.token
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },

    logout() {
      this.token = null
      this.userData = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(currUserStore, import.meta.hot))
}
