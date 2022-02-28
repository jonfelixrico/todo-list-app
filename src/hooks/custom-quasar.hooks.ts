import { QDialogOptions, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export function useCustomQuasarDialog() {
  const { dialog } = useQuasar()
  const { t } = useI18n()

  const OK_BTN = {
    unelevated: true,
    color: 'primary',
    noCaps: true,
    label: t('common.ok'),
  }

  const CANCEL_BTN = {
    flat: true,
    color: 'standard',
    noCaps: true,
    label: t('common.cancel'),
  }

  function createDialog(options: QDialogOptions) {
    return dialog({
      ...options,
      ok:
        typeof options?.ok === 'object'
          ? { ...OK_BTN, ...options.ok }
          : options.ok,
      cancel:
        typeof options?.cancel === 'object'
          ? { ...CANCEL_BTN, ...options.cancel }
          : options.cancel,
    })
  }

  return {
    /**
     * Wrapper for $q.dialog. We've made the default button props to be
     * standard across the app.
     */
    createDialog,
  }
}
