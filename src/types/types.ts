export interface Field {
  id: string
  name: string
  isRequired: boolean
  isList: boolean
  typeIdentifier: string
  defaultValue?: string
  enumValues: string[]
  reverseRelationField?: Field
  relation?: Relation
}

export interface Relation {
  id: string
}

export type UserType = 'GUEST' | 'AUTHENTICATED' | 'RELATED'

export interface Permission {
  id: string
  userType: UserType
  userPath: string
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
  description: string
}

export interface Model {
  id: string
  name: string
  fields: Field[]
  unconnectedReverseRelationFieldsFrom: Field[]
}
