<template>
  <q-page padding class="bg-grey-1">
    <div class="row q-col-gutter-md items-center q-mb-lg">
      <div class="col-12 col-md-auto">
        <div class="text-h4 text-weight-bold text-primary">My Assignments</div>
        <div class="text-subtitle2 text-grey-7">Track your progress and upcoming deadlines</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="bg-white">
          <q-item>
            <q-item-section avatar>
              <q-icon name="pending_actions" color="accent" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">{{ pendingCount }}</q-item-label>
              <q-item-label caption>To Do</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div 
        v-for="assignment in assignments" 
        :key="assignment.assignment_id" 
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="assignment-card full-height column">
          <q-card-section>
            <div class="row justify-between items-start no-wrap">
              <div class="text-h6 q-mb-xs">{{  assignment.subject?.name }}</div>
              <q-chip 
                :color="getStatusColor(assignment)" 
                text-color="white" 
                size="sm" 
                dense
              >
                {{ getStatusLabel(assignment) }}
              </q-chip>
            </div>
            <div class="text-caption text-grey-7 row items-center">
              <q-icon name="book" size="xs" class="q-mr-xs" />
              {{ assignment.subject?.category || 'No Subject' }}
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="col">
            <div class="text-body2 text-grey-8 ellipsis-3-lines">
              {{ assignment.instructions || 'No instructions provided.' }}
            </div>
          </q-card-section>

          <q-card-actions align="between" class="q-pa-md">
            <div class="column">
              <span class="text-caption text-grey-6">Due Date:</span>
              <span class="text-caption text-weight-medium">{{ formatDate(assignment.due_date) }}</span>
            </div>
            
            <q-btn 
              unelevated 
              :color="isCompleted(assignment) ? 'secondary' : 'primary'" 
              :label="isCompleted(assignment) ? 'View Result' : 'Start Now'" 
              :icon-right="isCompleted(assignment) ? 'visibility' : 'play_arrow'"
              @click="handleAction(assignment)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { assignmentsStore } from 'src/stores/modules/Assignments/assignments'
import { date } from 'quasar'

const router = useRouter()
const store = assignmentsStore()
const assignments = ref([])

const pendingCount = computed(() => {
  return assignments.value.filter(a => !a.completed).length
})

const getStatusColor = (a) => a.completed ? 'positive' : 'accent'
const getStatusLabel = (a) => a.completed ? 'Completed' : 'Pending'
const isCompleted = (a) => a.completed

const formatDate = (val) => date.formatDate(val, 'MMM DD, YYYY, HH:mm')

const handleAction = (assignment) => {
  if (isCompleted(assignment)) {
    router.push(`/student/results/${assignment.assignment_id}`)
  } else {
    router.push(`/student/take-assignment/${assignment.assignment_id}`)
  }
}

onMounted(async () => {
  assignments.value = await store.getStudentAssignments()
})
</script>

<style scoped>
.assignment-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
}
.assignment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}
</style>