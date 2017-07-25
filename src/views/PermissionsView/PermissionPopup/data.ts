export function getEmptyPermissionQuery(modelName: string, operation: Operation, userType: UserType) {
  if (operation === 'CREATE') {
    if (userType === 'EVERYONE') {
      return `query {
  SomeUserExists
}
`
    }
    return `query ($user_id: ID!) {
  SomeUserExists(
    filter: {
      id: $user_id
    }
  )
}
`
  }
  return `query ($node_id: ID!) {
  Some${modelName}Exists(
    filter: {
      id: $node_id
    }
  )
}`
}
