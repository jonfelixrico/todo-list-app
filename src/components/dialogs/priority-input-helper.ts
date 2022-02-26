import { computed, reactive, ref, Ref } from 'vue'

const clamp = (value: number) => Math.max(Math.min(10, value), 1)

export function usePriorityInputHelper(priority: Ref<number | null>) {
  const priorityInput = ref(clamp(priority.value ?? 0))

  const inputModel = computed({
    get: () => priorityInput.value,
    set: (value: number) => {
      priorityInput.value = priority.value = clamp(value)
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
