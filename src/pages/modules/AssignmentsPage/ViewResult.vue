<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto" style="max-width: 800px;">
      
      <q-btn flat color="primary" icon="arrow_back" label="Back to Assignments" to="/assignments" class="q-mb-md" />

      <q-card flat bordered class="q-mb-lg text-center q-pa-lg bg-white text-dark">
        <div class="text-subtitle1 text-uppercase text-weight-bold text-grey-7">{{ result.subject }}</div>
        <div class="text-h4 text-weight-bolder q-mt-xs">{{ result.title }}</div>
        
        <q-separator class="q-my-md" />

        <div class="column items-center q-my-md">
          <q-circular-progress
            show-value
            class="text-weight-bold text-h5"
            :value="scorePercentage"
            size="120px"
            :thickness="0.2"
            :color="scoreColor"
            track-color="grey-3"
          >
            {{ result.total_score }} / {{ result.max_score }}
          </q-circular-progress>
          <div class="text-subtitle2 q-mt-sm text-grey-8 text-weight-medium">
            Submitted on {{ formatDate(result.completed_at) }}
          </div>
        </div>
      </q-card>

      <div class="text-h6 q-mb-md text-weight-bold">Review Your Answers</div>
      
      <q-card flat bordered v-for="(question, index) in result.questions" :key="question.id" class="q-mb-md bg-white text-dark">
        <q-card-section>
          <div class="text-weight-bold text-subtitle1">
            Question {{ index + 1 }} <span class="text-caption text-grey-7 q-ml-sm">({{ question.points }} pts)</span>
          </div>
          <div class="q-mt-sm text-body1">{{ question.question_text }}</div>
          
          <q-separator class="q-my-sm" inset />

          <div class="q-mt-md q-gutter-sm">
            <div class="q-pa-sm rounded-borders text-weight-medium" :class="getAnswerClass(question)">
              Your Answer: {{ getUserAnswer(question.id) }}
            </div>
            
            <div v-if="!isCorrect(question)" class="q-pa-sm bg-green-1 text-green-9 rounded-borders text-weight-medium">
              Correct Answer: {{ question.correct_answer }}
            </div>
          </div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { date } from 'quasar'
import { assignmentsStore } from 'src/stores/modules/Assignments/assignments'

const route = useRoute()
const store = assignmentsStore()
const result = ref({
  title: '',
  subject: '',
  total_score: 0,
  max_score: 0,
  completed_at: '',
  answers_snapshot: {},
  questions: []
})

onMounted(async () => {
  const assignmentId = route.params.id
  const response = await store.viewResult(assignmentId)
  result.value = response
})

const scorePercentage = computed(() => {
  if (!result.value.max_score) return 0
  return (result.value.total_score / result.value.max_score) * 100
})

const scoreColor = computed(() => {
  return scorePercentage.value >= 75 ? 'positive' : scorePercentage.value >= 50 ? 'warning' : 'negative'
})

const getUserAnswer = (questionId) => {
  const questions = JSON.parse(result.value.answers_snapshot)
  const findQuestion = questions.find(item => item.question_id === questionId)
  return findQuestion.student_answer || 'No answer submitted'
}

const isCorrect = (question) => {
  const userAnswer = getUserAnswer(question.id)
  return String(userAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase()
}

const getAnswerClass = (question) => {
  return isCorrect(question) ? 'bg-green-1 text-green-9' : 'bg-red-1 text-red-9'
}

const formatDate = (val) => {
  if (!val) return ''
  return date.formatDate(val, 'MMM DD, YYYY hh:mm A')
}
</script>