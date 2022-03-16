<template>
  <q-form @submit="$emit('submit', task)" autofocus ref="formRef">
    <!-- Title -->
    <div class="q-gutter-y-sm">
      <!-- TODO do proper a11y support for labels -->
      <div class="text-weight-bold">
        {{ t('task.form.inputs.title.label') }}
      </div>
      <q-input
        v-model="task.title"
        type="textarea"
        outlined
        autogrow
        dense
        :hint="t('task.form.inputs.title.hint')"
        :rules="[(val) => !!val || t('task.form.inputs.title.error')]"
      />
    </div>

    <!-- Notes -->
    <div class="q-gutter-y-sm">
      <!-- TODO do proper a11y support for labels -->
      <div class="text-weight-bold">
        {{ t('task.form.inputs.notes.label') }}
      </div>
      <q-input
        v-model="task.notes"
        type="textarea"
        outlined
        autogrow
        dense
        class="notes-input"
        :hint="t('task.form.inputs.notes.hint')"
      />
    </div>

    <!-- Priority -->
    <div class="q-gutter-y-sm">
      <!-- TODO do proper a11y support for labels -->
      <div class="text-weight-bold">
        {{ t('task.form.inputs.priority.label') }}
      </div>
      <div class="row items-start q-gutter-x-sm">
        <q-checkbox
          :label="t('task.form.inputs.hasPriority.label')"
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
          :hint="t('task.form.inputs.priority.hint')"
          class="col"
        />
      </div>
    </div>

    <!-- Carry-over -->
    <div class="q-gutter-y-sm">
      <!-- TODO do proper a11y support for labels -->
      <div class="text-weight-bold">
        {{ t('task.form.inputs.carryOver.label') }}
      </div>
      <div class="column">
        <!-- No carry over -->
        <q-radio
          v-model="carryOver.radioModel"
          val="NO_CARRY_OVER"
          :label="t('task.form.inputs.carryOver.options.no')"
        />

        <!-- Carry over until date (if not yet completed) -->
        <q-radio v-model="carryOver.radioModel" val="DEFINITE">
          <!--
              The use of `preformatted` here is requried for HTML to honor the space between
              "...over until {date}"
            -->
          <i18n-t
            keypath="task.form.inputs.carryOver.options.untilDate"
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
  </q-form>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, reactive, toRef, PropType, ref } from 'vue'
import { DraftTaskData } from 'src/typings/task.interface'
import { useCarryOverInputHelper } from 'components/dialogs/carry-over-input-helper'
import { usePriorityInputHelper } from 'components/dialogs/priority-input-helper'
import CDateInput from 'components/common/CDateInput.vue'
import { DateTime } from 'luxon'
import { QForm } from 'quasar'

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
  components: {
    CDateInput,
  },

  props: {
    dueDt: {
      type: DateTime,
      required: true,
    },

    initialData: Object as PropType<TaskCreateInitialData>,
  },

  emits: ['submit'],

  setup(props) {
    const { t } = useI18n()

    const task = createTaskData(props.dueDt, props.initialData)

    const formattedDueDt = computed(() =>
      props.dueDt.toLocaleString(DateTime.DATE_MED)
    )

    const formRef = ref<QForm | null>(null)

    function submit() {
      if (!formRef.value) {
        return
      }

      formRef.value.submit()
    }

    return {
      t,
      task,
      formattedDueDt,
      carryOver: useCarryOverInputHelper(
        toRef(task, 'carryOverUntil'),
        toRef(props, 'dueDt')
      ),
      priority: usePriorityInputHelper(toRef(task, 'priority')),
      submit,
      formRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.notes-input ::v-deep(.q-field__control-container) {
  min-height: 10vh;
}
</style>
