<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <h6 class="text-h6 q-my-none">Add To-do</h6>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-y-md">
        <q-input
          v-model="task.title"
          type="textarea"
          outlined
          autogrow
          dense
          label="Title"
          hint="Description or title of what you want to do."
        />
        <q-input
          v-model="task.notes"
          type="textarea"
          outlined
          autogrow
          dense
          label="Notes"
          class="notes-input"
          hint="Optional. Place additional details of your task here."
        />
        <q-input
          v-model.number="task.priorty"
          type="number"
          outlined
          label="Priority"
          min="1"
          max="10"
          step="0.1"
          dense
          hint="The priority of what you want to do, raging from 1 to 10."
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="primary"
          noCaps
          unelevated
          :label="t('common.ok')"
          @click="onDialogOk"
        />
        <q-btn
          noCaps
          flat
          :label="t('common.cancel')"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export interface TaskDraft {
  title: string | null
  notes: string | null
  priority: number | null
}

export default {
  emits: [...useDialogPluginComponent.emits],

  props: {
    persistent: Boolean,
  },

  setup() {
    const { t } = useI18n()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const task = ref<TaskDraft>({
      title: null,
      notes: null,
      priority: null,
    })

    return {
      dialogRef,
      onDialogHide,
      onDialogOk: () => onDialogOK(task),
      onDialogCancel,
      t,
      task,
    }
  },
}
</script>

<style lang="scss" scoped>
.notes-input ::v-deep .q-field__control-container {
  min-height: 300px;
}
</style>
