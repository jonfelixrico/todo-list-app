import { DateTime } from 'luxon'
import { date } from 'quasar'
import { computed, inject, InjectionKey, Ref } from 'vue'
import { useRouter, Router } from 'vue-router'

const DATE_FORMAT = 'yyyy-MM-dd'

function fallbackTaskListNavigation(): TaskListDateNavigator {
  const router = useRouter()

  const routeDate = computed(() => {
    const dateStr = router.currentRoute.value.params.date as string
    if (!date.isValid(dateStr)) {
      return null
    }

    return DateTime.fromFormat(dateStr, DATE_FORMAT).startOf('day')
  })

  const setRouteDate = (toDate: DateTime) => {
    return router.push({
      name: 'filteredTasks',
      params: { date: toDate.toFormat(DATE_FORMAT) },
    })
  }

  return {
    /**
     * Parsed version of the `date` route param.
     */
    routeDate,
    /**
     * Helper method to change the `date` route param (causes navigation).
     */
    setRouteDate,
  }
}

export const TaskListDateNavigatorKey: InjectionKey<TaskListDateNavigator> =
  Symbol('task list date navigation')

export interface TaskListDateNavigator {
  routeDate: Ref<DateTime | null>
  setRouteDate(toDate: DateTime): ReturnType<Router['push']>
}

export function useTaskListDateNavigator() {
  return inject(TaskListDateNavigatorKey, fallbackTaskListNavigation, true)
}
