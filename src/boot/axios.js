import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Loading, QSpinnerGears } from 'quasar'
import { userAuthStore } from 'src/stores/login/auth'

const api = axios.create({ 
  baseURL: import.meta.env.VITE_QUASAR_API_URL || 'https://laravel-lms-backend.onrender.com/api'
})

export default boot(({ app, router }) => {
  // --- REQUEST INTERCEPTOR ---
  api.interceptors.request.use(async (config) => {
    // Show Loading
    Loading.show({
      spinner: QSpinnerGears,
      message: 'Loading. Please wait...'
    })

    // Testing timeout (Remove after testing)
    // await new Promise(resolve => setTimeout(resolve, 2000))

    // Auth Token logic
    const authStore = userAuthStore()
    const token = authStore.token || localStorage.getItem('token') 

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }, (error) => {
    Loading.hide()
    return Promise.reject(error)
  })

  // --- RESPONSE INTERCEPTOR ---
  api.interceptors.response.use(
    (response) => {
      Loading.hide()
      return response
    },
    (error) => {
      Loading.hide()
      
      if (error.response?.status === 401) {
        const authStore = userAuthStore()
        authStore.logout()
        router.push('/login')
      }
      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }