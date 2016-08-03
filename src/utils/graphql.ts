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
