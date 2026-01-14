<template>
<q-dialog 
persistent 
:model-value="modelValue"
@update:model-value="emit('update:modelValue', $event)"
>
	<q-card style="width:400px;" class="q-pa-md">
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
			<q-form @submit.prevent="register">
				<q-card-section>
					<q-input
					v-model="username"
					label="Username"
					type="text"
					outlined
					class="q-mb-md"
					:rules="usernameRules"
					/>
					<q-input 
					v-model="password"
					label="Password"
					type="password"
					outlined
					class="q-mb-md"
					:rules="passwordRules"
					/>
					<q-input 
					v-model="confirmPassword"
					label="Confirm Password"
					type="password"
					outlined
					:rules="confirmPasswordRules"
					/>
					<div class="q-gutter-sm" align="right">
						<q-radio dense v-model="role" val="student" label="Student" />
						<q-radio dense v-model="role" val="teacher" label="Teacher" />
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
import { ref } from 'vue'

defineProps({
	modelValue: Boolean
})

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('student')


const emit = defineEmits([
	'update:modelValue',
	'register'
])

const close = () => {
	emit('update:modelValue', false)
}

const register = () => {
	emit('register',
		{
			username: username.value,
			password: password.value,
			role: role.value
		}
	)
}

const usernameRules = [
	val => !!val || 'Username is required',
  val => val && val.length >= 4 || 'Username must be atleast 4 characters'
]

const passwordRules = [
	val => !!val || 'Password in required',
	val => val.length >= 6 || 'Password must be at least 6 characters'
]

const confirmPasswordRules = [
	val => !!val || 'Confirm Password is required',
	val => val === password.value || 'Passwords do not match'
]
</script>