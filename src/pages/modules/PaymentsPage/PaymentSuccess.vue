<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered class="q-pa-xl text-center" style="max-width: 500px">
      <q-icon name="check_circle" color="positive" size="80px" class="q-mb-md" />
      <div class="text-h5 text-weight-bold q-mb-sm">Payment Successful!</div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg">
        Thank you for your payment. Your transaction has been completed successfully.
      </div>
      
      <div v-if="sessionId" class="text-caption text-grey-5 q-mb-lg ellipsis">
        Session ID: {{ sessionId }}
      </div>

      <q-btn 
        color="primary" 
        label="Return to Dashboard" 
        to="/dashboard" 
        class="full-width"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const sessionId = route.query.session_id
</script>