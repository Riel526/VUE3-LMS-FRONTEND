<template>
  <q-card style="min-width: 450px; border-radius: 12px;">
    <q-card-section class="row items-center q-pb-md">
      <div class="text-h6 text-weight-bold">Edit Subject: {{ form.subject_code }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-lg">
      <q-form @submit="updateSubject" class="q-gutter-y-md">
        
        <div class="row q-col-gutter-sm">
          <div class="col-4">
            <q-input v-model="form.subject_code" label="Code" outlined dense readonly />
          </div>
          <div class="col-8">
            <q-input v-model="form.name" label="Subject Title" outlined dense :rules="[val => !!val || 'Required']" />
          </div>
        </div>

        <q-input v-model="form.description" label="Description" type="textarea" outlined dense rows="3" />

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-select v-model="form.units" :options="[1, 2, 3, 4, 5]" label="Units" outlined dense />
          </div>
          <div class="col-6">
            <q-select v-model="form.category" :options="['General Education', 'Elective', 'Major', 'Minor']" label="Category" outlined dense />
          </div>
        </div>

        <div class="q-mt-md">
          <div class="text-caption q-mb-xs">Subject Image:</div>
          
          <div v-if="form.image_path && !removeImage" class="row items-center q-mb-sm">
            <q-img :src="getImageUrl(form.image_path)" style="width: 170px; height: 120px" class="rounded-borders q-mr-sm" />
            <q-btn label="Remove Image" color="negative" flat dense size="sm" @click="removeImage = true" />
          </div>

          <q-file 
            v-if="!removeImage"
            v-model="imageFile" 
            label="Replace Image" 
            outlined dense accept="image/*" clearable
          />
          
          <q-banner v-else class="bg-grey-2 rounded-borders">
            <div class="row items-center justify-between">
              <span class="text-caption">Image will be deleted on save.</span>
              <q-btn flat label="Undo" size="sm" @click="removeImage = false" />
            </div>
          </q-banner>
        </div>

        <div class="row justify-end q-mt-lg q-gutter-x-sm">
          <q-btn label="Cancel" color="grey-7" flat v-close-popup />
          <q-btn label="Update Changes" type="submit" color="primary" unelevated />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>



<script setup>
import { ref } from 'vue'
import { subjectsStore } from 'src/stores/modules/SubjectsManagement/subjects'
import { renderToast } from 'src/utils/notify'


const emit = defineEmits(['saved'])
const subjectStore = subjectsStore()
const imageFile = ref(null)
const removeImage = ref(false);

const form = ref({ ...subjectStore.subjectData })

const updateSubject = async () => {
  try {
    const fd = new FormData()
    fd.append('_method', 'PUT')
    
    fd.append('name', form.value.name);
    fd.append('description', form.value.description || '')
    fd.append('units', form.value.units)
    fd.append('category', form.value.category)
    fd.append('subject_code', form.value.subject_code)

    if (imageFile.value && removeImage.value === false) {
      fd.append('image', imageFile.value);
    }

    if (removeImage.value === true) {
      fd.append('remove_image', 1)
    }

    const res = await subjectStore.updateSubject(form.value.subject_id, fd);
    
    if (res.code === 200) {
        renderToast('success', 'Success', 'Student updated successfully')
        emit('saved')
      } else {
        renderToast('error', 'Error', res.message)
      }
    } catch (err) {
      renderToast('error', 'Error', err.message)
    }
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseURL = import.meta.env.VITE_QUASAR_API_URL;
  
  return `${baseURL}/storage/${path}`;
};
</script>