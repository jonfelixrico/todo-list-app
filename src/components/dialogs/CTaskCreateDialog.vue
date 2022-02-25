<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <h6 class="text-h6 q-my-none">Add To-do</h6>
        <div class="text-caption">For {{ formattedTargetDt }}</div>
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
          v-model.number="task.priority"
          type="number"
          outlined
          label="Priority"
          min="1"
          max="10"
          step="0.1"
          dense
          hint="The priority of what you want to do, raging from 1 to 10."
        />
        <q-radio v-model="carryOver" val="NO_CARRY_OVER" label="No" />
        <q-radio v-model="carryOver" val="INDEFINITE" label="Indefinite" />
        <q-radio v-model="carryOver" val="DEFINITE" label="Until" />
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
import { date, useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, reactive, Ref, toRef } from 'vue'
import { CarryOver } from 'src/typings/task.interface'

interface TaskDraftModel {
  title: string | null
  notes: string | null
  priority: number | null
  carryOverUntil: CarryOver
}

export interface TaskDraft extends TaskDraftModel {
  title: string
  priority: number
}

type TransformedCarryOver = 'NO_CARRY_OVER' | 'INDEFINITE' | 'DEFINITE'

function useCarryOverModel(carryOver: Ref<CarryOver>) {
  return computed({
    get: () => {
      if (!carryOver.value) {
        return 'NO_CARRY_OVER'
      } else if (carryOver.value === 'INDEFINITE') {
        return 'INDEFINITE'
      } else {
        // carryOver as date
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
          carryOver.value = new Date()
          break
        }

        case 'INDEFINITE': {
          carryOver.value = 'INDEFINITE'
          break
        }
      }
    },
  })
}

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  props: {
    persistent: Boolean,
    targetDt: {
      type: Date,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const task = reactive<TaskDraftModel>({
      title: null,
      notes: null,
      priority: null,
      carryOverUntil: null,
    })

    const formattedTargetDt = computed(() =>
      date.formatDate(props.targetDt, 'MMM D, YYYY')
    )

    return {
      dialogRef,
      onDialogHide,
      onDialogOk: () => onDialogOK(task),
      onDialogCancel,
      t,
      task,
      formattedTargetDt,
      carryOver: useCarryOverModel(toRef(task, 'carryOverUntil')),
    }
  },
})
</script>

<style lang="scss" scoped>
.notes-input ::v-deep(.q-field__control-container) {
  min-height: 300px;
}
</style>
