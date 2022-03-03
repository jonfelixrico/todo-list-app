<template>
  <q-list separator>
    <q-item
      clickable
      v-for="{ title, id, notes, priority } of tasks"
      :key="id"
      class="q-pa-md"
    >
      <div class="row full-width q-gutter-x-sm">
        <div class="q-ml-none">
          <q-checkbox :modelValue="true" />
        </div>

        <q-separator vertical />

        <div class="col column justify-center q-gutter-y-sm">
          <div class="row">
            <div class="col">
              <!--
                Since we'll be using q-gutter-* in the parent, we want to wrap to avoid the
                margin CSS from conflicting
              -->
              <h6 class="preformatted text-h6 q-my-none" v-text="title" />
            </div>

            <div class="row items-center q-gutter-x-sm">
              <q-badge>MOCK_CARRIED_OVER</q-badge>
              <q-badge v-if="priority">Priority {{ priority }}</q-badge>
            </div>
          </div>
          <div
            class="preformatted q-pa-sm bg-grey-3 rounded-borders"
            v-if="notes"
            v-text="notes"
          />
        </div>

        <q-separator vertical />

        <div>
          <q-btn color="primary" no-caps dense flat round icon="info" />
        </div>
      </div>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { uid } from 'quasar'
import { computed, defineComponent, Ref, ref, toRefs, watch } from 'vue'
import { Task } from 'src/typings/task.interface'
import { useI18n } from 'vue-i18n'

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
})
</script>
