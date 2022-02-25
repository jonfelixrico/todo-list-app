<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section> dummy </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          noCaps
          unelevated
          :label="t('common.ok')"
          @click="onDialogOk"
        />
        <q-btn
          noCaps
          flat
          :label="t('common.cancel')"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { t } = useI18n()
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
      t,
    }
  },
}
</script>
