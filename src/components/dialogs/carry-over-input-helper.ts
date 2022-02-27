import { date } from 'quasar'
import { Ref, computed, ref, reactive } from 'vue'

/**
 * 'NO_CARRY_OVER' just means that the due date will be the carry over date.
 * 'DEFINITE' has a carry over on a certain date.
 */
export type TransformedCarryOver = 'NO_CARRY_OVER' | 'DEFINITE'

export function useCarryOverInputHelper(
  carryOver: Ref<Date | null>,
  dueDt: Ref<Date>
) {
  const dateData = ref(carryOver?.value ?? dueDt.value)

  function clampDate(toEval: Date) {
    const lowerBound = date.addToDate(dueDt.value, { day: 1 })
    return toEval < lowerBound ? lowerBound : toEval
  }

  const dateModel = computed({
    get: () => clampDate(dateData.value),
    set: (date: Date) => {
      carryOver.value = dateData.value = clampDate(date)
    },
  })

  const radioModel = computed<TransformedCarryOver>({
    get: () => {
      if (
        !carryOver.value ||
        carryOver.value.getTime() === dueDt.value.getTime()
      ) {
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

      carryOver.value = clampDate(dateData.value)
    },
  })

  return reactive({
    radioModel,
    dateModel,
  })
}
