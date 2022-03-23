<template>
  <q-form @submit="onSubmit" autofocus class="no-pointer-events">
    <q-card class="all-pointer-events">
      <q-card-section>
        <div>
          <h1 class="q-my-none text-h6">
            {{ t('tasks.dialogs.create.title') }}
          </h1>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-y-lg">
        <!-- multi-root component so q-gutter-y-sm will take effect -->
        <CTaskFields
          v-model:title="model.title"
          v-model:priority="model.priority"
          v-model:notes="notes"
          v-model:carryOverDays="carryOverDays"
          :dueDt="model.dueDt"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat no-caps @click="$emit('discard')">{{
          t('tasks.dialogs.create.discard')
        }}</q-btn>

        <q-btn type="submit" color="primary" unelevated no-caps>{{
          t('tasks.dialogs.create.submit')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defineComponent, reactive, PropType, computed } from 'vue'
import { DateTime } from 'luxon'
import CTaskFields from 'src/components/dialogs/CTaskFields.vue'

export interface TaskToUpdate {
  title: string
  notes: string | null
  priority: number
  carryOverUntil: DateTime
  dueDt: DateTime
}

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<TaskToUpdate>,
      required: true,
    },
  },

  components: { CTaskFields },

  emits: ['update', 'discard'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const model: TaskToUpdate = reactive({
      ...props.task,
    })

    const carryOverDays = computed<number>({
      get() {
        return model.carryOverUntil.diff(model.dueDt, 'day').days
      },

      set(days) {
        model.carryOverUntil = model.dueDt.plus({ days })
      },
    })

    const notes = computed<string>({
      get() {
        return model.notes ?? ''
      },

      set(notes) {
        model.notes = notes
      },
    })

    function onSubmit() {
      emit('update', model)
    }

    return {
      model,
      carryOverDays,
      notes,
      t,
      onSubmit,
    }
  },
})
</script>
