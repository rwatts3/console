import {PermissionPopupState} from './PermissionPopup'
export interface PermissionPopupErrors {
  permissionTypeMissing: boolean
  invalidQuery: boolean
  noFieldsSelected: boolean
}

export function isValid(state: PermissionPopupState): PermissionPopupErrors {
  let errors: PermissionPopupErrors = {
    permissionTypeMissing: false,
    invalidQuery: false,
    noFieldsSelected: false,
  }

  errors.permissionTypeMissing = state.selectedOperation === null
  errors.invalidQuery = !state.queryValid
  errors.noFieldsSelected = state.editing ? true :
    (state.selectedOperation === 'READ' && (state.fieldIds.length === 0 && !state.applyToWholeModel))

  return errors
}

export function errorInTab(errors: PermissionPopupErrors, index: number) {
  const {permissionTypeMissing, invalidQuery, noFieldsSelected} = errors

  if (index === 0) {
    return permissionTypeMissing
  }

  if (index === 1) {
    return noFieldsSelected
  }

  if (index === 2) {
    return invalidQuery
  }

  return false
}
