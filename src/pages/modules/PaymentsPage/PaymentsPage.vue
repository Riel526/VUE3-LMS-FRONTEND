<template>
  <q-page padding>
    <div class="row q-mb-md items-center q-gutter-md">
      <div class="text-h5 text-weight-bold text-primary">Tuition Payment</div>
      <q-space />
    </div>

    <q-card flat bordered class="q-pa-lg" style="max-width: 400px">
      <div class="text-h6 q-mb-md">Semester Tuition Fee</div>
      <div class="text-subtitle1 text-grey-7 q-mb-md">Amount: $500.00 USD</div>
      
      <!-- Student Selector Added Here -->
      <q-select
        v-model="selectedStudentId"
        :options="rows"
        label="Select Student to Enroll"
        option-value="student_id"
        :option-label="(item) => item ? `${item.first_name} ${item.last_name} (${item.email})` : ''"
        emit-value
        map-options
        outlined
        dense
        class="q-mb-lg"
      />

      <q-btn 
        color="primary" 
        icon="payment" 
        label="Proceed to Stripe Checkout" 
        class="full-width" 
        :loading="storePayment.loading"
        :disabled="!selectedStudentId"
        @click="handleCheckout"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { paymentStore } from 'src/stores/modules/Payments/payments'
import { studentsStore } from 'src/stores/modules/StudentsManagement/students'
import { renderToast } from 'src/utils/notify'

const storePayment = paymentStore()
const selectedStudentId = ref(null)
const rows = ref ([])
const storeStudents = studentsStore()

const fetchStudents = async () => {
  try {
    const res = await storeStudents.getAllStudents()
    rows.value = res
    console.log(rows)
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

const handleCheckout = async () => {
    if (!selectedStudentId.value) {
        renderToast('error', 'Validation', 'Please select a student first.')
        return
    }
    const payload = {
      student_id: selectedStudentId.value
    }
    const res = await storePayment.createCheckoutSession(payload)

    const checkoutUrl = res?.data?.url || res?.url
    console.log('haha', res)

    if (checkoutUrl) {
        window.location.href = checkoutUrl
    } else {
        renderToast('error', 'Checkout Failed', res?.message || 'Unable to generate checkout session.')
    }
}

onMounted(() => {
  fetchStudents()
})
</script>