<template>
  <q-page padding>
    
    <div class="q-mb-lg row justify-between items-center">
      <div>
        <h4 class="text-h4 q-my-none text-weight-bold">
          Static Assignment Title
        </h4>
        <p class="text-subtitle1 text-grey-7 q-mb-none">
          Grade 7 - Section A
        </p>
      </div>
      <q-btn 
        flat 
        color="grey-7" 
        icon="arrow_back" 
        label="Back to Dashboard" 
        @click="showModal(true)" 
      />
    </div>

    <q-form class="q-gutter-y-md" @submit.prevent="showModal(true, 'submit')">
      
      <q-card flat bordered v-for="(question, index) in questions" :key="question.id">
        <q-card-section class="bg-grey-1">
          <div class="text-subtitle1 text-weight-medium">
            <q-badge color="primary" class="q-mr-sm">Question {{ index + 1 }}</q-badge>
            {{ question.question_text }}
          </div>
        </q-card-section>

        <q-card-section>
          <div v-if="question.type === 'multiple_choice'" class="column q-gutter-y-sm">
            <q-radio v-for="(option, optIndex) in question.options" 
            :key='optIndex' 
            :val="option" 
            :label="option"
            v-model="formData[question.id]"
            />
          </div>
          <div v-else-if="question.type === 'identification' || question.type === 'essay'">
            <q-input
              outlined
              v-model="formData[question.id]"
              dense
              placeholder="Type your answer here..."
            />
          </div>
        </q-card-section>
      </q-card>

      <div class="row justify-end q-mt-lg">
        <q-btn 
          type="submit" 
          color="primary" 
          label="Submit Answers" 
          icon="send"
          size="large"
          @click="showModal(true, 'submit')"
        />
      </div>
    </q-form>
      <q-dialog v-model="confirmationModal" persistent transition-show="scale" transition-hide="scale">
      <ConfirmationModal 
      :title="modalContext.title"
      :message="modalContext.message"
      :data="modalContext.data"
      @proceed="executeAction"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { assignmentsStore } from 'src/stores/modules/Assignments/assignments'
import ConfirmationModal from 'src/components/Global/ConfirmationModal.vue'
import { renderToast } from 'src/utils/notify'

const store = assignmentsStore()
const questions = ref([])
const route = useRoute()
const router = useRouter()
const formData = ref({})
const confirmationModal = ref(false)

const modalContext = ref({
  title: '',
  message: '',
})


const showModal = (condition, type) => {
confirmationModal.value = condition
  if (type === 'submit') {
    const partial = questions.value.some(q => !formData.value[q.id] || formData.value[q.id].trim() === '')
    if (partial) {
      renderToast('error', 'Form Error', 'Answer all of the questions.')
      confirmationModal.value = false
      return
    }
      modalContext.value = {
        title: 'Submit Assignment',
        message: `Are you sure you sure want to submit your answers?`,
        data: {
            assignment_id: Number(route.params.id),
            answers: formData.value
          }
      }

  } else {
      modalContext.value = {
        title: 'Back to Dashboard',
        message: `Are you sure you want to leave this page? The Assignment will submit automatically.`
      }
  }
  }

  const executeAction = async (data) => {
    if (data) {
    try {
      const res = await store.submitAnswers(data)

      if (res.code === 200) {
        renderToast('success', `Success (${res.code})`, res.message || 'Assignment Submitted Successfully')
        showModal(false)
        router.push('/assignments')
      } else {
        renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful submission of assignment')
      }
    } catch (err) {
      console.error(err)
      renderToast('error', 'Failed', err.message || 'Something went wrong. Please refresh the page and try again')
    }
    } else {
      router.push('/dashboard')
    }
  }

onMounted(async () => {
  const res = await store.getAssignmentById(route.params.id)
  questions.value = res.questions
  if (res.questions) {
    res.questions.forEach(q => {
      formData.value[q.id] = ''
    })
  }
})

</script>