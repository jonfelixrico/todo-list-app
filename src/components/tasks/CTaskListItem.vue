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
              {{
                t('tasks.completedOn', { date: formatDate(task.completeDt) })
              }}
            </div>

            <div
              class="text-caption text-grey-8"
              v-if="isCarriedOver"
              data-cy="carried-over"
            >
              {{ t('tasks.carriedOverFrom', { date: formatDate(task.dueDt) }) }}
            </div>
          </div>

          <div
            class="row items-center q-gutter-x-sm"
            v-if="isCarriedOver || task.priority"
          >
            <q-badge v-if="isCarriedOver && daysLapsed" data-cy="days-lapsed">
              {{ t('tasks.daysLapsed', { count: daysLapsed }, daysLapsed) }}
            </q-badge>

            <q-badge v-if="task.priority" color="warning" data-cy="priority">
              {{ t('tasks.priority', { priorityRating: task.priority }) }}
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
import { DateTime } from 'luxon'
import { Task } from 'src/typings/task.interface'
import { computed, defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },

    isCarriedOver: Boolean,
    carryOverReferenceDt: DateTime,
  },

  emits: ['click'],

  setup(props) {
    const { t } = useI18n()

    const daysLapsed = computed<null | number>(() => {
      const { isCarriedOver, task, carryOverReferenceDt } = props

      if (
        !isCarriedOver ||
        (carryOverReferenceDt && carryOverReferenceDt < task.dueDt)
      ) {
        return null
      }

      return carryOverReferenceDt?.diff(task.dueDt, 'days').days ?? null
    })

    function formatDate(date: DateTime) {
      return date.toLocaleString(DateTime.DATE_MED)
    }

    return {
      t,
      daysLapsed,
      formatDate,
    }
  },
})
</script>
