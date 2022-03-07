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
              :class="{ 'text-strike': !!task.completeDt }"
              v-text="task.title"
              data-cy="title"
            />

            <div
              class="text-caption text-grey-8"
              v-if="task.completeDt"
              data-cy="completed"
            >
              Completed on {{ task.completeDt }}
            </div>
          </div>

          <div
            class="row items-center q-gutter-x-sm"
            v-if="isCarriedOver || task.priority"
          >
            <q-badge v-if="isCarriedOver" data-cy="carry-over">
              Carried over from {{ task.dueDt }}
            </q-badge>
            <q-badge v-if="task.priority" color="warning" data-cy="priority">
              Priority {{ task.priority }}
            </q-badge>
          </div>
        </div>

        <div
          class="preformatted q-pa-sm bg-grey-3 rounded-borders"
          v-if="task.notes"
          v-text="task.notes"
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
          @click="$emit('click')"
          data-cy="button"
        />
      </div>
    </div>
  </q-item>
</template>

<script lang="ts">
import { Task } from 'src/typings/task.interface'
import { computed, defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },

    referenceDt: {
      type: Date,
      required: true,
    },
  },

  emits: ['click'],

  setup(props) {
    const { t } = useI18n()

    const isCarriedOver = computed(() => {
      const { task, referenceDt } = props
      const { dueDt, carryOverUntil, completeDt } = task

      const isWithinCarryOver =
        referenceDt >= dueDt && referenceDt <= carryOverUntil
      const completedAfterReferenceDt = completeDt && completeDt > referenceDt

      return isWithinCarryOver && !completedAfterReferenceDt
    })

    return {
      t,
      isCarriedOver,
    }
  },
})
</script>
