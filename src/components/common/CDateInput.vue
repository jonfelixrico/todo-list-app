<template>
  <q-input
    outlined
    dense
    v-model="model"
    :disable="disable"
    :bottom-slots="false"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
          mask="####/##/##"
          :rules="['date']"
        >
          <q-date v-model="model">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts">
import { date } from 'quasar'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  emits: {
    input: (payload?: Date) => payload && payload instanceof Date,
  },

  props: {
    modelValue: Date,
    disable: Boolean,
  },

  setup(props, { emit }) {
    const model = computed<null | string>({
      get: () => {
        if (!props.modelValue) {
          return null
        }

        return date.formatDate(props.modelValue, 'YYYY/MM/DD')
      },

      set: (dateStr: string | null) => {
        if (!dateStr) {
          emit('input', undefined)
        } else if (!date.isValid(dateStr)) {
          // do nothing
        } else {
          emit('input', date.extractDate(dateStr, 'YYYY/MM/DD'))
        }
      },
    })

    return {
      model,
    }
  },
})
</script>
