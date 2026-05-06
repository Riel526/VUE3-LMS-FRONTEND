<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="text-h5 text-weight-bold text-primary">Assignments Dashboard</div>
      <q-space />
      <q-btn 
        color="primary" 
        label="Create New Assignment" 
        icon="add" 
        @click="$router.push('/assignments/create')" 
      />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props" align="center">
            <q-btn flat round dense icon="more_vert" color="grey-7">
              <q-menu transition-show="scale" transition-hide="scale" self="top right" anchor="top right">
                <q-list style="min-width: 150px">
                  
                  <q-item clickable v-close-popup @click="$router.push('/assignments/update')">
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

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs text-center">
            <q-btn flat round color="blue" icon="visibility" size="sm" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="onDelete(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { assignmentsStore } from 'src/stores/modules/Assignments/assignments'
import { renderToast } from 'src/utils/notify'

const store = assignmentsStore()
const rows = ref([])

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
    rows.value = await store.fetchAssignments()
  } catch (err) {
    renderToast('error', 'Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

// const onDelete = (id) => {
//   $q.dialog({
//     title: 'Confirm Delete',
//     message: 'Are you sure you want to remove this assignment?',
//     cancel: true,
//     persistent: true
//   }).onOk(async () => {
//     try {
//       await store.deleteAssignment(id)
//       renderToast('positive', 'Assignment deleted successfully')
//       await loadData() // Refresh list
//     } catch (error) {
//       renderToast('negative', 'Could not delete assignment')
//     }
//   })
// }

onMounted(() => {
  getAssignments()
})
</script>