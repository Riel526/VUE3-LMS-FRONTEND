<template>
  <q-card style="width: 1000px; max-width: 95vw;">
    <q-card-section class="bg-primary text-white row items-center">
      <div class="text-h6">Update Teacher Information</div>
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

        <div class="text-overline text-primary">Professional Details</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
             <q-input v-model="form.specialization" label="Specialization" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.department" :options="deptOptions" label="Department" outlined dense :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-3">
             <q-select v-model="form.status" :options="['Full-time', 'Part-time', 'Contractual']" label="Status" outlined dense :rules="requiredRules" />
          </div>
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="form.email" label="Email Address" outlined dense type="email" :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-6 flex items-center">
            <q-toggle v-model="form.is_active" label="Account Status (Active)" color="secondary" />
          </div>
        </div>

      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2 q-pa-md">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Update Teacher" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { teachersStore } from 'src/stores/modules/TeachersManagement/teachers'
import { renderToast } from 'src/utils/notify'

const emit = defineEmits(['saved'])
const storeTeachers = teachersStore()

const form = reactive({
  teacher_id: null,
  user_id: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  specialization: '',
  department: '',
  status: '',
  email: '',
  birth_date: '',
  is_active: true
})

const deptOptions = ['English/Language Arts', 'Mathematics', 'Science', 'Social Studies', 'MAPEH', 'Technology & Livelihood Education', 'Foreign Languages', 'Guidance Department']

onMounted(() => {
  if (storeTeachers.teacherData) {
    Object.assign(form, storeTeachers.teacherData)
  }
})

const requiredRules = [val => !!val || 'Required']

const submitForm = async () => {
  try {
    const res = await storeTeachers.updateTeacher(form.teacher_id, form)
    
    if (res.success !== false) {
      renderToast('success', 'Success', 'Teacher updated successfully')
      emit('saved')
    } else {
      renderToast('error', 'Error', res.message)
    }
  } catch (err) {
    renderToast('error', 'Error', err.message)
  }
}
</script>