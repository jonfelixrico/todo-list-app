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
    <q-toolbar class="bg-secondary"> </q-toolbar>
    <div class="col"><router-view /></div>
  </q-page>
</template>

<script lang="ts">
import { date, useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import { useStore } from 'src/store'
import { Task } from 'src/typings/task.interface'
import { CreateTaskInput } from 'src/store/tasks/actions'
import CTaskCreateDialog, {
  TaskDraft,
} from 'src/components/dialogs/CTaskCreateDialog.vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'

function useTaskCreate() {
  const $q = useQuasar()

  const store = useStore()
  const createTask = (toCreate: CreateTaskInput) =>
    store.dispatch('tasks/createTask', toCreate) as Promise<Task>

  const doCreate = async (task: TaskDraft, targetDt: Date) => {
    const { id } = await createTask({ targetDt, ...task } as CreateTaskInput)
    console.debug('Created task %s.', id)
  }

  const onWriteBtnClick = () => {
    const targetDt = date.startOfDate(new Date(), 'day')
    $q.dialog({
      component: CTaskCreateDialog,
      componentProps: {
        persistent: true,
        targetDt,
      },
    }).onOk((task: TaskDraft) => {
      void doCreate(task, targetDt)
    })
  }

  return { onWriteBtnClick }
}

export default defineComponent({
  setup() {
    return {
      ...useTaskCreate(),
      ...useTaskListDateNavigation(),
    }
  },
})
</script>
