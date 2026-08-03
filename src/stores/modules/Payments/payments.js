import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const paymentStore = defineStore('paymentStore', {
    actions: {
        async createCheckoutSession(payload) {
            try {
                const response = await api.post('api/payment/checkout', payload)
                return response.data
            } catch (error) {
                console.error(error)
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
    import.meta.hot.accept(acceptHMRUpdate(paymentStore, import.meta.hot))
}