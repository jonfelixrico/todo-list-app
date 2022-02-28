<template>
  <q-card>
    <q-card-section class="row q-gutter-x-md">
      <div class="col q-gutter-y-md">
        <div>
          <h5 class="text-h6 q-ma-none preformatted" v-text="title" />
          <div class="text-caption text-grey-8" v-if="priority">
            Priority {{ priority }}
          </div>
        </div>

        <div
          v-if="notes"
          v-text="notes"
          class="preformatted q-pa-sm bg-grey-3 rounded-borders"
        />
      </div>
      <q-separator vertical />
      <div class="column q-gutter-y-sm">
        <q-btn
          :label="t('common.edit')"
          flat
          color="primary"
          no-caps
          dense
          @click="onEdit"
        />
        <q-btn
          :label="t('common.delete')"
          flat
          color="negative"
          no-caps
          dense
          @click="onDelete"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Task } from 'src/typings/task.interface'
import { defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },

  emits: ['edit', 'delete'],

  setup(props, { emit }) {
    const task = toRefs(props.task)

    return {
      ...task,
      t: useI18n().t,
      onEdit: () => emit('edit', task),
      onDelete: () => emit('delete', task),
    }
  },
})
</script>
