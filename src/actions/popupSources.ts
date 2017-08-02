import Constants from '../constants/popupSources'
import { FieldPopupSource } from 'graphcool-metrics/dist'

export const setFieldPopupSource = (source: FieldPopupSource) => ({
  type: Constants.SET_FIELD_POPUP_SOURCE,
  payload: source,
})
