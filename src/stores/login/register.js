import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const registerStore = defineStore('register', {
  state: () => ({
    showModal: false,
    form: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      middleName: '',
      lastName: '',
      role: 'student',
      birthDate: ''
    }
  }),
  actions: {
    resetForm() {
      this.form.username = ''
      this.form.email = ''
      this.form.password = ''
      this.form.confirmPassword = ''
      this.form.firstName = ''
      this.form.middleName = ''
      this.form.lastName = ''
      this.form.role = 'student'
      this.form.birthDate = 'student'
    },
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