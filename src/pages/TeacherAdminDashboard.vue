<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg text-weight-bold">Dashboard Overview</div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card class="bg-primary text-white q-pa-md shadow-5">
          <q-item>
            <q-item-section avatar>
              <q-icon name="groups" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">Total Students</q-item-label>
              <q-item-label class="text-h4 text-weight-bolder">1,240</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-secondary text-white q-pa-md shadow-5">
          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">Active Accounts</q-item-label>
              <q-item-label class="text-h4 text-weight-bolder">98%</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-accent text-white q-pa-md shadow-5">
          <q-item>
            <q-item-section avatar>
              <q-icon name="trending_up" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">School Average GWA</q-item-label>
              <q-item-label class="text-h4 text-weight-bolder">1.75</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Recent Student Registrations</div>
          </q-card-section>
          <q-separator />
          </q-card>
      </div>
      
      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Quick Actions</div>
          </q-card-section>
          <q-list separator>
            <q-item clickable v-ripple to="/students">
              <q-item-section avatar><q-icon name="person_add" color="primary" /></q-item-section>
              <q-item-section>Enroll New Student</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar><q-icon name="print" color="grey-7" /></q-item-section>
              <q-item-section>Generate Reports</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>


<script setup>

import { onMounted, ref } from 'vue'
import { studentsStore } from 'src/stores/modules/StudentsManagement/students'
import { renderToast } from 'src/utils/notify'
// import { computed } from 'vue'
// import { currUserStore } from 'src/stores/user/user'

// const userStore = currUserStore()

// const userData = computed(() => {
//   return userStore.userData})

const students = ref('')

const storeStudents = studentsStore()

const getAllStudents = async () => {
  try {
    const res = await storeStudents.getAllStudents()
    students.value = res
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

onMounted(() => {
  getAllStudents()
})
</script>