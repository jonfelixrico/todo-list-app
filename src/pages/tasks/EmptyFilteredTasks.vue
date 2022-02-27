<template>
  <q-page class="flex flex-center">
    <q-date
      :events="daysWithTasks"
      :model-value="null"
      @update:model-value="onDateClick"
    />
  </q-page>
</template>

<script lang="ts">
import { date } from 'quasar'
import { useDateWithTasksFetcher } from 'src/hooks/task.hooks'
import { computed, defineComponent } from 'vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'

export default defineComponent({
  setup() {
    const { setRouteDate } = useTaskListDateNavigation()

    const daysWithTasks = useDateWithTasksFetcher()
    const transformedDwt = computed(() =>
      daysWithTasks.value.map((d) => date.formatDate(d, 'YYYY/MM/DD'))
    )

    const transformedDwtSet = computed(() => {
      return new Set(transformedDwt.value)
    })

    function onDateClick(dateStr: string) {
      if (!transformedDwtSet.value.has(dateStr)) {
        // do not allow navigation to dates without tasks
        return null
      }

      void setRouteDate(new Date(dateStr))
    }

    return {
      onDateClick,
      daysWithTasks: transformedDwt,
    }
  },
})
</script>
