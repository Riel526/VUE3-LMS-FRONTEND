<template>
  <q-page padding>
    <div class="row q-mb-md items-center q-gutter-md">
      <div class="text-h5 text-weight-bold text-primary">Tuition Payment</div>
      <q-space />
    </div>

    <q-card flat bordered class="q-pa-lg" style="max-width: 400px">
      <div class="text-h6 q-mb-md">Semester Tuition Fee</div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg">Amount: $500.00 USD</div>
      
      <q-btn 
        color="primary" 
        icon="payment" 
        label="Proceed to Stripe Checkout" 
        class="full-width" 
        :loading="storePayment.loading"
        @click="handleCheckout"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { paymentStore } from 'src/stores/modules/Payments/payments'
import { renderToast } from 'src/utils/notify'

const storePayment = paymentStore()

const handleCheckout = async () => {
    const res = await storePayment.createCheckoutSession()

    if (res.status === 'success' || res.data?.url) {
        const checkoutUrl = res.data?.url || res.url
        window.location.href = checkoutUrl
    } else {
        renderToast('error', 'Checkout Failed', res.message || 'Unable to generate checkout session.')
    }
}
</script>