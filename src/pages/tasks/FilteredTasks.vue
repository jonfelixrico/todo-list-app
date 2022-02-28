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
    <div class="col" v-if="tasks.length">
      <div style="max-width: 1024px; margin: auto" class="q-gutter-y-md">
        <CTaskListCard v-for="task of tasks" :key="task.id" :task="task" />
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
import CTaskListCard from 'src/components/tasks/CTaskListCard.vue'

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
  components: { CTaskListCard },

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
