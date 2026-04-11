<template>
  <q-layout view="lHh Lpr lFf">

  <q-header elevated class="bg-primary text-white q-pa-sm">
    <q-toolbar>
      <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
      <q-toolbar-title>Eden Christian School</q-toolbar-title>
      <q-space />
        <q-btn-dropdown flat no-caps :label="currUser?.userData?.first_name">
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="router.push('/profile')">
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>My Profile</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="logout" class="text-negative">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above bordered 
      class="bg-grey-1" 
      :width="280" 
      :breakpoint="700" 
      :behavior="$q.screen.lt.md ? 'mobile' : 'desktop'">
      <q-scroll-area class="fit">
        <div class="q-pa-md bg-primary text-white">
          <div class="row justify-end lt-md" v-if="$q.screen.lt.md">
            <q-btn 
            flat 
            round 
            dense 
            icon="close" 
            @click="leftDrawerOpen = false" 
            />
          </div>

          <div class="column q-mt-xs">
            <div class="text-h6 text-weight-bold">
              {{ currUser.userData?.first_name }} {{ currUser.userData?.last_name }}
            </div>
            <div class="text-caption" style="opacity: 0.8; text-transform: uppercase;">
              {{ currUser.userData?.role }}
            </div>
          </div>
        </div>

        <q-list padding>
          
          <q-expansion-item
            expand-separator
            icon="explore"
            label="Main Navigation"
            default-opened
            header-class="text-weight-bold"
          >
            <q-item clickable v-ripple to="/dashboard" class="q-pl-lg">
              <q-item-section avatar>
                <q-icon name="dashboard" size="xs" />
              </q-item-section>
              <q-item-section>Home Dashboard</q-item-section>
            </q-item>
            
          </q-expansion-item>

          <q-separator q-my-sm />

          <q-expansion-item
            expand-separator
            icon="settings"
            label="Management"
            header-class="text-weight-bold"
          >
            <q-item clickable v-ripple to="/students" class="q-pl-lg">
              <q-item-section avatar>
                <q-icon name="people" size="xs" />
              </q-item-section>
              <q-item-section>Students List</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/classes" class="q-pl-lg">
              <q-item-section avatar>
                <q-icon name="school" size="xs" />
              </q-item-section>
              <q-item-section>Classes</q-item-section>
            </q-item>
          </q-expansion-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- PAGE CONTENT -->
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { currUserStore } from 'src/stores/user/user'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(false)
const currUser = currUserStore()
const router = useRouter()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = () => {
  currUser.logout()
  router.push('/login')
}
</script>
