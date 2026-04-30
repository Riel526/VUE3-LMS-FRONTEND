<template>
  <q-page padding>
    <div class="row q-mb-md items-center q-gutter-md">
      <div class="text-h5 text-weight-bold text-primary">Teachers Management</div>
      <q-space />
      
      <q-input 
        outlined 
        dense 
        debounce="300" 
        v-model="filter" 
        placeholder="Search Teachers..."
        class="bg-white"
        style="width: 300px"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn color="primary" icon="add" label="Add Teacher" @click="showModal(true, null, 'add')"/>
    </div>

    <q-card flat bordered>
      <q-table
        :rows="rows"
        :columns="columns"
        :filter="filter"
        row-key="id"
        flat
        binary-state-sort
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge style :color="props.value === true ? 'positive' : 'grey'">
              {{ props.value ? 'Active' : 'Inactive' }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center text-grey-8 q-gutter-sm q-pa-lg">
            <q-icon size="2em" :name="filter ? 'filter_list_off' : icon" />
            <span>
              {{ filter ? `No results found for "${filter}"` : message }}
            </span>
          </div>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props" align="center">
            <q-btn flat round dense icon="more_vert" color="grey-7">
              <q-menu transition-show="scale" transition-hide="scale" self="top right" anchor="top right">
                <q-list style="min-width: 150px">
                  
                  <q-item clickable v-close-popup @click="showModal(true, null, 'update', props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" color="primary" />
                    </q-item-section>
                    <q-item-section>Update</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="showModal(true, null, 'delete', props.row)">
                    <q-item-section avatar>
                      <q-icon name="delete" color="negative" />
                    </q-item-section>
                    <q-item-section class="text-negative">Delete</q-item-section>
                  </q-item>
                  
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="AddStudentModalModel" persistent transition-show="scale" transition-hide="scale">
      <NewStudentModal @saved="showModal(false, 'added', 'add')"/>
    </q-dialog>
    <q-dialog v-model="updateStudentModalModel" persistent transition-show="scale" transition-hide="scale">
      <updateStudentModal @saved="showModal(false, 'updated', 'update')"/>
    </q-dialog>
    <q-dialog v-model="deleteStudentModalModel" persistent transition-show="scale" transition-hide="scale">
      <ConfirmationModal 
      :title="deleteContext.title"
      :message="deleteContext.message"
      :data="deleteContext.data"
      @proceed="executeDelete"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { studentsStore } from 'src/stores/modules/StudentsManagement/students'
import { renderToast } from 'src/utils/notify'
import NewStudentModal from 'src/components/Students/NewStudentModal.vue'
import updateStudentModal from 'src/components/Students/UpdateStudentModal.vue'
import ConfirmationModal from 'src/components/Global/ConfirmationModal.vue'


const storeStudents = studentsStore()
const filter = ref('')
const rows = ref ([])
const AddStudentModalModel = ref(false)
const updateStudentModalModel = ref(false)
const deleteStudentModalModel = ref(false)

const columns = [
  { name: 'lrn', label: 'LRN', field: 'lrn', align: 'left', sortable: true },
  { name: 'name', label: 'Full Name', field: row => `${row.first_name} ${row.middle_name ? row.middle_name[0] + '.' : ''} ${row.last_name}`, align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'grade', label: 'Grade', field: 'grade_level', align: 'center' },
  { name: 'section', label: 'Section', field: 'section', align: 'center' },
  { name: 'gwa', label: 'General Weighted Average', field: 'gwa', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'is_active', align: 'center', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'center' }
]

const deleteContext = ref({
  title: '',
  message: '',
  data: ''
})

const showModal = (condition, status, modalType, data) => {

  if (modalType === 'add') {
    AddStudentModalModel.value = condition
  }

  if (modalType === 'update') {
    updateStudentModalModel.value = condition
    storeStudents.studentData = data ? { ...data } : null
  }

  if (modalType === 'delete') {
    deleteStudentModalModel.value = condition
    if (condition && data) {
      deleteContext.value = {
        title: 'Delete Student',
        message: `Are you sure you want to delete the student named ${data.first_name} ${data.last_name}?`,
        data: { ...data }
      }
    }
  }


  // get students if successfully added/updated through emitting
  if (status === 'added' || status === 'updated' || status === 'deleted') {
    getAllStudents()
  }
}

const getAllStudents = async () => {
  try {
    const res = await storeStudents.getAllStudents()
    rows.value = res
    console.log(rows)
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

const executeDelete = async (data) => {
  try {
    const res = await storeStudents.deleteStudent(data.id)

    if (res.code === 200) {
      renderToast('success', `Success (${res.code})`, res.message || 'Student Deleted Successfully')
      showModal(false, 'deleted', 'delete')
    } else {
      renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful Deletion of Student')
    }
  } catch (err) {
    renderToast('error', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}
  
onMounted(() => {
  getAllStudents()
})


</script>