<template>
<q-layout>
    <q-page-container>
      <q-form @submit.prevent="login">
        <q-page class="row flex-center">
          <q-card class="q-pa-lg" style="width:350px">
            <q-card-section>
              <div class="text-h6 text-center">Login</div>
            </q-card-section>
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
              :rules="passwordRules"
              />
            </q-card-section>
            <q-card-actions>
              <q-btn 
              label="Login"
              color="primary"
              class="full-width q-mb-sm"
              type="submit"
              />
              <p>Don't have an account? <span class="signup" @click="signup(true)">Sign up now</span> </p>
            </q-card-actions>
          </q-card>
        </q-page>
      </q-form>
      <SignupModal 
      v-model="signupDialog" 
      @register="handleRegister"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup>

import { ref } from 'vue'
import SignupModal from 'src/components/SignupModal.vue'
import { renderToast } from 'src/utils/notify'
import { userAuthStore } from 'src/stores/auth'
import { registerStore } from 'src/stores/register'

const username = ref('')
const password = ref('')
const auth = userAuthStore()
const register = registerStore()

const signupDialog = ref(false)

const usernameRules = [
  val => !!val || 'Username is required',
  val => val && val.length >= 4 || 'Username must be atleast 4 characters'
]

// You can also make specific ones
const passwordRules = [
  val => !!val || 'Password is required',
  val => val.length >= 6 || 'Password must be at least 6 characters'
]


const login = async () => {
    // renderToast('Login Successful', 'error', `${import.meta.env.VITE_QUASAR_API_URL_LOCAL}, ${username.value}`)

    try {
      const res = await auth.loginUser({
        username: username.value,
        password: password.value,
      })

      if (res.data.status === 200) {
      renderToast('success', `Success (${res.data.status})`, res.data.message || 'Logged in Successfully')
      } else {
        renderToast('error', `Error (${res.data.status})`, res.data.message || 'Log in Failed')
      }
    } catch (err) {
      renderToast('err', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
    }
}

const signup = (state) => {
  signupDialog.value = state
}

const handleRegister = async (data) => {
  try {
    const res = await register.registerUser({
      username: data.username,
      password: data.password,
      role: data.role
    })

    if (res.data.status === 200) {
      renderToast('success', `Success (${res.data.status})`, res.data.message || 'User Registered Successfully')
      signup(false)
    } else {
      renderToast('error', `Error (${res.data.status})`, res.data.message || 'User Registration Failed')
    }
  } catch (err) {
    renderToast('error', 'Register Failed', err.message || 'Something went wrong. Please refresh the page and try again')
  }
}

</script>
<style>
.signup {
  color: #1976D2;
  text-decoration: underline;
  cursor: pointer;
}
</style>