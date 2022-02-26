<template>
  <q-page class="column">
    <q-toolbar class="bg-secondary row justify-center">{{
      routeDate
    }}</q-toolbar>
    <div class="col">
      <template
        v-for="{ targetDt, tasks } in taskGroups"
        :key="targetDt.getTime()"
      >
        <div>{{ targetDt }}</div>
        <q-card v-for="{ title, id } of tasks" :key="id">
          <q-card-section>
            {{ title }}
          </q-card-section>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
import { date } from 'quasar'
import { ComputedRef, defineComponent } from 'vue'
import { useTaskFilter } from './filter-task-helper'
import { useTaskListDateNavigation } from './task-list-date-navigation'

export default defineComponent({
  setup() {
    const dateNav = useTaskListDateNavigation()
    /*
     * Force-typing this as Date since we assume that beforeRouteEnter will prevent `routeDate`
     * from having a value of null, only valid dates.
     */
    const routeDate = dateNav.routeDate as ComputedRef<Date>

    return {
      routeDate,
      taskGroups: useTaskFilter(routeDate),
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
