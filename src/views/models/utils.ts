import { isScalar, isValidValueForType } from '../../utils/graphql'
import { Field } from '../../types/types'

export function emptyDefault (field: Field): any {
  const value = function (): any {
    switch (field.typeIdentifier) {
      case 'Int': return 0
      case 'Float': return 0
      case 'DateTime': return new Date().toISOString()
      case 'String': return ''
      case 'Boolean': return false
      case 'Enum': return field.enumValues.length > 0 ? field.enumValues[0] : null
      default: return null
    }
  }()

  return field.isList ? [value] : value
}

function valueToGQL (value: any, field: Field): string {
  if (!isScalar(field.typeIdentifier)) {
    return `"${value.id}"`
  }

  if (field.typeIdentifier === 'Enum') {
    return value
  }

  return JSON.stringify(value)
}

export function toGQL (value: any, field: Field): string {
  const key = isScalar(field.typeIdentifier) ? field.name : `${field.name}Id`
  return value !== null ? `${key}: ${valueToGQL(value, field)}` : ''
}

export function isValidValue (value: string, field: Field): boolean {
  if (value === '' && !field.isRequired) {
    return true
  }
  if (field.isList) {
    if (value === '[]') {
      return true
    }
    if (value[0] !== '[' || value[value.length - 1] !== ']') {
      return false
    } else {
      value = value.substring(1, value.length - 1)
    }
  }

  let invalidValue = false
  let values = field.isList ? value.split(',').map((x) => x.trim()) : [value]

  values.forEach((value) => {
    if (!isValidValueForType(value, isScalar(field.typeIdentifier) ? field.typeIdentifier : 'GraphQLID')) {
      invalidValue = true
      return
    }
  })

  return !invalidValue
}

export function compareFields (a: Field, b: Field): number {
  if (a.name === 'id') {
    return -1
  }
  if (b.name === 'id') {
    return 1
  }
  return a.name.localeCompare(b.name)
}
