<template>
  <q-page class="column">
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
    <div class="col">list goes here</div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import CWriteTaskDialogVue from 'src/components/dialogs/CTaskCreateDialog.vue'

export default defineComponent({
  setup() {
    const $q = useQuasar()
    const onWriteBtnClick = () => {
      $q.dialog({
        component: CWriteTaskDialogVue,
        componentProps: {
          persistent: true,
        },
      })
        .onOk(() => {
          console.debug('ogey')
        })
        .onCancel(() => {
          console.debug('rrat')
        })
    }

    return {
      onWriteBtnClick,
    }
  },
})
</script>
