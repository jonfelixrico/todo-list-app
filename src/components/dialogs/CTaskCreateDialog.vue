<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <h6 class="text-h6 q-my-none">{{ t('dialogs.taskCreate.title') }}</h6>
        <div class="text-caption">
          {{ t('dialogs.taskCreate.targetDtLbl') }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-y-md">
        <!-- Title -->
        <q-input
          v-model="task.title"
          type="textarea"
          outlined
          autogrow
          dense
          :label="t('dialogs.taskCreate.inputs.title.label')"
          :hint="t('dialogs.taskCreate.inputs.title.hint')"
        />

        <!-- Notes -->
        <q-input
          v-model="task.notes"
          type="textarea"
          outlined
          autogrow
          dense
          class="notes-input"
          :label="t('dialogs.taskCreate.inputs.notes.label')"
          :hint="t('dialogs.taskCreate.inputs.notes.hint')"
        />

        <!-- Priority -->
        <q-input
          v-model.number="task.priority"
          type="number"
          outlined
          min="1"
          max="10"
          step="0.1"
          dense
          :label="t('dialogs.taskCreate.inputs.priority.label')"
          :hint="t('dialogs.taskCreate.inputs.priority.hint')"
        />

        <!-- Carry-over -->
        <div class="column">
          <!-- No carry over -->
          <q-radio
            v-model="carryOver.radioModel"
            val="NO_CARRY_OVER"
            :label="t('dialogs.taskCreate.inputs.carryOver.options.no')"
          />

          <!-- Carry over until completed -->
          <q-radio
            v-model="carryOver.radioModel"
            val="INDEFINITE"
            :label="
              t('dialogs.taskCreate.inputs.carryOver.options.untilCompleted')
            "
          />

          <!-- Carry over until date (if not yet completed) -->
          <q-radio v-model="carryOver.radioModel" val="DEFINITE">
            <i18n-t
              keypath="dialogs.taskCreate.inputs.carryOver.options.untilDate"
              tag="div"
              class="row items-center preformatted"
            >
              <template #date>
                <q-input
                  outlined
                  dense
                  v-model="carryOver.dateModel"
                  :disable="carryOver.radioModel !== 'DEFINITE'"
                  :bottom-slots="false"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                        mask="date"
                        :rules="['date']"
                      >
                        <q-date v-model="carryOver.dateModel">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </template>
            </i18n-t>
          </q-radio>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="primary"
          noCaps
          unelevated
          :label="t('dialogs.taskCreate.buttons.create')"
          @click="onDialogOk"
        />

        <q-btn
          noCaps
          outline
          :label="t('dialogs.taskCreate.buttons.discard')"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { date, useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, reactive, toRef } from 'vue'
import { CarryOver } from 'src/typings/task.interface'
import { useCarryOverRadioHelper } from './carry-over-radio-helper'

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
      carryOver: useCarryOverRadioHelper(
        toRef(task, 'carryOverUntil'),
        toRef(props, 'targetDt')
      ),
    }
  },
})
</script>

<style lang="scss" scoped>
.notes-input ::v-deep(.q-field__control-container) {
  min-height: 300px;
}
</style>
