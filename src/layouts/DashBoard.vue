<template>
  <q-layout view="hHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Eden Christian School Portal
        </q-toolbar-title>

        <q-space />

        <div>{{ authStore.user?.name }}</div>

        <q-btn flat icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable to="/students">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Students</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- PAGE CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { userAuthStore } from 'src/stores/login/auth'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(false)
const authStore = userAuthStore()
const router = useRouter()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
