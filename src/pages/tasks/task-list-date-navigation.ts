import { DateTime } from 'luxon'
import { date } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const DATE_FORMAT = 'yyyy-MM-dd'

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
