<template>
  <q-card style="width: 1000px; max-width: 95vw;">
    <q-card-section class="bg-primary text-white row items-center">
      <div class="text-h6">Add New Teacher</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-form @submit.prevent="submitForm">
      <q-card-section>
        <div class="text-overline text-primary">Personal Information</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input v-model="form.first_name" label="First Name" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.middle_name" label="Middle Name" outlined dense />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.last_name" label="Last Name" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.email" label="Email" outlined dense :rules="emailRules" />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="form.birth_date" label="Birth Date" outlined dense mask="date" :rules="['date', val => !!val || 'Birth date is required']">
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

        <div class="text-overline text-primary">Professional Details</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
             <q-input v-model="form.specialization" label="Specialization" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
             <q-input v-model="form.employee_id" label="Employee ID" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.department" :options="deptOptions" label="Department" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.status" :options="['Full-time', 'Part-time', 'Contractual']" label="Status" outlined dense :rules="requiredRules" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2 q-pa-md">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Save Teacher" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive } from 'vue'
import { teachersStore } from 'src/stores/modules/TeachersManagement/teachers'
import { renderToast } from 'src/utils/notify'

const emit = defineEmits(['saved'])
const store = teachersStore()

const form = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  birth_date: '',
  specialization: '',
  department: '',
  status: '',
  is_active: true
})

const deptOptions = [
  'English/Language Arts', 
  'Mathematics', 
  'Science', 
  'Social Studies', 
  'MAPEH', 
  'Technology & Livelihood Education', 
  'Foreign Languages', 
  'Guidance Department'
]

const requiredRules = [
  val => !!val || 'This Field is required',
  val => (val && val.length >= 2) || 'The Input must be atleast 2 characters'
]

const emailRules = [
  val => !!val || 'Email is required',
  val => (val && val.length >= 5) || 'Email must be atleast 4 characters',
  val => {
    const atIndex = val.indexOf('@');
    const dotIndex = val.lastIndexOf('.');
    const hasCharAfterDot = dotIndex > 0 && dotIndex < val.length - 1;
    const hasDomainBetween = dotIndex > atIndex + 1;
    const hasCharBeforeAt = atIndex > 0
    return (hasCharBeforeAt && hasCharAfterDot && hasDomainBetween) || 'Enter a valid email (e.g., user@domain.com)';
  }
]

const submitForm = async () => {
  try {
    const res = await store.addTeacher(form)

    if (res.code === 201) {
      renderToast('success', `Success (${res.code})`, res.message || 'Teacher Added Successfully')
      emit('saved')
    } else {
      renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful Addition of Teacher')
    }
  } catch (err) {
    renderToast('error', 'Action Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}
</script>