<template>
  <q-page padding>
    <div class="row items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Subject Catalog</div>
        <div class="text-subtitle2 text-grey-6">View all academic modules</div>
      </div>
      <q-space />
      <q-input 
        v-model="search" 
        placeholder="Search subjects..." 
        outlined 
        dense 
        bg-color="white"
        style="width: 350px"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 2000" shadow-10>
        <q-btn fab icon="add" color="primary" @click="showModal(true, 'add')" />
      </q-page-sticky>
    </div>

    <div v-if="!subjectStore.subjects || filteredSubjects.length === 0" class="flex flex-center q-pa-xl column">
      <q-icon name="collections_bookmark" size="80px" color="grey-3" />
      <div class="text-h6 text-grey-5 q-mt-md">No subjects found.</div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div 
        v-for="subject in filteredSubjects" 
        :key="subject.subject_id" 
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="subject-card no-shadow border-light">
          <q-btn icon="more_vert" flat round dense class="absolute-top-right q-ma-xs text-white" style="z-index: 2000; color: white; background: rgba(0, 0, 0, 0.3);">
            <q-menu cover auto-close>
              <q-list style="min-width: 150px">
                <q-item clickable @click="showModal(true, 'update', null, subject)">
                  <q-item-section avatar>
                    <q-icon name="edit" color="primary" />
                  </q-item-section>
                  <q-item-section>Edit Subject</q-item-section>
                </q-item>
                
                <q-item clickable @click="showModal(true, 'delete', null, subject)">
                  <q-item-section avatar>
                    <q-icon name="delete" color="negative" />
                  </q-item-section>
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-img 
            v-if="subject.image_path"
            :src="getImageUrl(subject.image_path)" 
            :ratio="16/9"
            class="bg-grey-2"
          />
          <div 
            v-else 
            :class="`bg-${getPlaceholderColor(subject.name || '')}`" 
            style="height: 160px;"
            class="flex flex-center"
          >
            <q-icon name="menu_book" color="white" size="64px" />
          </div>

          <q-card-section>
            <div class="text-overline text-primary text-weight-bold">
              {{ subject.subject_code ? subject.subject_code.toUpperCase() : 'NO CODE' }}
            </div>
            
            <div class="text-h6 q-mt-none q-mb-xs text-grey-9">
              {{ subject.name || 'Untitled Subject' }}
            </div>
            
            <p class="text-caption text-grey-7 line-clamp-2">
              {{ subject.description || 'No description provided.' }}
            </p>

            <div class="row items-center q-mt-md">
              <q-badge outline color="secondary" :label="subject.category || 'N/A'" class="q-mr-sm" />
              <q-badge color="grey-2" text-color="grey-9" :label="`${subject.units || 0} Units`" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="addSubjectModalModel" persistent transition-show="scale" transition-hide="scale">
      <NewSubjectModal @saved="showModal(false, 'add', true)"/>
    </q-dialog>
    <q-dialog v-model="updateSubjectModalModel" persistent transition-show="scale" transition-hide="scale">
      <UpdateSubjectModal @saved="showModal(false, 'update', true)"/>
    </q-dialog>
    <q-dialog v-model="deleteSubjectModalModel" persistent transition-show="scale" transition-hide="scale">
      <ConfirmationModal 
      :title="deleteContext.title"
      :message="deleteContext.message"
      :data="deleteContext.data"
      @proceed="executeDelete"/>
    </q-dialog>
  </q-page>
</template>

<style lang="scss" scoped>
.border-light {
  border: 1px solid #e0e0e0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  min-height: 3em; 
}

.subject-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-radius: 12px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { subjectsStore } from 'src/stores/modules/SubjectsManagement/subjects'
import NewSubjectModal from 'src/components/Subjects/NewSubjectModal.vue'
import UpdateSubjectModal from 'src/components/Subjects/UpdateSubjectModal.vue'
import { renderToast } from 'src/utils/notify'
import ConfirmationModal from 'src/components/Global/ConfirmationModal.vue'

const subjectStore = subjectsStore()
const search = ref('')
const addSubjectModalModel = ref(false)
const updateSubjectModalModel = ref(false)
const deleteSubjectModalModel = ref(false)

const deleteContext = ref({
  title: '',
  message: '',
  data: ''
})


const filteredSubjects = computed(() => {
  const subjects = subjectStore.subjects || [];
  if (!search.value) return subjects;
  
  const s = search.value.toLowerCase();
  return subjects.filter(item => 
    (item.name && item.name.toLowerCase().includes(s)) || 
    (item.subject_code && item.subject_code.toLowerCase().includes(s))
  );
});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseURL = import.meta.env.VITE_QUASAR_API_URL_LOCAL;
  
  return `${baseURL}/storage/${path}`;
};

const getPlaceholderColor = (name) => {
  const colors = ['blue-9', 'teal-9', 'purple-9', 'orange-9', 'indigo-9', 'red-9'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
}

const showModal = async (condition, action, status, data) => {
  if (action === 'add') {
    addSubjectModalModel.value = condition
  }

  if (action === 'update') {
    updateSubjectModalModel.value = condition
    subjectStore.subjectData = data ? { ... data } : null
  }

  if (action === 'delete') {
    deleteSubjectModalModel.value = condition

    if (!status) {
        deleteContext.value = {
        title: 'Delete Subject',
        message: `Are you sure you want to delete the Subject ${data.nam}?`,
        data: { ...data }
      }
    }
  }

  if (status) {
    await subjectStore.getAllSubjects();
  }
}

const executeDelete = async (data) => {
  try {
    const res = await subjectStore.deleteSubject(data.subject_id)

    if (res.code === 200) {
      renderToast('success', `Success (${res.code})`, res.message || 'Student Deleted Successfully')
      showModal(false, 'delete', 'delete')
    } else {
      renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful Deletion of Student')
    }
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

onMounted(async () => {
  try {
    await subjectStore.getAllSubjects();
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
});
</script>