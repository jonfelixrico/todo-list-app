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
import { uniq } from 'lodash'

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
      const dates = tasks
        .map(({ dueDt, completeDt, carryOverUntil }) => {
          // TODO ensure that getDateDiff is inclusive
          const daysBetween = date.getDateDiff(
            // TODO add comment why we do this
            completeDt && completeDt <= carryOverUntil
              ? completeDt
              : carryOverUntil,
            dueDt
          )

          const dates: Date[] = []
          for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
            dates.push(date.addToDate(dueDt, { days: daysToAdd }))
          }

          return dates
        })
        .flat()
        .map((dt) => date.formatDate(dt, 'YYYY/MM/DD'))

      events.value = uniq(dates)
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
      end: date.endOfDate(monthDt, 'month'),
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
