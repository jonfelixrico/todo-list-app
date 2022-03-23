<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <CTaskUpdateDialogContent
      @discard="onDialogCancel"
      @update="onDialogOK"
      :task="task"
      class="content"
    />
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { defineComponent, PropType } from 'vue'
import CTaskUpdateDialogContent from 'src/components/dialogs/update/CTaskUpdateDialogContent.vue'
import type { TaskToUpdate } from 'src/components/dialogs/update/CTaskUpdateDialogContent.vue'

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  components: {
    CTaskUpdateDialogContent,
  },

  props: {
    task: {
      type: Object as PropType<TaskToUpdate>,
      required: true,
    },
  },

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
    }
  },
})
</script>

<style lang="scss" scoped>
.content {
  width: 25vw;

  body.screen--md & {
    width: 50vw;
  }

  body.screen--xs &,
  body.screen--sm & {
    width: 100vw;
  }
}
</style>
