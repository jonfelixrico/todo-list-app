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
import { date } from 'quasar'
import { computed, defineComponent, reactive, Ref, ref, watch } from 'vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'

interface YearMonthModel {
  year: number
  month: number
}

function useEventsFetcher(
  dates: Ref<{ start: Date; end: Date }>
): Ref<string[]> {
  const events = ref<string[]>([])
  const { getTasks, lastWrite } = useTaskRepo()

  watch(
    [dates, lastWrite],
    async ([{ start, end }]) => {
      const tasks = await getTasks(start, end)
      const datesWithTasks = new Set<string>()

      for (const { dueDt, completeDt, carryOverUntil } of tasks) {
        // TODO ensure that getDateDiff is inclusive
        const daysBetween = date.getDateDiff(
          // TODO add comment why we do this
          new Date(
            Math.min(+(completeDt ?? carryOverUntil), +carryOverUntil, +end)
          ),
          dueDt
        )

        for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
          const computedDt = date.addToDate(dueDt, { days: daysToAdd })
          const asStr = date.formatDate(computedDt, 'YYYY/MM/DD')

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
  const now = new Date()
  const defaultYearMonth = date.formatDate(now, 'YYYY/MM')

  const yearMonthModel: YearMonthModel = reactive({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  })

  function onDateNavigate({ year, month }: YearMonthModel) {
    yearMonthModel.year = year
    yearMonthModel.month = month
  }

  const dateRange = computed(() => {
    const monthDt = date.buildDate({
      month: yearMonthModel.month,
      year: yearMonthModel.year,
    })

    return {
      start: date.startOfDate(monthDt, 'month'),
      end: date.endOfDate(now, 'day'),
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

      void setRouteDate(new Date(dateStr))
    }

    return {
      onDateClick,
      events,
      ...dateHarness,
    }
  },
})
</script>
