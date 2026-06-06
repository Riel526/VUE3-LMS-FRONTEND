import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const subjectsStore = defineStore('subjectsStore', {
  state: () => ({
    subjects: [],
    subjectData: null
  }),
  actions: {
    async getAllSubjects() {
      try {
        const response = await api.get('api/subjects/get-subjects')
        this.subjects = response.data.data
        return response.data
      } catch (error) {
        console.error(error)
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async addSubject(payload) {
      try {
        const response = await api.post('api/subjects/add-subject', payload)
        return response.data
      } catch (error) {
        console.error(error)
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async updateSubject(id, payload) {
      try {
        const response = await api.post(`api/subjects/update-subject/${id}`, payload)
        return response.data
      } catch (error) {
        console.error(error)
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async deleteSubject(id, payload) {
      try {
        const response = await api.delete(`api/subjects/delete-subject/${id}`, payload)
        return response.data
      } catch (error) {
        console.error(error)
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(subjectsStore, import.meta.hot))
}
