<template>
  <q-page padding class="bg-grey-1">
    <div class="row q-mb-lg items-center">
      <div class="col">
        <div class="text-h4 text-weight-bold text-primary">Welcome back, {{ `${userData.first_name} ${userData.last_name}` }}! 👋</div>
        <div class="text-subtitle1 text-grey-7">Here is what's happening with your studies today.</div>
      </div>
      <q-btn outline color="primary" icon="event" label="View Class Schedule" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="my-card">
          <q-card-section class="text-center">
            <div class="text-overline text-grey-7">Current GWA</div>
            <div class="text-h4 text-weight-bolder text-primary">1.25</div>
            <q-badge color="positive" label="+0.15 from last sem" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="my-card">
          <q-card-section class="text-center">
            <div class="text-overline text-grey-7">Attendance Rate</div>
            <div class="text-h4 text-weight-bolder text-secondary">96%</div>
            <div class="text-caption text-grey">2 Absences this month</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="my-card">
          <q-card-section class="text-center">
            <div class="text-overline text-grey-7">Pending Tasks</div>
            <div class="text-h4 text-weight-bolder text-orange-9">5</div>
            <div class="text-caption text-negative text-weight-bold">2 Due Today</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="my-card bg-primary text-white">
          <q-card-section class="text-center">
            <div class="text-overline text-blue-2">Current Class</div>
            <div class="text-h6">Software Engineering</div>
            <div class="text-caption">Room 302 • 10:00 AM</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-h6">Upcoming Assignments</div>
            <q-space />
            <q-btn flat color="primary" label="See All" />
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item clickable v-ripple>
              <q-item-section side>
                <q-checkbox v-model="task1" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Database Migration Script</q-item-label>
                <q-item-label caption>Back-end Development Class</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="red" label="Due in 2h" />
              </q-item-section>
            </q-item>
            </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-primary">School Announcements</div>
          </q-card-section>
          <q-list padding>
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">Midterm Schedule Released</q-item-label>
                <q-item-label caption line="2">The schedule for next week's midterm examinations is now available on the portal...</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>


<script setup>
import { computed } from 'vue'
import { currUserStore } from 'src/stores/user/user'

const userStore = currUserStore()

const userData = computed(() => {
  return userStore.userData})
</script>