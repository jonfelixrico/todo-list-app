import { clamp } from 'lodash'
import { computed, reactive, ref, Ref } from 'vue'

const MIN_PRIORITY = 1
const MAX_PRIORITY = 10

const clampPriority = (value: number) =>
  clamp(value, MIN_PRIORITY, MAX_PRIORITY)

export function usePriorityInputHelper(priority: Ref<number | null>) {
  const priorityInput = ref(clampPriority(priority.value ?? 0))

  const inputModel = computed({
    get: () => priorityInput.value,
    set: (value: number) => {
      priorityInput.value = priority.value = clampPriority(value)
    },
  })

  const checkboxModel = computed({
    get: () => !!(priority.value ?? 0),
    set: (hasPriority: boolean) => {
      if (!hasPriority) {
        priority.value = 0
        return
      }

      priority.value = inputModel.value
    },
  })

  return reactive({
    /**
     * This is the model for the "has priority?" checkbox.
     *
     * - Changing to true will cause `priority` to take on the current value of
     * `inputModel`.
     * - Changing to false will cause `priority` to have a value of 0 (no priority).
     */
    checkboxModel,

    /**
     * This is the model for the priority value input. Forces values to stay within 1-10 (inclusive).
     */
    inputModel,
  })
}
