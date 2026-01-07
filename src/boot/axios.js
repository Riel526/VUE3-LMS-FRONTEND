import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Loading, QSpinnerGears } from 'quasar'
import { userAuthStore } from 'src/stores/auth' // Ensure name matches your export

const api = axios.create({ 
  baseURL: import.meta.env.VITE_QUASAR_API_URL_LOCAL 
})

export default boot(({ app }) => {
  // --- REQUEST INTERCEPTOR ---
  api.interceptors.request.use(async (config) => {
    // 1. Show Loading
    Loading.show({
      spinner: QSpinnerGears,
      message: 'Loading. Please wait...'
    })

    // Testing timeout (Remove after testing)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 3. Auth Token logic
    const authStore = userAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
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
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }