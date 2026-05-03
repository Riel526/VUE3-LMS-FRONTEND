import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const scheduleStore = defineStore('scheduleStore', {
  state: () => ({
    scheduleData: null
  }),
  actions: {
    async getSchedule() {
      try {
        const response = await api.get('api/schedule/get-schedule')
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    // async addTeacher(payload) {
    //   try {
    //     const response = await api.post('api/teachers/add-teacher', payload)
    //     return response.data
    //   } catch (error) {
    //     return {
    //     success: false,
    //     status: error.response?.status || 500,
    //     message: error.response?.data?.message || 'Server connection failed'
    //     }
    //   }
    // },

    // async updateTeacher(id, payload) {
    //   try {
    //     const response = await api.put(`api/teachers/update-teacher/${id}`, payload)
    //     return response.data
    //   } catch (error) {
    //     return {
    //     success: false,
    //     status: error.response?.status || 500,
    //     message: error.response?.data?.message || 'Server connection failed'
    //     }
    //   }
    // },

    // async deleteTeacher(id, payload) {
    //   try {
    //     const response = await api.delete(`api/teachers/delete-teacher/${id}`, payload)
    //     return response.data
    //   } catch (error) {
    //     return {
    //     success: false,
    //     status: error.response?.status || 500,
    //     message: error.response?.data?.message || 'Server connection failed'
    //     }
    //   }
    // },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(scheduleStore, import.meta.hot))
}
