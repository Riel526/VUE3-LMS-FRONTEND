<template>
  <q-card style="width: 1000px; max-width: 95vw;">
    <q-card-section class="bg-primary text-white row items-center">
      <div class="text-h6">Enroll New Student</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-form @submit.prevent="submitForm">
      <q-card-section>
        <div class="text-overline text-primary">Personal Information</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input v-model="form.first_name" label="First Name" outlined dense :rules=requiredRules />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.middle_name" label="Middle Name" outlined dense />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.last_name" label="Last Name" outlined dense :rules=requiredRules />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.email" label="Email" outlined dense :rules=emailRules />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.birth_date" label="Birth Date" outlined dense mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.birth_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-overline text-primary">Academic Details</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
             <q-input v-model="form.lrn" label="LRN (Learner Reference Number)" outlined dense mask="##########" :rules=LRNRules />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.grade_level" :options="['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']" label="Grade Level" outlined dense />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.section" :options="['A', 'B', 'C']" label="Section" outlined dense />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2 q-pa-md">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Save Student" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive } from 'vue'
import { studentsStore } from 'src/stores/modules/StudentsManagement/students'
import { renderToast } from 'src/utils/notify'

const emit = defineEmits(['saved'])
const store = studentsStore()

const form = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  lrn: '',
  grade_level: '',
  section: '',
  is_active: true,
  birth_date: ''
})

const requiredRules = [
	val => !!val || 'This Field is required',
  val => val && val.length >= 2 || 'The Input must be atleast 2 characters'
]

const LRNRules = [
	val => !!val || 'This Field is required',
  val => val && val.length === 10 || 'The Input should only have 10 characters'
]

const emailRules = [
	val => !!val || 'Email is required',
  val => val && val.length >= 5 || 'Email must be atleast 4 characters',
	val => {
		const atIndex = val.indexOf('@');
  	const dotIndex = val.lastIndexOf('.');
  
		// Check if there is a character after the dot (e.g., .com)
		const hasCharAfterDot = dotIndex > 0 && dotIndex < val.length - 1;

		// At least one character BETWEEN @ and .?
		const hasDomainBetween = dotIndex > atIndex + 1;
		// has characters before @
		const hasCharBeforeAt = atIndex > 0

		return (hasCharBeforeAt && hasCharAfterDot && hasDomainBetween) || 'Enter a valid email (e.g., user@domain.com)';
  }
]


const submitForm = async () => {
  try {
    const res = await store.addStudent(form)

    if (res.code === 201) {
      renderToast('success', `Success (${res.code})`, res.message || 'Student Added Successfully')
      emit('saved')
    } else {
      renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful Addition of Student')
    }
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}
</script>