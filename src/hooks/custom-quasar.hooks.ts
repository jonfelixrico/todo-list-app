import { QDialogOptions, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export function useCustomQuasarDialog() {
  const { dialog } = useQuasar()
  const { t } = useI18n()

  /**
   * Default settings for OK
   */
  const OK_BTN = {
    unelevated: true,
    color: 'primary',
    noCaps: true,
    label: t('common.ok'),
  }

  /**
   * Default settings for Cancel
   */
  const CANCEL_BTN = {
    flat: true,
    color: 'standard',
    noCaps: true,
    label: t('common.cancel'),
  }

  /**
   * These wrap methods will "blend-in" the value provided by the user into the button defaults.
   */

  const wrapOk = (prop: QDialogOptions['ok']): QDialogOptions['ok'] => {
    if (prop === false) {
      return prop
    } else if (prop === true || prop === undefined) {
      return OK_BTN
    } else if (typeof prop === 'object') {
      return { ...OK_BTN, ...prop }
    } else {
      // fallback
      return undefined
    }
  }

  const wrapCancel = (
    prop: QDialogOptions['cancel']
  ): QDialogOptions['cancel'] => {
    if (prop === false || prop === undefined) {
      // cancel is not shown by default; needs object or `true` for it to show up
      return prop
    } else if (prop === true) {
      return CANCEL_BTN
    } else if (typeof prop === 'object') {
      return { ...CANCEL_BTN, ...prop }
    } else {
      // fallback
      return undefined
    }
  }

  function createDialog(options: QDialogOptions) {
    return dialog({
      ...options,
      ok: wrapOk(options.ok),
      cancel: wrapCancel(options.cancel),
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
