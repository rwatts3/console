import { isValidDateTime, isValidName } from './utils'
import { Field } from '../types/types'
import { isScalar } from './graphql'

export function valueToString (value: any, field: Field, returnNullAsString: boolean): string {
  let fieldValue = null
  if (isScalar(field.typeIdentifier)) {
    fieldValue = value
  } else if (field.isList) {
    fieldValue = value
  } else if (value !== null) {
    fieldValue = value.id
  }

  if (fieldValue === null) {
    return returnNullAsString ? 'null' : ''
  }

  if (field.isList) {
    if (isScalar(field.typeIdentifier)) {
      if (field.typeIdentifier === 'String') {
        return `[${fieldValue.map((v) => `"${v.toString()}"`).join(', ')}]`
      } else {
        debugger
        return `[${fieldValue.toString()}]`
      }
    } else { // !isScalar
      return `[${fieldValue.map((v) => v.id).join(', ')}]`
    }
  } else { // !isList
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

  if (!isScalar(typeIdentifier)) {
    if (isList) {
      throw new Error('Converting a string to a relation list is not supported')
    }

    return { id: rawValue }
  }

  if (isList) {
    try {
      return JSON.parse(rawValue)
    } catch (e) {
      return null
    }
  } else {
    return {
      String: () => rawValue,
      Boolean: () => rawValue.toLowerCase() === 'true' ? true : rawValue.toLowerCase() === 'false' ? false : null,
      Int: () => isNaN(parseInt(rawValue, 10)) ? null : parseInt(rawValue, 10),
      Float: () => isNaN(parseFloat(rawValue)) ? null : parseFloat(rawValue),
      GraphQLID: () => rawValue,
      Password: () => rawValue,
      Enum: () => isValidName(rawValue) ? rawValue : null,
      DateTime: () => isValidDateTime(rawValue) ? rawValue : null,
    }[typeIdentifier]()
  }
}

export function isValidValue (rawValue: string, field: Field): boolean {
  return stringToValue(rawValue, field) !== null
}
