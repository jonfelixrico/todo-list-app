<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <h6 class="text-h6 q-my-none">{{ t('dialogs.taskCreate.title') }}</h6>
        <div class="text-caption text-grey-6">
          {{
            t('dialogs.taskCreate.targetDtLbl', {
              targetDate: formattedTargetDt,
            })
          }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-y-lg">
        <!-- Title -->
        <div class="q-gutter-y-sm">
          <!-- TODO do proper a11y support for labels -->
          <div class="text-weight-bold">
            {{ t('dialogs.taskCreate.inputs.title.label') }}
          </div>
          <q-input
            v-model="task.title"
            type="textarea"
            outlined
            autogrow
            dense
            :hint="t('dialogs.taskCreate.inputs.title.hint')"
          />
        </div>

        <!-- Notes -->
        <div class="q-gutter-y-sm">
          <div class="text-weight-bold">
            {{ t('dialogs.taskCreate.inputs.notes.label') }}
          </div>
          <q-input
            v-model="task.notes"
            type="textarea"
            outlined
            autogrow
            dense
            class="notes-input"
            :hint="t('dialogs.taskCreate.inputs.notes.hint')"
          />
        </div>

        <!-- Priority -->
        <div class="q-gutter-y-sm">
          <div class="text-weight-bold">
            {{ t('dialogs.taskCreate.inputs.priority.label') }}
          </div>
          <q-input
            v-model.number="task.priority"
            type="number"
            outlined
            min="1"
            max="10"
            step="0.1"
            dense
            :hint="t('dialogs.taskCreate.inputs.priority.hint')"
          />
        </div>

        <!-- Carry-over -->
        <div class="q-gutter-y-sm">
          <div class="text-weight-bold">
            {{ t('dialogs.taskCreate.inputs.carryOver.label') }}
          </div>
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
              <!--
              The use of `preformatted` here is requried for HTML to honor the space between
              "...over until {date}"
            -->
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
import { computed, defineComponent, reactive, toRef, PropType } from 'vue'
import { CarryOver, DraftTaskData } from 'src/typings/task.interface'
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

export type TaskCreateInitialData = Omit<DraftTaskData, 'targetDt'>
function createTaskData(initialData?: TaskCreateInitialData) {
  return reactive<TaskDraftModel>({
    title: initialData?.title ?? null,
    notes: initialData?.notes ?? null,
    priority: initialData?.priority ?? null,
    carryOverUntil: initialData?.carryOverUntil ?? null,
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

    initialData: Object as PropType<TaskCreateInitialData>,
  },

  setup(props) {
    const { t } = useI18n()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const task = createTaskData(props.initialData)

    const formattedTargetDt = computed(() =>
      date.formatDate(props.targetDt, 'MMM D, YYYY')
    )

    const carryOver = useCarryOverRadioHelper(
      toRef(task, 'carryOverUntil'),
      toRef(props, 'targetDt')
    )

    return {
      dialogRef,
      onDialogHide,
      onDialogOk: () => onDialogOK(task),
      onDialogCancel,
      t,
      task,
      formattedTargetDt,
      carryOver,
    }
  },
})
</script>

<style lang="scss" scoped>
.notes-input ::v-deep(.q-field__control-container) {
  min-height: 300px;
}
</style>
