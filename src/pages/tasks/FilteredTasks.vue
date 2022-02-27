<template>
  <q-page class="column">
    <q-toolbar class="bg-secondary justify-between">
      <!-- go back 1 day -->
      <q-btn
        icon="arrow_left"
        @click="setRouteDate(adjacentDates.prev)"
        :label="formatDate(adjacentDates.prev)"
        unelevated
        color="white"
        text-color="black"
        no-caps
      />
      <h2 class="text-h5 q-my-none">{{ formatDate(routeDate) }}</h2>

      <!-- go forward 1 day -->
      <q-btn
        @click="setRouteDate(adjacentDates.next)"
        :label="formatDate(adjacentDates.next)"
        unelevated
        color="white"
        text-color="black"
        icon-right="arrow_right"
        no-caps
      />
    </q-toolbar>
    <div class="col" v-if="taskGroups.length">
      <div style="max-width: 1024px; margin: auto" class="q-gutter-y-lg">
        <template v-for="{ dueDt, tasks } in taskGroups" :key="dueDt">
          <h3 class="text-center text-h6">{{ formatDate(dueDt) }}</h3>
          <q-card v-for="{ title, notes, id, priority } of tasks" :key="id">
            <q-card-section class="row">
              <div class="col q-gutter-y-md">
                <div>
                  <h5 class="text-h6 q-ma-none preformatted" v-text="title" />
                  <div class="text-caption text-grey-8" v-if="priority">
                    Priority {{ priority }}
                  </div>
                </div>

                <div
                  v-if="notes"
                  v-text="notes"
                  class="preformatted q-pa-sm bg-grey-3 rounded-borders"
                />
              </div>
            </q-card-section>
          </q-card>
        </template>
      </div>
    </div>

    <div v-else class="col flex flex-center">
      <h3 class="text-h6">No tasks.</h3>
    </div>
  </q-page>
</template>

<script lang="ts">
import { date } from 'quasar'
import { useFilteredTaskList } from 'src/pages/tasks/task-list-helper'
import { computed, ComputedRef, defineComponent } from 'vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'

function useNavigation() {
  const dateNav = useTaskListDateNavigation()
  /*
   * Force-typing this as Date since we assume that beforeRouteEnter will prevent `routeDate`
   * from having a value of null, only valid dates.
   */
  const routeDate = dateNav.routeDate as ComputedRef<Date>

  const adjacentDates = computed(() => {
    return {
      prev: date.subtractFromDate(routeDate.value, { day: 1 }),
      next: date.addToDate(routeDate.value, { day: 1 }),
    }
  })

  function formatDate(toFormat: Date) {
    return date.formatDate(toFormat, 'MMM D, YYYY')
  }

  return {
    routeDate,
    adjacentDates,
    setRouteDate: dateNav.setRouteDate,
    formatDate,
  }
}

export default defineComponent({
  setup() {
    const { routeDate, ...others } = useNavigation()

    return {
      ...others,
      ...useFilteredTaskList(routeDate),
      routeDate,
    }
  },

  /**
   * This route guard will automaticall redirect the user back to the `tasks` route if it detects
   * an invalid date.
   * @param to
   * @param _
   * @param next
   */
  beforeRouteEnter(to, _, next) {
    const dateStr = to.params.date as string
    const isValid = date.isValid(dateStr)

    if (!isValid) {
      console.log(
        'FilteredTasks: %s is an invalid date. Redirected to tasks instead.',
        dateStr
      )
      next({ name: 'tasks' })
      return
    }

    next()
  },
})
</script>
