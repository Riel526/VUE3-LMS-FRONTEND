import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const teachersStore = defineStore('teachersStore', {
  state: () => ({
    teacherData: null
  }),
  actions: {
    async getAllTeachers() {
      try {
        const response = await api.get('api/teachers/get-teachers')
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async addTeacher(payload) {
      try {
        const response = await api.post('api/students/add-student', payload)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async updateTeacher(id, payload) {
      try {
        const response = await api.put(`api/students/update-student/${id}`, payload)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async deleteTeacher(id, payload) {
      try {
        const response = await api.delete(`api/students/delete-student/${id}`, payload)
        return response.data
      } catch (error) {
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
  import.meta.hot.accept(acceptHMRUpdate(teachersStore, import.meta.hot))
}
