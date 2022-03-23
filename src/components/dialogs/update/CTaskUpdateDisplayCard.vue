<template>
  <q-card>
    <q-card-section>
      <div>
        <h1 class="q-my-none text-h6">
          {{ t('tasks.dialogs.details.title') }}
        </h1>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-gutter-y-lg">
      <!-- Title -->
      <div class="q-gutter-y-sm">
        <div class="text-weight-bold">
          {{ t('tasks.form.title.label') }}
        </div>

        <div>{{ task.title }}</div>
      </div>

      <!-- Notes -->
      <div class="q-gutter-y-sm">
        <div class="text-weight-bold">
          {{ t('tasks.form.notes.label') }}
        </div>

        <div>{{ task.notes }}</div>
      </div>

      <!-- Priority -->
      <div class="q-gutter-y-sm">
        <div class="text-weight-bold">
          {{ t('tasks.form.priority.label') }}
        </div>

        <div>{{ task.priority }}</div>
      </div>

      <!-- Carry-over -->
      <div class="q-gutter-y-sm">
        <div class="text-weight-bold">
          {{ t('tasks.form.carryOver.label') }}
        </div>

        <div>{{ task.carryOverUntil.toLocaleString(DateTime.DATE_MED) }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat no-caps @click="$emit('close')">{{
        t('tasks.dialogs.details.close')
      }}</q-btn>

      <q-btn color="primary" unelevated no-caps @click="$emit('update')">{{
        t('tasks.dialogs.details.update')
      }}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'

interface Task {
  title: string
  notes: string | null
  priority: number
  carryOverUntil: DateTime
  dueDt: DateTime
}

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },

  emits: ['update', 'close'],

  setup() {
    const { t } = useI18n()
    return { t, DateTime }
  },
})
</script>
