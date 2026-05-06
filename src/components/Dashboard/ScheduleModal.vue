<template>
  <q-page class="q-pa-md">
    <q-card class="shadow-2" style="max-width: 1200px; margin: 0 auto;">
      <q-card-section class="row items-center bg-primary text-white">
        <div class="text-h6">Weekly Class Schedule</div>
        <q-space />
        <q-btn icon="close" flat round @click="loadData" class="cursor-pointer" />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <!-- 
          QCalendarDay component 
          view="week" handles the Mon-Fri layout 
          interval-start="8" starts the day at 8:00 AM
        -->
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :weekdays="[1, 2, 3, 4, 5]"
          :interval-start="8"
          :interval-count="11"
          :interval-height="100"
          bordered
          animated
          @change="onCalendarChange"
        >
          <!-- This slot is where we "inject" your class boxes -->
          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for="event in getEvents(timestamp.date)" :key="event.id">
              <div
                class="my-event absolute q-pa-xs rounded-borders shadow-1"
                :style="getEventStyle(event, timeStartPos, timeDurationHeight)"
              >
                <div class="column full-height">
                  <div class="text-weight-bolder text-uppercase" style="font-size: 0.7rem">
                    {{ event.title }}
                  </div>
                  <div class="text-caption row items-center" style="font-size: 0.65rem">
                    <q-icon name="room" size="xs" class="q-mr-xs" /> {{ event.room }}
                  </div>
                  <div class="text-caption" style="font-size: 0.65rem">
                    {{ event.teacher }}
                  </div>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-day>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { QCalendarDay, today } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
import { scheduleStore } from 'src/stores/modules/Schedule/schedule'
import { renderToast } from 'src/utils/notify'

const schedStore = scheduleStore()
const selectedDate = ref(today())
const events = ref([])


const getRelativeDate = (dayName) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const targetDay = days.indexOf(dayName)
  const curr = new Date()
  const first = curr.getDate() - curr.getDay()
  const result = new Date(curr.setDate(first + targetDay))
  return result.toISOString().split('T')[0]
}


const getDuration = (start, end) => {
  const [h1, m1] = start.split(':').map(Number)
  const [h2, m2] = end.split(':').map(Number)
  return (h2 * 60 + m2) - (h1 * 60 + m1)
}

const loadData = async () => {
  try {
    const res = await schedStore.getSchedule()
    events.value = res.map(s => ({
      id: s.id,
      title: s.subject?.name || 'No Subject',
      date: getRelativeDate(s.day),
      time: s.start_time.substring(0, 5),
      duration: getDuration(s.start_time, s.end_time),
      room: s.room || 'TBA',
      teacher: s.teacher?.user?.first_name 
        ? `${s.teacher.user.first_name} ${s.teacher.user.last_name}` 
        : 'No Teacher'
    }))
  } catch (err) {
    renderToast('error', 'Fetch Failed', err.message || 'Check connection')
  }
}


const getEvents = (date) => {
  return events.value.filter(e => e.date === date)
}

const getEventStyle = (event, timeStartPos, timeDurationHeight) => {
  const s = {
    top: `${timeStartPos(event.time)}px`,
    height: `${timeDurationHeight(event.duration)}px`,
    width: '95%',
    left: '2.5%',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderLeft: '4px solid #1976d2',
    zIndex: 10
  }
  return s
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
}

.my-event:hover {
  filter: brightness(0.95);
  transform: scale(1.02);
  z-index: 20;
}

/* Adjust interval label colors */
:deep(.q-calendar-day__interval-label) {
  font-weight: bold;
  color: #757575;
}
</style>