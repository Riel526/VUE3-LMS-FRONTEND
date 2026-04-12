<template>
  <q-dialog persistent v-model="rStore.showModal">
    <q-card style="width:1000px; max-width: 95vw" class="q-pa-none overflow-hidden">
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h5 text-weight-bold">Create Account</div>
            <div class="text-caption text-blue-1">Eden Christian School Portal</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="close" />
          </div>
        </div>
      </q-card-section>

      <q-form @submit.prevent="ExecuteRegister">
        <q-card-section class="q-pa-lg">
          <div class="text-overline text-primary q-mb-sm">Account Credentials</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <q-input v-model="rStore.form.username" label="Username" outlined dense :rules="usernameRules" />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <q-input v-model="rStore.form.email" label="Email" outlined dense :rules="emailRules" />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <q-input v-model="rStore.form.password" label="Password" type="password" outlined dense :rules="passwordRules" />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <q-input v-model="rStore.form.confirmPassword" label="Confirm Password" type="password" outlined dense :rules="confirmPasswordRules" />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <div class="text-overline text-primary q-mb-sm">Personal Information</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input v-model="rStore.form.firstName" label="First Name" outlined dense :rules="requiredRules" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="rStore.form.middleName" label="Middle Name" outlined dense />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="rStore.form.lastName" label="Last Name" outlined dense :rules="requiredRules" />
            </div>
						<div class="col-12 col-md-3">
							<q-input v-model="rStore.form.birthDate" label="Birth Date" outlined dense mask="date" :rules="['date']">
								<template v-slot:append>
									<q-icon name="event" class="cursor-pointer">
										<q-popup-proxy cover transition-show="scale" transition-hide="scale">
											<q-date v-model="rStore.form.birthDate">
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
        </q-card-section>

        <q-card-section class="bg-blue-1 q-mx-lg q-mb-lg rounded-borders">
          <div class="row items-center">
            <div class="text-subtitle2 q-mr-md text-grey-8">Register as:</div>
            <div class="q-gutter-sm">
              <q-radio dense v-model="rStore.form.role" val="student" label="Student" />
              <q-radio dense v-model="rStore.form.role" val="teacher" label="Teacher" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2 q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" @click="close" />
          <q-btn 
            label="Register Account" 
            color="primary" 
            type="submit" 
            class="q-px-lg text-weight-bold" 
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { registerStore } from 'src/stores/login/register'
import { renderToast } from 'src/utils/notify'


const rStore = registerStore()
const close = () => {
	rStore.resetForm()
	rStore.showModal = false

}

const ExecuteRegister = async () => {
  try {
    const res = await rStore.registerUser({
      username: rStore.form.username,
      password: rStore.form.password,
      email: rStore.form.email,
      first_name: rStore.form.firstName,
      middle_name: rStore.form.middleName,
      last_name: rStore.form.lastName,
      role: rStore.form.role,
			birth_date: rStore.form.birthDate
    })

    if (res.data.code > 200 && res.data.code < 299) {
      renderToast('success', `Success (${res.status})`, res.data.message || 'User Registered Successfully')
			rStore.showModal = false
			rStore.resetForm()
    } else {
      renderToast('error', `Error (${res.data.status})`, res.data.errors || 'User Registration Failed')
    }
  } catch (err) {
    renderToast('error', 'Register Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

const usernameRules = [
	val => !!val || 'Username is required',
  val => val && val.length >= 4 || 'Username must be atleast 4 characters',
	val => /^[a-zA-Z0-9]*$/.test(val) || 'No special characters allowed'
]

const requiredRules = [
	val => !!val || 'This Field is required',
  val => val && val.length >= 2 || 'The Input must be atleast 2 characters'
]

const emailRules = [
	val => !!val || 'Email is required',
  val => val && val.length >= 5 || 'Email must be atleast 4 characters',
	val => {
		const atIndex = val.indexOf('@');
  	const dotIndex = val.lastIndexOf('.');
  
		// Check if there is a character after the dot (e.g., .com)
		const hasCharAfterDot = dotIndex > 0 && dotIndex < val.length - 1;

		// At least one character BETWEEN @ and .?
		const hasDomainBetween = dotIndex > atIndex + 1;
		// has characters before @
		const hasCharBeforeAt = atIndex > 0

		return (hasCharBeforeAt && hasCharAfterDot && hasDomainBetween) || 'Enter a valid email (e.g., user@domain.com)';
  }
]

const passwordRules = [
	val => !!val || 'Password in required',
	val => val.length >= 6 || 'Password must be at least 6 characters'
]

const confirmPasswordRules = [
	val => !!val || 'Confirm Password is required',
	val => val === rStore.form.password || 'Passwords do not match'
]
</script>