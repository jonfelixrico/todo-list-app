<template>
  <q-list separator>
    <CTaskListItem
      v-for="{ task, isCarriedOver } of tasksForDisplay"
      :key="task.id"
      :task="task"
      :showCarryOverBadge="isCarriedOver"
    />
  </q-list>
</template>

<script lang="ts">
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { uid } from 'quasar'
import { computed, defineComponent, Ref, ref, toRefs, watch } from 'vue'
import { Task } from 'src/typings/task.interface'
import CTaskListItem from 'src/components/tasks/CTaskListItem.vue'
import { DateTime } from 'luxon'

function useTasksFetcher(date: Ref<DateTime>) {
  const { getTasks, lastWrite } = useTaskRepo()

  const tasks = ref<Task[]>([])
  const loadingJob = ref<string | null>(null)

  watch(
    [lastWrite, date],
    async () => {
      const jobId = (loadingJob.value = uid())
      try {
        console.debug('useTasksFetcher: getting tasks for %s.', date.value)
        const res = await getTasks(date.value)
        if (loadingJob.value === jobId) {
          tasks.value = res
          console.debug('useTasksFetcher: retrieved %d records.', res.length)
        } else {
          console.debug(
            'useTasksFetcher: retrieved %d records, but not published to the ref.',
            res.length
          )
        }
      } finally {
        if (jobId === loadingJob.value) {
          loadingJob.value = null
        }
      }
    },
    {
      immediate: true,
    }
  )

  return {
    tasks,
    isLoading: computed(() => !!loadingJob.value),
  }
}

export default defineComponent({
  props: {
    snapshotDt: {
      type: DateTime,
      required: true,
    },
  },

  setup(props) {
    const { snapshotDt } = toRefs(props)
    const { tasks } = useTasksFetcher(snapshotDt)

    const tasksForDisplay = computed(() => {
      return tasks.value.map((task) => {
        return {
          task,
          isCarriedOver: task.dueDt.hasSame(snapshotDt.value, 'day'),
        }
      })
    })

    return {
      tasks,
      tasksForDisplay,
    }
  },

  components: { CTaskListItem },
})
</script>
