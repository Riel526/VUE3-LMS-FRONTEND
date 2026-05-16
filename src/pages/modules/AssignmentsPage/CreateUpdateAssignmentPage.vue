<template>
  <q-page padding>
    <div class="row q-mb-md items-center q-gutter-sm">
      <q-btn icon="arrow_back" flat round @click="$router.go(-1)" />
      <div class="text-h5 text-weight-bold text-primary">
        {{ isEdit ? 'Update' : 'Create' }} Assignment
      </div>
      <q-space />
      <q-btn 
        color="primary" 
        :label="isEdit ? 'Update Assignment' : 'Save Assignment'" 
        icon="save" 
        @click="handleSave"
      />
      <q-btn color="secondary" label="Add Question" icon="add" split @click="addQuestion('identification')"/>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section class="text-subtitle1 text-weight-bold">
            General Information
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row q-mb-md">
            <q-input v-model="store.form.title" label="Title" outlined dense class="col-12" />
            </div>
            <div class="row q-mb-md">
              <q-select 
                class="col-12"
                v-model="store.form.subject_id" 
                :options="subjectOptions" 
                label="Subject" 
                option-value="subject_id"
                option-label="name"
                emit-value
                map-options
                outlined 
                dense 
              />
            </div>
            <div class="row q-col-gutter-sm q-mb-md">
              <q-select v-model="store.form.grade_level" label="Grade" :options="gradeLevelOptions" emit-value map-options outlined dense class="col-6"/>
              <q-select v-model="store.form.section" label="Section" :options="['A', 'B', 'C']" outlined dense class="col-6" />
            </div>
            <div class="row q-col-gutter-sm q-mb-md">
              <q-input v-model="store.form.due_date" type="datetime-local" label="Due Date" stack-label outlined dense class="col-12" />
            </div>
            <div class="row q-col-gutter-sm q-mb-md">
              <q-input v-model="store.form.instructions" type="textarea" label="Instructions" outlined dense rows="3" class="col-12" />
            </div>
            
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">

        <div v-if="store.form.questions.length === 0" class="text-center q-pa-xl border-dashed">
          <q-icon name="quiz" size="50px" color="grey-5" />
          <div class="text-grey-7">No questions added yet.</div>
        </div>

        <q-card v-for="(q, index) in store.form.questions" :key="index" flat bordered class="q-mb-md">
          <q-card-section class="row items-center q-pb-none">
            <q-badge color="primary">Question # {{ index + 1 }}</q-badge>
            <q-space />
            <q-btn icon="delete" flat round color="negative" size="sm" @click="removeQuestion(index)" />
          </q-card-section>

          <q-card-section class="q-gutter-sm">
            <div class="row q-col-gutter-sm">
              <q-select 
                v-model="q.type" 
                :options="[
                  { label: 'Identification', value: 'identification' },
                  { label: 'Multiple Choice', value: 'multiple_choice' },
                  { label: 'Essay', value: 'essay' }
                  ]" 
                label="Type" 
                outlined dense class="col-md-4 col-12" 
                emit-value
                map-options
              />
              <q-input v-model.number="q.points" type="number" label="Points" outlined dense class="col-md-2 col-12" />
            </div>

            <q-input v-model="q.question_text" label="Question Text" outlined dense type="textarea" autogrow />

            <div v-if="q.type === 'multiple_choice'" class="q-mt-sm bg-grey-1 q-pa-sm rounded-borders">
               <div v-for="(opt, optIdx) in q.options" :key="optIdx" class="row items-center q-gutter-xs q-mb-xs">
                 <q-radio v-model="q.correct_answer" :val="opt" dense color='positive'> <q-tooltip>Mark as correct</q-tooltip> </q-radio>
                 <q-input v-model="q.options[optIdx]" placeholder="Option text" dense outlined class="col" />
                 <q-btn icon="close" flat round size="xs" @click="q.options.splice(optIdx, 1)" />
               </div>
               <q-btn label="Add Option" icon="add" flat dense color="primary" size="sm" @click="q.options.push('')" />
            </div>

            <q-input 
              v-if="q.type === 'identification'" 
              v-model="q.correct_answer" 
              label="Correct Answer" 
              outlined dense color="positive" 
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { assignmentsStore } from 'src/stores/modules/Assignments/assignments'
import { currUserStore } from 'src/stores/user/user'
import { renderToast } from 'src/utils/notify'
import { subjectsStore } from 'src/stores/modules/SubjectsManagement/subjects'

const route = useRoute()
const router = useRouter()
const store = assignmentsStore()
const userStore = currUserStore()
const subjectStore = subjectsStore()

const isEdit = computed(() => !!route.params.id)
const subjectOptions = ref([])


const gradeLevelOptions = ref([
  {label: 'Grade 7', value: '7' },
  {label: 'Grade 8', value: '8' },
  {label: 'Grade 9', value: '9' },
  {label: 'Grade 10', value: '10' },
  {label: 'Grade 11', value: '11' },
  {label: 'Grade 12', value: '12' }
  
])

const addQuestion = (type) => {
  store.form.questions.push({
    type: type,
    question_text: '',
    correct_answer: '',
    options: type === 'multiple_choice' ? ['', ''] : [],
    points: 1
  })
}

const removeQuestion = (index) => {
  store.form.questions.splice(index, 1)
}

const handleSave = async () => {
  try {

    store.form.teacher_id = userStore.userData.id

    const res = isEdit.value 
      ? await store.updateAssignment(route.params.id, store.form)
      : await store.addAssignment(store.form)

    if (res.code === 200 || res.code === 201) {
      renderToast('success', 'Success', res.message)
      router.push('/assignments')
    } else {
       renderToast('error', 'Error', res.message)
    }
  } catch (err) {
    renderToast('error', 'Error', err.message || 'Save failed')
  }
}

onMounted(async () => {
  if (route.params.id) {
    const data = await store.getAssignmentById(route.params.id)
    store.form = data
  } else {
    store.form = {
      teacher_id: null,
      subject_id: null,
      grade_level: '',
      section: '',
      title: '',
      instructions: '',
      due_date: '',
      questions: [
        {
          type: 'identification',
          question_text: '',
          correct_answer: '',
          options: [],
          points: 1
        }
      ]
    }
  }

  await subjectStore.getAllSubjects();
  subjectOptions.value = subjectStore.subjects

})
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #ccc;
  border-radius: 8px;
}
</style>