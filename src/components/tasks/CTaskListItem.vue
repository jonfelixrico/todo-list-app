<template>
  <q-item clickable class="q-pa-md">
    <div class="row full-width q-gutter-x-sm">
      <div class="col column justify-center q-gutter-y-sm">
        <div class="row">
          <div class="col">
            <!--
                Since we'll be using q-gutter-* in the parent, we want to wrap to avoid the
                margin CSS from conflicting
              -->
            <h6
              class="preformatted text-h6 q-my-none"
              :class="{ 'text-strike': !!completeDt }"
              v-text="title"
              data-cy="title"
            />

            <div
              class="text-caption text-grey-8"
              v-if="completeDt"
              data-cy="completed"
            >
              Completed on {{ completeDt }}
            </div>
          </div>

          <div
            class="row items-center q-gutter-x-sm"
            v-if="isCarriedOver || priority"
          >
            <q-badge v-if="isCarriedOver" data-cy="carry-over">
              Carried over from {{ dueDt }}
            </q-badge>
            <q-badge v-if="priority" color="warning" data-cy="priority">
              Priority {{ priority }}
            </q-badge>
          </div>
        </div>

        <div
          class="preformatted q-pa-sm bg-grey-3 rounded-borders"
          v-if="notes"
          v-text="notes"
          data-cy="notes"
        />
      </div>

      <q-separator vertical />

      <div>
        <q-btn
          color="primary"
          no-caps
          dense
          flat
          round
          icon="info"
          @click="onClick"
          data-cy="info-btn"
        />
      </div>
    </div>
  </q-item>
</template>

<script lang="ts">
import { Task } from 'src/typings/task.interface'
import { defineComponent, PropType, toRefs } from 'vue'
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

  emits: ['click'],

  setup(props, { emit }) {
    const { t } = useI18n()

    function onClick() {
      emit('click', props.task)
    }

    return {
      t,
      ...toRefs(props.task),
      onClick,
    }
  },
})
</script>
