import { CarryOver } from 'src/typings/task.interface'
import { Ref, computed, ref, reactive } from 'vue'

export type TransformedCarryOver = 'NO_CARRY_OVER' | 'INDEFINITE' | 'DEFINITE'

export function useCarryOverInputHelper(
  carryOver: Ref<CarryOver>,
  dueDt: Ref<Date>
) {
  const dateData = ref(
    carryOver.value instanceof Date ? carryOver.value : dueDt.value
  )

  const dateModel = computed({
    get: () => dateData.value,
    set: (date: Date) => {
      carryOver.value = dateData.value = date
    },
  })

  const radioModel = computed({
    get: () => {
      if (!carryOver.value) {
        return 'NO_CARRY_OVER'
      } else if (carryOver.value === 'INDEFINITE') {
        return 'INDEFINITE'
      } else {
        // carryOver instanceof Date is true
        return 'DEFINITE'
      }
    },

    set: (val: TransformedCarryOver) => {
      switch (val) {
        case 'NO_CARRY_OVER': {
          carryOver.value = null
          break
        }

        case 'DEFINITE': {
          carryOver.value = dateModel.value
          break
        }

        case 'INDEFINITE': {
          carryOver.value = 'INDEFINITE'
          break
        }
      }
    },
  })

  return reactive({
    radioModel,
    dateModel,
  })
}
