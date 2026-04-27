<template>
  <q-card class="confirm-card shadow-24">
    <div class="delete-bar"></div>

    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-weight-bold text-negative">
        <q-icon name="report_problem" size="sm" class="q-mr-sm" />
        {{ title }}
      </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup class="text-grey-7" />
    </q-card-section>

    <q-card-section class="q-pa-lg">
      <div class="text-body1 text-grey-9 text-center">
        {{ message }}
      </div>
      <div class="q-mt-md text-caption text-negative text-center bg-red-1 q-pa-sm rounded-borders">
        This action is permanent and cannot be undone.
      </div>
    </q-card-section>

    <q-card-actions align="center" class="q-pb-lg q-px-lg">
      <q-btn 
        flat 
        label="Cancel" 
        color="grey-8" 
        v-close-popup 
        class="q-px-md"
      />
      <q-btn 
        unelevated 
        :label="confirmLabel" 
        color="negative" 
        @click="execute" 
        class="q-px-xl text-weight-bold"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Confirmation' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmLabel: { type: String, default: 'Proceed' },
  data: { type: Object, default: null}
})

const emit = defineEmits(['proceed'])

const execute = () => {
  console.log('asd', props.data)
  emit('proceed', props.data)
}

</script>

<style scoped>
.confirm-card {
  width: 450px;
  max-width: 90vw;
  border-radius: 16px;
}

.delete-bar {
  height: 6px;
  background: var(--q-negative);
  width: 100%;
}

.rounded-borders {
  border-radius: 8px;
}
</style>