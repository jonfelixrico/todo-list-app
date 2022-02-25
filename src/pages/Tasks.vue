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
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    function onWriteBtnClick() {
      console.debug('noop')
    }

    return {
      onWriteBtnClick,
    }
  },
})
</script>
