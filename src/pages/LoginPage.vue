<template>
<q-layout>
    <q-page-container>
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
            />
            <q-input 
            v-model="password"
            label="Password"
            type="password"
            outlined
            />
          </q-card-section>
          <q-card-actions>
            <q-btn 
            label="Login"
            color="primary"
            class="full-width q-mb-sm"
            @click="login"
            />
            <p>Don't have an account? <span class="signup" @click="signup(true)">Sign up now</span> </p>
          </q-card-actions>
        </q-card>
      </q-page>
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

const username = ref('')
const password = ref('')
const auth = userAuthStore()

const signupDialog = ref(false)


const login = async () => {
    // renderToast('Login Successful', 'error', `${import.meta.env.VITE_QUASAR_API_URL_LOCAL}, ${username.value}`)

    try {
      const res = await auth.loginUser({
        username: username.value,
        password: password.value
      })

      if (res.status === 200) {
      renderToast('success', `Success (${res.status})`, 'Logged in Successfully')
      } else {
        renderToast('error', `Error (${res.status})`, 'Log in Failed')
      }
    } catch (err) {
      renderToast('err', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
    }
}

const signup = (state) => {
  signupDialog.value = state
}

const handleRegister = (data) => {
  console.log(data)
}

</script>
<style>
.signup {
  color: #1976D2;
  text-decoration: underline;
  cursor: pointer;
}
</style>