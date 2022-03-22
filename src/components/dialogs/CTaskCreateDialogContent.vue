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
          v-model:title="draft.title"
          v-model:priority="draft.priority"
          v-model:notes="draft.notes"
          v-model:carryOverDays="draft.carryOverDays"
          :dueDt="dueDt"
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
import { defineComponent, reactive } from 'vue'
import { DateTime } from 'luxon'
import CTaskFields from 'src/components/tasks/CTaskFields.vue'

export interface DraftTask {
  title: string
  notes: string
  priority: number
  carryOverDays: number
}

export default defineComponent({
  props: {
    dueDt: {
      type: DateTime,
      required: true,
    },
  },

  components: { CTaskFields },

  emits: ['submit', 'discard'],

  setup(_, { emit }) {
    const { t } = useI18n()

    const draft: DraftTask = reactive({
      carryOverDays: 0,
      priority: 0,
      notes: '',
      title: '',
    })

    function onSubmit() {
      emit('submit', {
        ...draft,
        notes: draft.notes || null,
      } as DraftTask)
    }

    return {
      draft,
      t,
      onSubmit,
    }
  },
})
</script>
