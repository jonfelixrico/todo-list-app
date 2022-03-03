import { describe, expect, it } from '@jest/globals'
import { usePriorityInputHelper } from 'src/components/dialogs/priority-input-helper'
import { ref } from 'vue'

describe('usePriorityInputHelper', () => {
  it('checkbox model should be true if prio is more than 0', () => {
    const prio = ref(1)
    const helperValues = usePriorityInputHelper(prio)
    expect(helperValues.checkboxModel).toBe(true)
  })

  it('checkbox model should be false if prio is 0', () => {
    const prio = ref(0)
    const helperValues = usePriorityInputHelper(prio)
    expect(helperValues.checkboxModel).toBe(false)
  })

  it('should have an input model of at least 1 if initial value is 0', () => {
    const prio = ref(0)
    const helperValues = usePriorityInputHelper(prio)
    expect(helperValues.inputModel).toBe(1)
  })

  it('input value and prio value should be the same if true value is not 0', () => {
    const prio = ref(5)
    const helperValues = usePriorityInputHelper(prio)

    expect(prio.value).toBe(5)
    expect(helperValues.inputModel).toBe(5)
    expect(prio.value).toBe(helperValues.inputModel)
  })

  it('input value should still retain previous prio value if checkbox is set from true to false', () => {
    const INIT_PRIO_VALUE = 5
    const prio = ref(INIT_PRIO_VALUE)
    const helperValues = usePriorityInputHelper(prio)

    expect(helperValues.checkboxModel).toBe(true)
    helperValues.checkboxModel = false
    expect(helperValues.checkboxModel).toBe(false)
    expect(helperValues.inputModel).toBe(INIT_PRIO_VALUE)
  })
})
