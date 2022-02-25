<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section> dummy </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onDialogOk" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const {
      dialogRef,
      onDialogHide,
      onDialogOK: onDialogOk,
      onDialogCancel,
    } = useDialogPluginComponent()

    return {
      dialogRef,
      onDialogHide,
      onDialogOk,
      onDialogCancel,
    }
  },
}
</script>
