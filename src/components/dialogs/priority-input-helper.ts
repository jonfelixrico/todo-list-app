import { computed, reactive, ref, Ref } from 'vue'

export function usePriorityInputHelper(priority: Ref<number>) {
  const priorityInput = ref(priority.value)

  const checkboxModel = computed({
    get: () => !!priority.value,
    set: (hasPriority: boolean) => {
      if (!hasPriority) {
        priority.value = 0
        return
      }

      priority.value = priorityInput.value
    },
  })

  const inputModel = computed({
    get: () => priorityInput.value,
    set: (value: number) => {
      priorityInput.value = priority.value = Math.max(Math.min(10, value), 1)
    },
  })

  return reactive({
    checkboxModel,
    inputModel,
  })
}
