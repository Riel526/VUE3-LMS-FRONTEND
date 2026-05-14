<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="text-h5 text-weight-bold text-primary">Assignments Dashboard</div>
      <q-space />
      <q-btn 
        color="primary" 
        label="Create New Assignment" 
        icon="add" 
        @click="$router.push('/assignments/create-assignment')" 
      />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="rows"
        :columns="columns"
        :filter="filter"
        row-key="id"
        flat
      >
        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center text-grey-8 q-gutter-sm q-pa-lg">
            <q-icon size="2em" :name="filter ? 'filter_list_off' : icon" />
            <span>
              {{ filter ? `No results found for "${filter}"` : message }}
            </span>
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="center">
            <q-btn flat round dense icon="more_vert" color="grey-7">
              <q-menu transition-show="scale" transition-hide="scale" self="top right" anchor="top right">
                <q-list style="min-width: 150px">
                  
                  <q-item clickable v-close-popup  @click="$router.push(`/assignments/create-assignment/${props.row.assignment_id}`)">
                    <q-item-section avatar>
                      <q-icon name="edit" color="primary" />
                    </q-item-section>
                    <q-item-section>Update</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="showModal(true, props.row)">
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
    <q-dialog v-model="modalModel" persistent transition-show="scale" transition-hide="scale">
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
import { ref, onMounted } from 'vue'
import { assignmentsStore } from 'src/stores/modules/Assignments/assignments'
import { renderToast } from 'src/utils/notify'
import ConfirmationModal from 'src/components/Global/ConfirmationModal.vue'

const store = assignmentsStore()
const rows = ref([])
const modalModel = ref(false)

const deleteContext = ref({
  title: '',
  message: '',
  data: ''
})

const columns = [
  { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
  { name: 'subject', label: 'Subject', field: 'subject', align: 'left' },
  { 
    name: 'target', 
    label: 'Grade/Section', 
    field: row => `${row.grade_level} - ${row.section}`, 
    align: 'left' 
  },
  { name: 'due_date', label: 'Due Date', field: 'due_date', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const getAssignments = async () => {
  try {
    rows.value = await store.getAssignments()
  } catch (err) {
    renderToast('error', 'Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

const showModal = async (condition, data) => {
  modalModel.value = condition
  if (condition && data) {
    deleteContext.value = {
      title: 'Delete Assignment',
      message: 'Are you sure you want to this Assignment?',
      data: { ...data }
    }
  } 
}

const executeDelete = async (data) => {
  try {
    const res = await store.deleteAssignment(data.assignment_id)

    if (res.code === 200) {
      renderToast('success', `Success (${res.code})`, res.message || 'Assignment Deleted Successfully')
      showModal(false)
      getAssignments()
    } else {
      renderToast('error', `Error (${res.code})`, res.message || 'Unsuccessful Deletion of Assignment')
    }
  } catch (err) {
    renderToast('error', 'Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

onMounted(() => {
  getAssignments()
})
</script>