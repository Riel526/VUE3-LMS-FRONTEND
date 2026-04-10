import { defineStore, acceptHMRUpdate } from 'pinia'

export const currUserStore = defineStore('currUser', {
  state: () => ({
    currUser: []
  }),

  actions: {
    async setCurrUser(data) {
      this.currUser = data
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(currUserStore, import.meta.hot))
}
