<template>
  <!-- Title -->
  <div class="q-gutter-y-sm">
    <label for="title" class="text-weight-bold">
      {{ t('task.form.inputs.title.label') }}
    </label>

    <q-input
      v-model="title"
      type="textarea"
      outlined
      autogrow
      dense
      :hint="t('task.form.inputs.title.hint')"
      :rules="[(val) => !!val || t('task.form.inputs.title.error')]"
      id="title"
    />
  </div>

  <!-- Notes -->
  <div class="q-gutter-y-sm">
    <label for="notes" class="text-weight-bold">
      {{ t('task.form.inputs.notes.label') }}
    </label>

    <q-input
      v-model="notes"
      type="textarea"
      outlined
      autogrow
      dense
      :hint="t('task.form.inputs.notes.hint')"
      id="notes"
    />
  </div>

  <!-- Priority -->
  <div class="q-gutter-y-sm">
    <label for="priority" class="text-weight-bold">
      {{ t('task.form.inputs.priority.label') }}
    </label>

    <q-input
      v-model.number="priority"
      type="number"
      outlined
      min="1"
      max="10"
      step="0.1"
      dense
      :hint="t('task.form.inputs.priority.hint')"
      class="col"
      id="priority"
    />
  </div>

  <!-- Carry-over -->
  <div class="q-gutter-y-sm">
    <label for="carryOverDays" class="text-weight-bold">
      {{ t('task.form.inputs.carryOverDays.label') }}
    </label>

    <q-input
      v-model.number="carryOverDays"
      type="number"
      outlined
      min="0"
      max="31"
      step="1"
      dense
      :hint="t('task.form.inputs.carryOverDays.hint')"
      class="col"
      id="carryOverDays"
    />
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, PropType } from 'vue'
import { DateTime } from 'luxon'

export interface TaskFieldValues {
  title?: string
  notes?: string
  priority?: number
  carryOverDays?: number
}

export default defineComponent({
  props: {
    dueDt: {
      type: DateTime,
      required: true,
    },

    modelValue: Object as PropType<TaskFieldValues>,
  },

  emits: ['updated:modelValue'],

  setup(props, { emit }) {
    const { t } = useI18n()

    function emitValue<K extends keyof TaskFieldValues>(
      key: K,
      value: TaskFieldValues[K]
    ) {
      emit('updated:modelValue', {
        ...props.modelValue,
        [key]: value,
      })
    }

    const title = computed({
      get: () => props.modelValue?.title,
      set: (title) => {
        emitValue('title', title)
      },
    })

    const notes = computed({
      get: () => props.modelValue?.notes,
      set: (notes) => {
        emitValue('notes', notes)
      },
    })

    const priority = computed({
      get: () => props.modelValue?.priority ?? 0,
      set: (priority) => {
        emitValue('priority', priority)
      },
    })

    const carryOverDays = computed({
      get: () => props.modelValue?.carryOverDays ?? 0,
      set: (carryOverDays) => {
        emitValue('carryOverDays', carryOverDays)
      },
    })

    return {
      t,
      title,
      notes,
      priority,
      carryOverDays,
    }
  },
})
</script>

<style lang="scss" scoped>
#notes ::v-deep(.q-field__control-container) {
  min-height: 10vh;
}
</style>
