import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const paymentStore = defineStore('paymentStore', {
    state: () => ({
        loading: false
    }),
    actions: {
        async createCheckoutSession() {
            this.loading = true
            try {
                const response = await api.post('api/payment/checkout')
                return response.data
            } catch (error) {
                console.error(error)
                return {
                    success: false,
                    status: error.response?.status || 500,
                    message: error.response?.data?.message || 'Server connection failed'
                }
            } finally {
                this.loading = false
            }
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(paymentStore, import.meta.hot))
}