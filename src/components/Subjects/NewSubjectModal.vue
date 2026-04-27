<template>
  <q-card style="min-width: 450px; border-radius: 12px;">
    <q-card-section class="row items-center q-pb-md">
      <div class="text-h6 text-weight-bold">New Subject Entry</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-lg">
      <q-form @submit="saveSubject" class="q-gutter-y-md">
        
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-4">
            <q-input 
              v-model="newSubject.subject_code" 
              label="Code (IT-101)" 
              outlined 
              dense
              :rules="[val => !!val || 'Required']"
            />
          </div>
          <div class="col-12 col-sm-8">
            <q-input 
              v-model="newSubject.name" 
              label="Subject Title" 
              outlined 
              dense
              :rules="[val => !!val || 'Required']"
            />
          </div>
        </div>

        <q-input 
          v-model="newSubject.description" 
          label="Detailed Description" 
          type="textarea" 
          outlined 
          dense 
          rows="3"
        />

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-select 
              v-model.number="newSubject.units" 
              label="Credit Units" 
              type="number" 
              outlined 
              dense 
              :options="[1, 2, 3, 4, 5]"
            />
          </div>
          <div class="col-6">
            <q-select 
              v-model="newSubject.category" 
              label="Department/Category" 
              outlined 
              dense 
              :options="['General Education', 'Elective', 'Major', 'Minor']"
            />
          </div>
        </div>
        <q-file 
          v-model="imageFile" 
          label="Upload Subject Image" 
          outlined 
          dense
          accept=".jpg, .png, image/*"
          class="q-mt-md"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="image" />
          </template>
        </q-file>

        <div class="row justify-end q-mt-lg q-gutter-x-sm">
          <q-btn 
            label="Cancel" 
            color="grey-7" 
            flat 
            v-close-popup 
          />
          <q-btn 
            label="Save Subject" 
            type="submit" 
            color="primary" 
            unelevated
            padding="sm lg"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { subjectsStore } from 'src/stores/modules/SubjectsManagement/subjects';
import { renderToast } from 'src/utils/notify';

// 1. Define the custom event "saved"
const emit = defineEmits(['saved']); 

const subjectStore = subjectsStore();
const imageFile = ref(null);

const newSubject = ref({
  subject_code: '',
  name: '',
  description: '',
  units: 3,
  category: 'General Education'
});

const saveSubject = async () => {
  try {
    const fd = new FormData();
    fd.append('subject_code', newSubject.value.subject_code)
    fd.append('name', newSubject.value.name)
    fd.append('description', newSubject.value.description || '')
    fd.append('units', newSubject.value.units)
    fd.append('category', newSubject.value.category)

    if (imageFile.value) {
      fd.append('image', imageFile.value)
    }

    const res = await subjectStore.addSubject(fd)
    if (res.code === 201) {
      renderToast('success', `Success (${res.code})`, res.message || 'Subject Added Successfully')
      emit('saved'); 
      newSubject.value = { subject_code: '', name: '', description: '', units: 3, category: 'General' };
    } else {
       renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful Addition of Subject')
    }
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
};
</script>