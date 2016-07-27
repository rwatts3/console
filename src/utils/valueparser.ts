import { isScalar, parseValue } from './graphql'
import { Field } from '../types/types'

export function valueToString (value: any, field: Field, returnNullAsString: boolean): string {
  const fieldValue = isScalar(field.typeIdentifier)
    ? value
    : (value !== null ? value.id : null)

  if (fieldValue === null) {
    return returnNullAsString ? 'null' : ''
  }

  if (field.isList) {
    if (field.typeIdentifier === 'String') {
      return `[${fieldValue.map((e) => `"${e}"`).toString()}]`
    } else {
      return `[${fieldValue.toString()}]`
    }
  } else {
    switch (field.typeIdentifier) {
      case 'DateTime': return new Date(fieldValue).toISOString()
      default: return fieldValue.toString()
    }
  }
}

export function stringToValue (rawValue: string, field: Field): any {
  const { isList, isRequired, typeIdentifier } = field
  if (rawValue === '') {
    // todo: this should set to null but currently null is not supported by our api
    return isRequired && typeIdentifier === 'String' ? '' : null
  }

  if (!isList && !isScalar(typeIdentifier)) {
    return { id: rawValue }
  }

  if (isList) {
    return JSON.parse(rawValue)
  } else {
    return parseValue(rawValue, typeIdentifier)
  }
}
