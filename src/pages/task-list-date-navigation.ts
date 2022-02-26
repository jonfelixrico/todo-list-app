import { date } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Utils for manipulating the `date` query param.
 * Intended for use with the `task` named route and its subroutes.
 */
export function useTaskListDateNavigation() {
  const router = useRouter()

  const routeDate = computed(() => {
    const dateStr = router.currentRoute.value.params.date as string
    if (!date.isValid(dateStr)) {
      return null
    }

    return date.startOfDate(date.extractDate(dateStr, DATE_FORMAT), 'day')
  })

  const setRouteDate = (toDate: Date) => {
    const formatted = date.formatDate(toDate, DATE_FORMAT)
    return router.push({
      name: 'filteredTasks',
      params: { date: formatted },
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
