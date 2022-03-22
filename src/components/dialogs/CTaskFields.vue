<template>
  <!-- Title -->
  <div class="q-gutter-y-sm">
    <label for="title" class="text-weight-bold">
      {{ t('tasks.form.title.label') }}
    </label>

    <q-input
      v-model="titleModel"
      type="textarea"
      outlined
      autogrow
      dense
      :hint="t('tasks.form.title.hint')"
      :rules="[(val) => !!val || t('tasks.form.title.error')]"
      id="title"
    />
  </div>

  <!-- Notes -->
  <div class="q-gutter-y-sm">
    <label for="notes" class="text-weight-bold">
      {{ t('tasks.form.notes.label') }}
    </label>

    <q-input
      v-model="notesModel"
      type="textarea"
      outlined
      autogrow
      dense
      :hint="t('tasks.form.notes.hint')"
      id="notes"
    />
  </div>

  <!-- Priority -->
  <div class="q-gutter-y-sm">
    <label for="priority" class="text-weight-bold">
      {{ t('tasks.form.priority.label') }}
    </label>

    <q-input
      v-model.number="priorityModel"
      type="number"
      outlined
      min="0"
      max="10"
      step="0.1"
      dense
      :hint="t('tasks.form.priority.hint')"
      class="col"
      id="priority"
    />
  </div>

  <!-- Carry-over -->
  <div class="q-gutter-y-sm">
    <label for="carryOverDays" class="text-weight-bold">
      {{ t('tasks.form.carryOver.label') }}
    </label>

    <q-input
      v-model.number="carryOverDaysModel"
      type="number"
      outlined
      min="0"
      max="31"
      step="1"
      dense
      :hint="t('tasks.form.carryOver.hint')"
      class="col"
      id="carryOverDays"
    />
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, defineComponent } from 'vue'
import { DateTime } from 'luxon'

export default defineComponent({
  props: {
    dueDt: {
      type: DateTime,
      required: true,
    },

    title: String,
    notes: String,
    priority: Number,
    carryOverDays: Number,
  },

  emits: [
    'update:title',
    'update:notes',
    'update:priority',
    'update:carryOverDays',
  ],

  setup(props, { emit }) {
    const { t } = useI18n()

    const titleModel = computed({
      get: () => props.title,
      set: (title) => {
        emit('update:title', title)
      },
    })

    const notesModel = computed({
      get: () => props.notes,
      set: (notes) => {
        emit('update:notes', notes)
      },
    })

    const priorityModel = computed({
      get: () => props.priority ?? 0,
      set: (priority) => {
        emit('update:priority', priority)
      },
    })

    const carryOverDaysModel = computed({
      get: () => props.carryOverDays ?? 0,
      set: (carryOverDays) => {
        emit('update:carryOverDays', carryOverDays)
      },
    })

    return {
      t,
      titleModel,
      notesModel,
      priorityModel,
      carryOverDaysModel,
    }
  },
})
</script>

<style lang="scss" scoped>
#notes ::v-deep(.q-field__control-container) {
  min-height: 10vh;
}
</style>
