import { date } from 'quasar'
import { CarryOver } from 'src/typings/task.interface'
import { Ref, computed, ref, reactive } from 'vue'

export type TransformedCarryOver = 'NO_CARRY_OVER' | 'INDEFINITE' | 'DEFINITE'

export function useCarryOverRadioHelper(
  carryOver: Ref<CarryOver>,
  targetDt: Ref<Date>
) {
  const definiteDate = ref(date.addToDate(targetDt.value, { day: 1 }))

  const dateModel = computed({
    get: () => date.formatDate(definiteDate.value, 'YYYY/MM/DD'),

    set: (dateStr: string) => {
      carryOver.value = definiteDate.value = date.extractDate(
        dateStr,
        'YYYY/MM/DD'
      )
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
          carryOver.value = definiteDate.value
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
