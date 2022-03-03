<template>
  <q-item clickable class="q-pa-md">
    <div class="row full-width q-gutter-x-sm">
      <div class="q-ml-none">
        <q-checkbox :modelValue="true" />
      </div>

      <q-separator vertical />

      <div class="col column justify-center q-gutter-y-sm">
        <div class="row">
          <div class="col">
            <!--
                Since we'll be using q-gutter-* in the parent, we want to wrap to avoid the
                margin CSS from conflicting
              -->
            <h6 class="preformatted text-h6 q-my-none" v-text="task.title" />
          </div>

          <div class="row items-center q-gutter-x-sm">
            <q-badge v-if="task.isCarriedOver">MOCK_CARRIED_OVER</q-badge>
            <q-badge v-if="task.priority">MOCK_PRIORITY</q-badge>
          </div>
        </div>
        <div
          class="preformatted q-pa-sm bg-grey-3 rounded-borders"
          v-if="task.notes"
          v-text="task.notes"
        />
      </div>

      <q-separator vertical />

      <div>
        <q-btn color="primary" no-caps dense flat round icon="info" />
      </div>
    </div>
  </q-item>
</template>

<script lang="ts">
import { Task } from 'src/typings/task.interface'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export interface PresentationTask extends Task {
  isCarriedOver?: boolean
}

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<PresentationTask>,
      required: true,
    },
  },

  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>
