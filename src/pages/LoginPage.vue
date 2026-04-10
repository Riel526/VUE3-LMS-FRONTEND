<template>
<q-layout>
    <q-page-container>
      <q-form @submit.prevent="login">
        <q-page class="row items-center justify-center login-bg">
            <q-card class="login-card shadow-10">
              <div class="row full-height">
                  <div class="col-12 col-md-6 left-panel column justify-center q-pa-xl">
                      <!-- LOGO -->
                      <q-img
                        :src="logo"
                        width="140px"
                        fit="contain"
                        class="q-mb-xl"
                      />

                      <!-- TITLE -->
                      <div class="text-overline text-weight-bold q-mb-sm">
                        Welcome Back
                      </div>
                      <div class="text-h4 text-weight-bold q-mb-sm">Eden Christian School Portal</div>
                      <div class="text-subtitle2 q-mb-lg">
                        School Portal Access
                      </div>
                      <div class="text-subtitle1">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo</div>
                  </div>
                <div class="col-12 col-md-6 column justify-center q-pa-xl">
                    <div class="text-h5 text-weight-medium q-mb-lg text-center">Login</div>
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
                  <q-card-actions>
                    <q-btn 
                    label="Login"
                    color="primary"
                    class="full-width q-mb-sm"
                    type="submit"
                    />
                    <p>Don't have an account? <span class="signup" @click="signup(true)">Sign up now</span> </p>
                  </q-card-actions>
                  </div>
              </div>
            </q-card>
        </q-page>
      </q-form>
      <SignupModal 
      />
    </q-page-container>
  </q-layout>
</template>

<script setup>

import { ref } from 'vue'
import SignupModal from 'src/components/SignupModal.vue'
import { renderToast } from 'src/utils/notify'
import { userAuthStore } from 'src/stores/login/auth'
import { registerStore } from 'src/stores/login/register'
import { currUserStore } from 'src/stores/user/user'
import { useRouter } from 'vue-router'
import logo from 'src/assets/Logo.png'

const username = ref('')
const password = ref('')
const auth = userAuthStore()
const register = registerStore()
const user = currUserStore()
const router = useRouter()


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

      if (res.code === 200) {
      renderToast('success', `Success (${res.code})`, res.message || 'Logged in Successfully')
      router.push('/dashboard')  
      user.setCurrUser(res.data.user)
      } else {
        renderToast('error', `Error (${res.code})`, res.message || 'Log in Failed')
      }
    } catch (err) {
      renderToast('err', 'Login Failed', err.message || 'Something went wrong. Please refresh the page and try again')
    }
}

const signup = (state) => {
  register.showModal = state
  register.resetForm()
}


</script>
<style>
.signup {
  color: #1976D2;
  text-decoration: underline;
  cursor: pointer;
}

.login-card {
  width: 900px;
  max-width: 95%;
  min-height: 520px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
}

.left-panel {
  background: linear-gradient(135deg, #1976D2, #42A5F5);
  color: white;
}

.signup {
  color: #1976D2;
  font-weight: 500;
  cursor: pointer;
}

.signup:hover {
  text-decoration: underline;
}

.login-bg {
  background: linear-gradient(135deg, #eef2f7 0%, #dbeafe 100%);
}

</style>