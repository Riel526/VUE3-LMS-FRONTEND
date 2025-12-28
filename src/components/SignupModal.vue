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
			<q-card-section>
				<q-input
				v-model="username"
				label="Username"
				type="text"
				outlined
				class="q-mb-md"
				/>
				<q-input 
				v-model="password"
				label="Password"
				type="password"
				outlined
				class="q-mb-md"
				/>
				<q-input 
				v-model="confirmPassword"
				label="Confirm Password"
				type="password"
				outlined  
				/>
			</q-card-section> 
			<q-card-actions align="right">
				<q-btn 
				label="Register"
				color="primary"
				@click="register"
				/>
			</q-card-actions>
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
			password: password.value
		}
	)
}
</script>