<template>
  <q-list separator>
    <CTaskListItem v-for="task of tasks" :key="task.id" :task="task" />
  </q-list>
</template>

<script lang="ts">
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { uid } from 'quasar'
import { computed, defineComponent, Ref, ref, toRefs, watch } from 'vue'
import { Task } from 'src/typings/task.interface'
import { useI18n } from 'vue-i18n'
import CTaskListItem from 'src/components/tasks/CTaskListItem.vue'

function useTasksFetcher(date: Ref<Date>) {
  const { getTasks, lastWrite } = useTaskRepo()
  const data = ref<Task[]>([])
  const loadingJob = ref<string | null>(null)

  watch(
    [lastWrite, date],
    async () => {
      const jobId = (loadingJob.value = uid())
      try {
        console.debug('useTasksFetcher: getting tasks for %s.', date.value)
        const res = await getTasks(date.value)
        if (loadingJob.value === jobId) {
          data.value = res
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
    tasks: data,
    isLoading: computed(() => !!loadingJob.value),
  }
}

export default defineComponent({
  props: {
    snapshotDt: {
      type: Date,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n()
    const { snapshotDt } = toRefs(props)
    const { tasks } = useTasksFetcher(snapshotDt)
    return {
      tasks,
      t,
    }
  },

  components: { CTaskListItem },
})
</script>
