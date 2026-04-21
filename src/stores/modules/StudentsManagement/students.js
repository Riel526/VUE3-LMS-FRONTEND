import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const studentsStore = defineStore('studentsStore', {
  state: () => ({
    studentData: null
  }),
  actions: {
    async getAllStudents() {
      try {
        const response = await api.get('/students/get-students')
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async addStudent(payload) {
      try {
        const response = await api.post('/students/add-student', payload)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async updateStudent(id, payload) {
      try {
        const response = await api.put(`/students/update-student/${id}`, payload)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(studentsStore, import.meta.hot))
}
