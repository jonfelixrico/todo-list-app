import { Ref, computed, ref, reactive } from 'vue'

export type TransformedCarryOver = 'NO_CARRY_OVER' | 'DEFINITE'

export function useCarryOverInputHelper(
  carryOver: Ref<Date | null>,
  dueDt: Ref<Date>
) {
  const dateData = ref(carryOver?.value ?? dueDt.value)

  const dateModel = computed({
    get: () => dateData.value,
    set: (date: Date) => {
      carryOver.value = dateData.value = date
    },
  })

  const radioModel = computed({
    get: () => {
      if (carryOver.value === dueDt.value) {
        return 'NO_CARRY_OVER'
      } else {
        return 'DEFINITE'
      }
    },

    set: (val: TransformedCarryOver) => {
      if (val === 'NO_CARRY_OVER') {
        carryOver.value = dueDt.value
        return
      }

      carryOver.value = dateModel.value
    },
  })

  return reactive({
    radioModel,
    dateModel,
  })
}
