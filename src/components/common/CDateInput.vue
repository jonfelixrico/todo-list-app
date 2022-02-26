<template>
  <q-input
    :outlined="outlined"
    :dense="dense"
    v-model="model"
    :disable="disable"
    :bottom-slots="bottomSlots"
  >
    <template v-slot:append>
      <div class="row">
        <q-btn
          v-if="!hideClear"
          icon="close"
          dense
          flat
          round
          size="sm"
          @click="model = null"
        />
        <q-btn
          icon="event"
          color="primary"
          dense
          flat
          round
          size="sm"
          class="cursor-pointer"
        >
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
                <q-btn
                  v-close-popup
                  :label="t('common.close')"
                  color="primary"
                  flat
                  no-caps
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
    </template>
  </q-input>
</template>

<script lang="ts">
import { date } from 'quasar'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  emits: {
    input: (payload?: Date) => payload && payload instanceof Date,
  },

  props: {
    modelValue: Date,
    disable: Boolean,
    outlined: Boolean,
    dense: Boolean,
    bottomSlots: Boolean,
    hideClear: Boolean,
  },

  setup(props, { emit }) {
    const { t } = useI18n()
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
      t,
    }
  },
})
</script>
