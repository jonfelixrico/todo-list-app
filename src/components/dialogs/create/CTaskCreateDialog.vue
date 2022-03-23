<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <CTaskCreateDialogContent
      @discard="onDialogCancel"
      @submit="onDialogOK"
      :dueDt="dueDt"
      class="content"
    />
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import CTaskCreateDialogContent from 'src/components/dialogs/create/CTaskCreateDialogContent.vue'

export type { DraftTask } from 'src/components/dialogs/create/CTaskCreateDialogContent.vue'

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  components: {
    CTaskCreateDialogContent,
  },

  props: {
    dueDt: {
      type: DateTime,
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
