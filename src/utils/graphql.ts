import {Field} from '../types/types'
export function isScalar (typeIdentifier: string): boolean {
  const scalarTypes = [
    'String',
    'Int',
    'Float',
    'Boolean',
    'GraphQLID',
    'Enum',
    'Password',
    'DateTime',
  ]
  return scalarTypes.includes(typeIdentifier)
}

export function isNonScalarList(field: Field) {
  const {typeIdentifier, isList} = field
  return !isScalar(typeIdentifier) && isList
}
