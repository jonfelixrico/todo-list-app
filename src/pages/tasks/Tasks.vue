<template>
  <q-page class="column">
    <q-resize-observer @resize="onResize($event.height)" />
    <q-layout container :style="{ height: `${height}px` }" class="absolute">
      <q-header>
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
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script lang="ts">
import { date, useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import { CreateTaskInput } from 'src/store/tasks/actions'
import CTaskCreateDialog, {
  TaskDraft,
} from 'src/components/dialogs/CTaskCreateDialog.vue'
import { useTaskListDateNavigation } from './task-list-date-navigation'
import { useCreateTask } from 'src/hooks/task.hooks'

function useHeightObserverUtils() {
  const heightRef = ref(0)
  function onResize(height: number) {
    heightRef.value = height
  }

  return {
    onResize,
    height: heightRef,
  }
}

function useTaskCreate() {
  const $q = useQuasar()
  const createTask = useCreateTask()

  const doCreate = async (task: TaskDraft, dueDt: Date) => {
    const { id } = await createTask({ dueDt, ...task } as CreateTaskInput)
    console.debug('Created task %s.', id)
  }

  const onWriteBtnClick = () => {
    const dueDt = date.startOfDate(new Date(), 'day')
    $q.dialog({
      component: CTaskCreateDialog,
      componentProps: {
        persistent: true,
        dueDt,
      },
    }).onOk((task: TaskDraft) => {
      void doCreate(task, dueDt)
    })
  }

  return { onWriteBtnClick, ...useHeightObserverUtils() }
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
