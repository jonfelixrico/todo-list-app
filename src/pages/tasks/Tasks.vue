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
import { useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import { useCreateTask } from 'src/hooks/task.hooks'
import { DateTime } from 'luxon'
import { DraftTaskData } from 'src/typings/task.interface'
import { useTaskListDateNavigator } from 'src/composables/task-list-date-navigator.composable'
import CTaskCreateDialogV2, {
  DraftTask,
} from 'src/components/dialogs/CTaskCreateDialogV2.vue'

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

  const doCreate = async (
    { carryOverDays, ...task }: DraftTask,
    dueDt: DateTime
  ) => {
    const { id } = await createTask({
      dueDt,
      ...task,
      carryOverUntil: dueDt.plus({ day: carryOverDays as number }), // TS seems to see `carryOverDays` as `any`...
    } as DraftTaskData)
    console.debug('Created task %s.', id)
  }

  const onWriteBtnClick = () => {
    const dueDt = DateTime.now().startOf('day')
    $q.dialog({
      component: CTaskCreateDialogV2,
      componentProps: {
        dueDt,
      },
    }).onOk((task: DraftTask) => {
      void doCreate(task, dueDt)
    })
  }

  return { onWriteBtnClick, ...useHeightObserverUtils() }
}

export default defineComponent({
  setup() {
    return {
      ...useTaskCreate(),
      ...useTaskListDateNavigator(),
    }
  },
})
</script>
