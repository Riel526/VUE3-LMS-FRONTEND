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

const username = ref('')
const password = ref('')

const signupDialog = ref(false)


const login = () => {
    console.log('hey', username.value)  
    console.log('hey', password.value)
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