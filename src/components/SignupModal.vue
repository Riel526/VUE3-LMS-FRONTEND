<template>
<q-dialog 
persistent
v-model="rStore.showModal"
>
	<q-card style="width:1000px; max-width: 90vw" class="q-pa-md">
			<q-card-section>
				<q-btn 
				class="text absolute-top-right"
				icon="close"
				flat
				round
				dense
				@click="close"
				/>
				<div class="text-h6 text-center">Signup</div>
			</q-card-section>
			<q-form @submit.prevent="ExecuteRegister">
			<q-card-section>
				<div class="row q-col-gutter-md">
					<div class="col-12 col-sm-6 col-md-3">
						<q-input v-model="rStore.form.username" label="Username" outlined :rules="usernameRules" />
					</div>
					<div class="col-12 col-sm-6 col-md-3">
						<q-input v-model="rStore.form.email" label="Email" outlined :rules="emailRules" />
					</div>
					<div class="col-12 col-sm-6 col-md-3">
						<q-input v-model="rStore.form.password" label="Password" type="password" outlined :rules="passwordRules" />
					</div>
					<div class="col-12 col-sm-6 col-md-3">
						<q-input v-model="rStore.form.confirmPassword" label="Confirm Password" type="password" outlined :rules="confirmPasswordRules" />
					</div>

					<div class="col-12 col-md-3">
						<q-input v-model="rStore.form.firstName" label="First Name" outlined :rules="requiredRules" />
					</div>
					<div class="col-12 col-md-3">
						<q-input v-model="rStore.form.middleName" label="Middle Name" outlined class="q-mb-lg" />
					</div>
					<div class="col-12 col-md-3">
						<q-input v-model="rStore.form.lastName" label="Last Name" outlined :rules="requiredRules" />
					</div>
				</div>
			</q-card-section>
				<q-card-section>
				<div class="q-gutter-sm" align="right">
						<q-radio dense v-model="rStore.form.role" val="student" label="Student" />
						<q-radio dense v-model="rStore.form.role" val="teacher" label="Teacher" />
				</div>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn 
					label="Register"
					color="primary"
					type="submit"
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
      role: rStore.form.role
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