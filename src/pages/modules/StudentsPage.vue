<template>
  <q-page padding>
    <div class="row q-mb-md items-center q-gutter-md">
      <div class="text-h5 text-weight-bold text-primary">Students Management</div>
      <q-space />
      
      <q-input 
        outlined 
        dense 
        debounce="300" 
        v-model="filter" 
        placeholder="Search Students..."
        class="bg-white"
        style="width: 300px"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn color="primary" icon="add" label="Add Student" />
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
            <q-badge :color="props.value === 'Active' ? 'positive' : 'grey'">
              {{ props.value }}
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
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { studentsStore } from 'src/stores/modules/students'
import { renderToast } from 'src/utils/notify'


const storeStudents = studentsStore()
const filter = ref('')
const rows = ref ([])

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


const getAllStudents = async () => {
  try {
    const res = await storeStudents.getAllStudents()
    rows.value = res
    console.log(rows)
  } catch (err) {
    renderToast('err', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
} 

onMounted(() => {
  getAllStudents()
})


</script>