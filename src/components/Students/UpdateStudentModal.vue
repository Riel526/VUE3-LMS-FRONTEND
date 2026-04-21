<template>
  <q-card style="width: 1000px; max-width: 95vw;">
    <q-card-section class="bg-primary text-white row items-center">
      <div class="text-h6">Update Student Information</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-form @submit.prevent="submitForm">
      <q-card-section class="q-gutter-y-md">
        
        <div class="text-overline text-primary">Personal Information</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input v-model="form.first_name" label="First Name" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.middle_name" label="Middle Name" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.last_name" label="Last Name" outlined dense :rules="requiredRules" />
          </div>
          
          <div class="col-12 col-md-4">
            <q-input v-model="form.birth_date" label="Birth Date" outlined dense mask="####-##-##" :rules="requiredRules">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.birth_date" mask="YYYY-MM-DD">
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

        <q-separator />

        <div class="text-overline text-primary">Academic Details</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
             <q-input v-model="form.lrn" label="LRN" outlined dense mask="##########" :rules="LRNRules" />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.grade_level" :options="gradeOptions" label="Grade Level" outlined dense />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.section" :options="['A', 'B', 'C']" label="Section" outlined dense />
          </div>
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="form.email" label="Email Address" outlined dense type="email" />
          </div>
          <div class="col-12 col-md-6 flex items-center">
            <q-toggle v-model="form.is_active" label="Account Status (Active)" color="positive" />
          </div>
        </div>

        <q-separator />
        <div class="text-overline text-primary">Academic Performance</div>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-6">
            <q-field outlined dense label="Current GWA" stack-label bg-color="grey-2" readonly>
              <template v-slot:control>
                <div class="self-center full-width text-weight-bold">
                  {{ form.gwa || '0.00' }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="calculate" color="secondary" />
              </template> 
            </q-field>
          </div>
          
          <div class="col-12 col-md-6 flex items-center justify-end">
            <q-btn 
              outline 
              color="secondary" 
              icon="menu_book" 
              label="Manage Subjects & Grades" 
              @click="openGradesModal"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2 q-pa-md">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Update Student" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { studentsStore } from 'src/stores/modules/StudentsManagement/students'
import { renderToast } from 'src/utils/notify'

const emit = defineEmits(['saved'])
const storeStudents = studentsStore()

const form = reactive({
  id: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  lrn: '',
  grade_level: '',
  section: '',
  email: '',
  birth_date: '',
  is_active: true
})

const gradeOptions = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

onMounted(() => {
  if (storeStudents.studentData) {
    Object.assign(form, storeStudents.studentData)
  }
})

const requiredRules = [val => !!val || 'Required']
const LRNRules = [val => (val && val.length === 10) || 'Must be 10 digits']

const submitForm = async () => {
  try {
    const res = await storeStudents.updateStudent(form.id, form)
    
    if (res.success !== false) {
      renderToast('success', 'Success', 'Student updated successfully')
      emit('saved')
    } else {
      renderToast('error', 'Error', res.message)
    }
  } catch (err) {
    console.error(err)
  }
}
</script>