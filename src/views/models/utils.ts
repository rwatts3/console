import {isScalar} from '../../utils/graphql'
import {Field} from '../../types/types'
import {TypedValue, NonScalarValue, ScalarValue} from '../../types/utils'

export function emptyDefault(field: Field): TypedValue {

  if (field.isRequired) {
    return null
  }

  const value = function (): any {
    switch (field.typeIdentifier) {
      case 'Int':
        return 0
      case 'Float':
        return 0
      case 'DateTime':
        return new Date().toISOString()
      case 'String':
        return ''
      case 'Boolean':
        return false
      case 'Enum':
        return field.enumValues.length > 0 ? field.enumValues[0] : null
      default:
        return null
    }
  }()

  if (!field.isList) {
    return value
  }

  return []
}

function valueToGQL(value: TypedValue, field: Field): string {
  if (value === null && !field.isRequired) {
    return 'null'
  }

  if (!isScalar(field.typeIdentifier)) {
    if (field.isList && (value as any[]).length === 0) {
      return '"[]"'
    }
    return `"${(value as NonScalarValue).id}"`
  }
  if (field.typeIdentifier === 'Enum') {
    if (field.isList) {
      return `[${(value as ScalarValue[]).join(',')}]`
    }
    return value as string
  }

  return JSON.stringify(value)
}

export function toGQL(value: any, field: Field): string {
  const key = isScalar(field.typeIdentifier) ? field.name : `${field.name}Id`

  if (value === null && field.isRequired) {
    return ''
  }

  return `${key}: ${valueToGQL(value, field)}`
}

export function compareFields(a: Field, b: Field): number {
  if (a.name === 'id') {
    return -1
  }
  if (b.name === 'id') {
    return 1
  }
  return a.name.localeCompare(b.name)
}
