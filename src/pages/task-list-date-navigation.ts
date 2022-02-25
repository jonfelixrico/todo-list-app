import { date } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useTaskListDateNavigation() {
  const router = useRouter()

  const routeDate = computed(() => {
    const dateStr = router.currentRoute.value.params.date as string
    if (!date.isValid(dateStr)) {
      return null
    }

    return new Date(dateStr)
  })

  async function setRouteDate(toDate: Date) {
    const formatted = date.formatDate(toDate, 'DD-MM-YYYY')
    await router.push({
      name: 'tasksFiltered',
      params: { date: formatted },
    })
  }

  return {
    routeDate,
    setRouteDate,
  }
}
