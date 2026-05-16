<template>
  <q-page padding>
    <StudentAssignmentsPage v-if="userRole === 'student'" />

    <TeacherAssignmentsPage v-else-if="userRole === 'teacher' || userRole === 'admin'" />

    <div v-else class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { currUserStore } from 'src/stores/user/user'
import TeacherAssignmentsPage from './TeacherAssignmentsPage.vue'
import StudentAssignmentsPage from './StudentAssignmentsPage.vue'

const authStore = currUserStore()

const userRole = computed(() => {
  return authStore.userData.role.toLowerCase() || null
})
</script>