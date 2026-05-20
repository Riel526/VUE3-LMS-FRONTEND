import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'


export const assignmentsStore = defineStore('assignmentsStore', {
  state: () => ({
    form: {
      teacher_id: null,
      subject_id: null,
      grade_level: '',
      section: '',
      title: '',
      instructions: '',
      due_date: '',
      questions: [
        {
          type: 'identification',
          question_text: '',
          correct_answer: '',
          options: [],
          points: 1
        }
      ]
    }
  }),

  actions: {
    async addAssignment(payload) {
      try {
        const response = await api.post('api/assignments/add-assignment', payload)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async getAssignments () {
      try {
        const response = await api.post('api/assignments/get-assignments')
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async getAssignmentById(id) {
      try {
        const response = await api.get(`api/assignments/get-assignment/${id}`)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async updateAssignment (id, payload) {
      try {
        const response = await api.put(`api/assignments/update-assignment/${id}`, payload)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async deleteAssignment (id) {
      try {
        const response = await api.delete(`api/assignments/delete-assignment/${id}`)
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },


    // Students
    async getStudentAssignments () {
      try {
        const response = await api.post('api/assignments/get-student-assignment')
        return response.data
      } catch (error) {
        return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server connection failed'
        }
      }
    },

    async submitAnswers (payload) {
      try {
        const response = await api.post('api/assignments/submit-assignment', payload)
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
  import.meta.hot.accept(acceptHMRUpdate(assignmentsStore, import.meta.hot))
}
