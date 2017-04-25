import {RelationPermissionPopupState} from './RelationPermissionPopup'
import {RelationPermission} from '../../../types/types'

export interface RelationPermissionPopupErrors {
  nameMissing: boolean
  invalidQuery: boolean
  nothingSelected: boolean
}

export function isValid(state: RelationPermissionPopupState) {
  return {
    nothingSelected: !state.connect && !state.disconnect,
    invalidQuery: !state.queryValid,
    nameMissing: state.rule === 'GRAPH' && (!state.ruleName || state.ruleName.length === 0),
  }
}

export function didChange(state: RelationPermissionPopupState, permission?: RelationPermission) {
  if (!permission) {
    return false
  }
  return state.connect !== permission.connect ||
      state.disconnect !== permission.disconnect ||
      state.rule !== permission.rule ||
      state.queryChanged ||
      state.userType !== permission.userType
}

export function errorInTab(errors: RelationPermissionPopupErrors, index: number) {

  const {invalidQuery, nameMissing, nothingSelected} = errors

  if (index === 0) {
    return nothingSelected
  }

  if (index === 1) {
    return invalidQuery || nameMissing
  }

  return false
}
