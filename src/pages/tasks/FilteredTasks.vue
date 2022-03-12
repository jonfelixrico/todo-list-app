<template>
  <q-page class="column">
    <q-toolbar class="bg-secondary justify-between">
      <!-- go back 1 day -->
      <q-btn
        icon="arrow_left"
        @click="setRouteDate(adjacentDates.prev)"
        :label="formatDate(adjacentDates.prev)"
        unelevated
        color="white"
        text-color="black"
        no-caps
      />
      <h2 class="text-h5 q-my-none">{{ formatDate(routeDate) }}</h2>

      <!-- go forward 1 day -->
      <q-btn
        @click="setRouteDate(adjacentDates.next)"
        :label="formatDate(adjacentDates.next)"
        unelevated
        color="white"
        text-color="black"
        icon-right="arrow_right"
        no-caps
      />
    </q-toolbar>
    <div class="col" v-if="tasks.length">
      <div style="max-width: 1024px; margin: auto" class="q-gutter-y-md">
        <q-card>
          <CTaskList :snapshotDt="routeDate" />
        </q-card>
      </div>
    </div>

    <div v-else class="col flex flex-center">
      <h3 class="text-h6">No tasks.</h3>
    </div>
  </q-page>
</template>

<script lang="ts">
import { date } from 'quasar'
import { useFilteredTaskList } from 'src/pages/tasks/task-list-helper'
import { computed, defineComponent } from 'vue'
import { useRemoveTask } from 'src/hooks/task.hooks'
import { useI18n } from 'vue-i18n'
import { Task } from 'src/typings/task.interface'
import { useCustomQuasarDialog } from 'src/hooks/custom-quasar.hooks'
import CTaskList from 'src/components/tasks/CTaskList.vue'
import { DateTime } from 'luxon'
import { useTaskListDateNavigator } from 'src/composables/task-list-date-navigator'

function useNavigation() {
  const dateNav = useTaskListDateNavigator()
  /*
   * Force-typing this as Date since we assume that beforeRouteEnter will prevent `routeDate`
   * from having a value of null, only valid dates.
   */
  const routeDate = computed(() => dateNav.routeDate.value ?? DateTime.now())

  const adjacentDates = computed(() => {
    return {
      prev: routeDate.value.minus({ day: 1 }),
      next: routeDate.value.plus({ day: 1 }),
    }
  })

  function formatDate(date: DateTime) {
    return date.toLocaleString(DateTime.DATE_MED)
  }

  return {
    routeDate,
    adjacentDates,
    setRouteDate: dateNav.setRouteDate,
    formatDate,
  }
}

function useDeleteHelper() {
  const removeFn = useRemoveTask()
  const { createDialog } = useCustomQuasarDialog()
  const { t } = useI18n()

  async function doDelete({ id, title }: Task) {
    try {
      await removeFn(id)
      createDialog({
        title: t('tasks.dialogs.deleteTaskSuccess.title'),
        message: t('tasks.dialogs.deleteTaskSuccess.message', { title }),
      })
    } catch (e) {
      const { message } = e as Error

      createDialog({
        title: t('tasks.dialogs.deleteTaskError.title'),
        message: t('tasks.dialogs.deleteTaskError.message', { title, message }),
      })
    }
  }

  function doDeleteConfirm(task: Task) {
    createDialog({
      title: t('tasks.dialogs.deleteTaskConfirm.title'),
      message: t('tasks.dialogs.deleteTaskConfirm.message'),
      ok: {
        label: t('tasks.dialogs.deleteTaskConfirm.confirm'),
      },
      cancel: {
        label: t('tasks.dialogs.deleteTaskConfirm.cancel'),
      },
    }).onOk(() => {
      void doDelete(task)
    })
  }

  return doDeleteConfirm
}

export default defineComponent({
  components: { CTaskList },

  setup() {
    const { routeDate, ...others } = useNavigation()
    return {
      ...others,
      ...useFilteredTaskList(routeDate),
      routeDate,
      onDelete: useDeleteHelper(),
    }
  },

  /**
   * This route guard will automaticall redirect the user back to the `tasks` route if it detects
   * an invalid date.
   * @param to
   * @param _
   * @param next
   */
  beforeRouteEnter(to, _, next) {
    const dateStr = to.params.date as string
    const isValid = date.isValid(dateStr)
    if (!isValid) {
      console.log(
        'FilteredTasks: %s is an invalid date. Redirected to tasks instead.',
        dateStr
      )
      next({ name: 'tasks' })
      return
    }
    next()
  },
})
</script>
