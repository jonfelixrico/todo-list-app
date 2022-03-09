<template>
  <q-page class="flex flex-center">
    <q-date
      :events="events"
      :default-year-month="defaultYearMonth"
      :model-value="null"
      @update:model-value="onDateClick"
      @navigation="onDateNavigate"
    />
  </q-page>
</template>

<script lang="ts">
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { computed, defineComponent, reactive, Ref, ref, watch } from 'vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'
import { DateTime } from 'luxon'

interface YearMonthModel {
  year: number
  month: number
}

function useEventsFetcher(
  dates: Ref<{ start: DateTime; end: DateTime }>
): Ref<string[]> {
  const events = ref<string[]>([])
  const { getTasks, lastWrite } = useTaskRepo()

  watch(
    [dates, lastWrite],
    async ([{ start, end }]) => {
      const tasks = await getTasks(start, end)
      const datesWithTasks = new Set<string>()

      for (const { dueDt, completeDt, carryOverUntil } of tasks) {
        const daysBetween = DateTime.min(
          completeDt ?? carryOverUntil,
          carryOverUntil,
          end
        ).diff(dueDt, 'days').days

        for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
          const computedDt = dueDt.plus({ days: daysToAdd })
          const asStr = computedDt.toFormat('YYYY/MM/DD')

          if (!datesWithTasks.has(asStr)) {
            datesWithTasks.add(asStr)
          }
        }
      }

      events.value = [...datesWithTasks]
    },
    {
      immediate: true,
    }
  )

  return events
}

function useDateHarness() {
  const now = DateTime.now()
  const defaultYearMonth = now.toFormat('YYYY/MM')

  const yearMonthModel: YearMonthModel = reactive({
    year: now.year,
    month: now.month,
  })

  function onDateNavigate({ year, month }: YearMonthModel) {
    yearMonthModel.year = year
    yearMonthModel.month = month
  }

  const dateRange = computed(() => {
    const monthDt = DateTime.fromObject({
      month: yearMonthModel.month,
      year: yearMonthModel.year,
    })

    return {
      start: monthDt.startOf('month'),
      end: now.endOf('day'),
    }
  })

  return {
    defaultYearMonth,
    onDateNavigate,
    dateRange,
  }
}

export default defineComponent({
  setup() {
    const { setRouteDate } = useTaskListDateNavigation()

    const { dateRange, ...dateHarness } = useDateHarness()
    const events = useEventsFetcher(dateRange)

    function onDateClick(dateStr: string) {
      if (!events.value.includes(dateStr)) {
        // do not allow navigation to dates without tasks
        return null
      }

      void setRouteDate(DateTime.fromISO(dateStr))
    }

    return {
      onDateClick,
      events,
      ...dateHarness,
    }
  },
})
</script>
