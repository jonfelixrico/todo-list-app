<template>
  <q-page class="column">
    <q-toolbar class="bg-secondary">
      <q-space />
      <q-btn
        dense
        round
        unelevated
        color="white"
        text-color="black"
        icon="create"
        @click="onWriteBtnClick"
      />
    </q-toolbar>
    <div class="col">list goes here</div>
  </q-page>
</template>

<script lang="ts">
import { uid, useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import CWriteTaskDialogVue, {
  TaskDraft,
} from 'src/components/dialogs/CTaskCreateDialog.vue'
import { useStore } from 'src/store'
import { Task } from 'src/typings/task.interface'

export default defineComponent({
  setup() {
    const $q = useQuasar()
    const store = useStore()
    const onWriteBtnClick = () => {
      $q.dialog({
        component: CWriteTaskDialogVue,
        componentProps: {
          persistent: true,
        },
      }).onOk((task: TaskDraft) => {
        const createDt = new Date()
        const id = uid()
        store.commit('tasks/addTask', {
          ...task,
          createDt,
          lastUpdateDt: createDt,
          id,
        } as Task)
        console.log('Task %s created.', id)
      })
    }

    return {
      onWriteBtnClick,
    }
  },
})
</script>
