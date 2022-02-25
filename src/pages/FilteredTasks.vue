<template>
  <div>{{ routeDate }}</div>
</template>

<script lang="ts">
import { date } from 'quasar'
import { defineComponent } from 'vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'

export default defineComponent({
  setup() {
    const { routeDate } = useTaskListDateNavigation()

    return {
      routeDate,
    }
  },

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
