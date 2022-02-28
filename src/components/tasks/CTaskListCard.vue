<template>
  <q-card>
    <q-card-section class="row">
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
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Task } from 'src/typings/task.interface'
import { defineComponent, PropType, toRefs } from 'vue'

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },

  setup(props) {
    const task = toRefs(props.task)

    return {
      ...task,
    }
  },
})
</script>
