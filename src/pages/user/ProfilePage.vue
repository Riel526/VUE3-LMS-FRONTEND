<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        
        <q-card class="no-shadow border-light q-mb-lg overflow-hidden">
          <div class="bg-primary" style="height: 100px"></div>
          
          <q-card-section class="row items-end q-gutter-md" style="margin-top: -60px">
            <q-avatar size="120px" class="bg-white shadow-2" style="border: 4px solid white">
              <img v-if="authStore.userData?.avatar" :src="authStore.userData?.avatar">
              <span v-else class="bg-primary text-white full-width full-height flex flex-center text-h4">
                {{ authStore.userData?.initials }}
              </span>
              <q-btn fab-mini color="secondary" icon="camera_alt" class="absolute-bottom-right" size="sm" />
            </q-avatar>
            
            <div class="q-pb-sm">
              <div class="text-h5 text-weight-bold text-grey-9">
                {{ `${authStore.userData?.first_name} ${authStore.userData?.last_name}` }}
              </div>
              <q-badge color="blue-1" text-color="blue-8" :label="authStore.userData?.role" class="text-weight-bold q-px-sm" />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="no-shadow border-light">
          <q-tabs v-model="tab" dense class="text-grey-7" active-color="primary" indicator-color="primary" align="left">
            <q-tab name="details" icon="person" label="Account Details" />
            <q-tab name="security" icon="lock" label="Security" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="details" class="q-pa-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Personal Information</div>
              <div class="q-gutter-y-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.first_name" label="First Name" outlined dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.last_name" label="Last Name" outlined dense />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.email" label="Email Address" outlined dense disable stack-label />
                    <div class="text-caption text-grey-6 q-mt-xs">Email is managed by the administrator.</div>
                  </div>
                </div>
                
                <div class="row justify-end q-mt-lg">
                  <q-btn label="Update Profile" color="primary" unelevated @click="saveProfile" />
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="security" class="q-pa-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Update Password</div>
              <div class="q-gutter-y-md" style="max-width: 400px">
                <q-input v-model="passwordForm.current" type="password" label="Current Password" outlined dense />
                <q-input v-model="passwordForm.new" type="password" label="New Password" outlined dense />
                <q-input v-model="passwordForm.confirm" type="password" label="Confirm New Password" outlined dense />
                
                <div class="q-mt-lg">
                  <q-btn label="Change Password" color="negative" unelevated @click="updatePassword" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
        
      </div>
    </div>
  </q-page>
</template>



<script setup>
import { onMounted, ref, watch } from 'vue'
import { currUserStore } from 'src/stores/user/user'

const authStore = currUserStore()
const tab = ref('details')


const form = ref({
  first_name: authStore.userData?.first_name || '',
  last_name: authStore.userData?.last_name || '',
  email: authStore.userData?.email || ''
})

watch(() => authStore.userData, (newVal) => {
  if (newVal) {
    form.value.first_name = newVal.first_name
    form.value.last_name = newVal.last_name
    form.value.email = newVal.email
  }
}, { immediate: true })

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const saveProfile = async () => {
  console.log('Saving profile...', form)
  // Your API call logic here
}

const updatePassword = async () => {
  console.log('Updating password...')
}

onMounted(() => {
  console.log('asdadsad', authStore)
})


</script>