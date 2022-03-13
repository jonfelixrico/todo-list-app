import { DateTime } from 'luxon'
import { Ref, computed, ref, reactive } from 'vue'

/**
 * 'NO_CARRY_OVER' just means that the due date will be the carry over date.
 * 'DEFINITE' has a carry over on a certain date.
 */
export type TransformedCarryOver = 'NO_CARRY_OVER' | 'DEFINITE'

export function useCarryOverInputHelper(
  carryOver: Ref<DateTime | null>,
  dueDt: Ref<DateTime>
) {
  const dateData = ref(carryOver?.value ?? dueDt.value)

  function clampDate(toEval: DateTime, dueDt: DateTime) {
    const lowerBound = dueDt.plus({ day: 1 })
    return DateTime.max(toEval, lowerBound)
  }

  const dateModel = computed({
    get: () => clampDate(dateData.value, dueDt.value).toJSDate(),
    set: (date: Date) => {
      carryOver.value = dateData.value = clampDate(
        DateTime.fromJSDate(date),
        dueDt.value
      )
    },
  })

  const radioModel = computed<TransformedCarryOver>({
    get: () => {
      if (!carryOver.value || carryOver.value.equals(dueDt.value)) {
        return 'NO_CARRY_OVER'
      } else {
        return 'DEFINITE'
      }
    },

    set: (val) => {
      if (val === 'NO_CARRY_OVER') {
        carryOver.value = dueDt.value
        return
      }

      carryOver.value = clampDate(dateData.value, dueDt.value)
    },
  })

  return reactive({
    radioModel,
    dateModel,
  })
}
