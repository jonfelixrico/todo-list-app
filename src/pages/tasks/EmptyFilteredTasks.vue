<template>
  <div class="fit flex flex-center">
    <q-date
      :events="events"
      :model-value="null"
      @update:model-value="onDateClick"
    />
  </div>
</template>

<script lang="ts">
import { date } from 'quasar'
import { useStore } from 'src/store'
import { computed, defineComponent } from 'vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'

export default defineComponent({
  setup() {
    const { setRouteDate } = useTaskListDateNavigation()
    const store = useStore()

    const uniqueDates = computed(() => {
      const uniqueDates = new Set<Date>([])
      for (const { targetDt } of store.state.tasks.tasks) {
        if (!uniqueDates.has(targetDt)) {
          uniqueDates.add(targetDt)
        }
      }

      return new Set(
        [...uniqueDates].map((d) => date.formatDate(d, 'YYYY/MM/DD'))
      )
    })

    const events = computed(() => {
      return [...uniqueDates.value]
    })

    function onDateClick(dateStr: string) {
      if (!uniqueDates.value.has(dateStr)) {
        // do not allow navigation to dates without tasks
        return null
      }

      void setRouteDate(new Date(dateStr))
    }

    return {
      onDateClick,
      events,
    }
  },
})
</script>
