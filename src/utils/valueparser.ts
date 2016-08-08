import {isValidDateTime, isValidName} from './utils'
import {Field} from '../types/types'
import {isScalar} from './graphql'
import {TypedValue, NonScalarValue, ScalarValue} from '../types/utils'

export function valueToString(value: TypedValue, field: Field, returnNullAsString: boolean): string {
  let fieldValue = null
  if (isScalar(field.typeIdentifier)) {
    fieldValue = value
  } else if (field.isList) {
    fieldValue = value
  } else if (value !== null) {
    fieldValue = (value as NonScalarValue).id
  }

  if (fieldValue === null) {
    return returnNullAsString ? 'null' : ''
  }

  if (field.isList) {
    if (!(fieldValue instanceof Array)) {
      return fieldValue // TODO improve this code
    }

    if ((value as (NonScalarValue[] | ScalarValue[])).length === 0) {
      return '[]'
    }

    if (isScalar(field.typeIdentifier)) {
      if (field.typeIdentifier === 'String' || field.typeIdentifier === 'Enum') {
        return `[${fieldValue.map((v) => `"${v.toString()}"`).join(', ')}]`
      } else {
        return `[${fieldValue.toString()}]`
      }
    } else { // !isScalar
      return `[${fieldValue.map((v) => v.id).join(', ')}]`
    }
  } else { // !isList
    switch (field.typeIdentifier) {
      case 'DateTime':
        return new Date(fieldValue).toISOString()
      default:
        return fieldValue.toString()
    }
  }

}

export function stringToValue(rawValue: string, field: Field): TypedValue {
  if (rawValue === null) {
    return null
  }
  const {isList, isRequired, typeIdentifier} = field
  if (rawValue === '') {
    // todo: this should set to null but currently null is not supported by our api
    return isRequired && typeIdentifier === 'String' ? '' : null
  }

  if (!isScalar(typeIdentifier)) {
    if (isList) {
      try {
        let json = JSON.parse(rawValue)
        if (!(json instanceof Array)) {
          throw 'value is not an array'
        }
        for (let i = 0; i < json.length; i++) {
          if (!json[i].hasOwnProperty('id')) {
            throw 'value does not have "id" field'
          }
        }
        return json
      } catch (e) {
        return null // TODO add true error handling
      }
    }
    return {id: rawValue}
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
