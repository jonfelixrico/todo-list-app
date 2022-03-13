<template>
  <q-form @submit="onSubmit" autofocus>
    <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <h6 class="text-h6 q-my-none">{{ t('dialogs.taskCreate.title') }}</h6>
          <div class="text-caption text-grey-6">
            {{
              t('dialogs.taskCreate.dueDtLbl', {
                dueDt: formattedDueDt,
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
              :rules="[
                (val) => !!val || t('dialogs.taskCreate.inputs.title.error'),
              ]"
            />
          </div>

          <!-- Notes -->
          <div class="q-gutter-y-sm">
            <!-- TODO do proper a11y support for labels -->
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
            <!-- TODO do proper a11y support for labels -->
            <div class="text-weight-bold">
              {{ t('dialogs.taskCreate.inputs.priority.label') }}
            </div>
            <div class="row items-start q-gutter-x-sm">
              <q-checkbox
                :label="t('dialogs.taskCreate.inputs.hasPriority.label')"
                v-model="priority.checkboxModel"
              />
              <q-input
                :disable="!priority.checkboxModel"
                v-model.number="priority.inputModel"
                type="number"
                outlined
                min="1"
                max="10"
                step="0.1"
                dense
                :hint="t('dialogs.taskCreate.inputs.priority.hint')"
                class="col"
              />
            </div>
          </div>

          <!-- Carry-over -->
          <div class="q-gutter-y-sm">
            <!-- TODO do proper a11y support for labels -->
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
                  scope="global"
                >
                  <template #date>
                    <CDateInput
                      outlined
                      dense
                      v-model="carryOver.dateModel"
                      :disable="carryOver.radioModel !== 'DEFINITE'"
                      :bottom-slots="false"
                      hide-clear
                    />
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
            type="submit"
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
  </q-form>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, reactive, toRef, PropType } from 'vue'
import { DraftTaskData } from 'src/typings/task.interface'
import { useCarryOverInputHelper } from './carry-over-input-helper'
import { usePriorityInputHelper } from './priority-input-helper'
import CDateInput from 'components/common/CDateInput.vue'
import { DateTime } from 'luxon'

interface TaskDraftModel {
  title: string | null
  notes: string | null
  priority: number
  carryOverUntil: DateTime
}

export interface TaskDraft extends TaskDraftModel {
  title: string
  priority: number
}

export type TaskCreateInitialData = Omit<DraftTaskData, 'dueDt'>
function createTaskData(dueDt: DateTime, initialData?: TaskCreateInitialData) {
  return reactive<TaskDraftModel>({
    title: initialData?.title ?? null,
    notes: initialData?.notes ?? null,
    priority: initialData?.priority ?? 0,
    carryOverUntil: initialData?.carryOverUntil
      ? initialData.carryOverUntil
      : dueDt,
  })
}

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  components: {
    CDateInput,
  },

  props: {
    persistent: Boolean,
    dueDt: {
      type: DateTime,
      required: true,
    },

    initialData: Object as PropType<TaskCreateInitialData>,
  },

  setup(props) {
    const { t } = useI18n()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const task = createTaskData(props.dueDt, props.initialData)

    const formattedDueDt = computed(() =>
      props.dueDt.toLocaleString(DateTime.DATE_MED)
    )

    return {
      dialogRef,
      onDialogHide,
      onSubmit: () => onDialogOK(task),
      onDialogCancel,
      t,
      task,
      formattedDueDt,
      carryOver: useCarryOverInputHelper(
        toRef(task, 'carryOverUntil'),
        toRef(props, 'dueDt')
      ),
      priority: usePriorityInputHelper(toRef(task, 'priority')),
    }
  },
})
</script>

<style lang="scss" scoped>
.notes-input ::v-deep(.q-field__control-container) {
  min-height: 10vh;
}
</style>
