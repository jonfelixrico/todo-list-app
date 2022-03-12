import { DateTime } from 'luxon'
import { date } from 'quasar'
import { computed, inject, InjectionKey, Ref } from 'vue'
import { useRouter, Router } from 'vue-router'

const DATE_FORMAT = 'yyyy-MM-dd'

function fallbackTaskListNavigation() {
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

export const TaskListDateNavigatorComposableKey: InjectionKey<TaskListDateNavigatorComposable> =
  Symbol('task list date navigation')

export interface TaskListDateNavigatorComposable {
  routeDate: Ref<DateTime>
  setRouteDate(toDate: DateTime): ReturnType<Router['push']>
}

export function useTaskListNavigator() {
  const abstractComposable = inject(TaskListDateNavigatorComposableKey)

  if (abstractComposable) {
    return abstractComposable
  }

  return fallbackTaskListNavigation()
}
