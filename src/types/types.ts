interface RelayConnection<T> {
  edges: RelayEdge<T>[]
}

interface RelayEdge<T> {
  node: T
}

export interface Project {
  id: string
  name: string
  models: RelayConnection<Model>
  relations: RelayConnection<Relation>
  actions: RelayConnection<Action>
}

export interface Field {
  id: string
  name: string
  description: string
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  isSystem: boolean
  typeIdentifier: string
  defaultValue?: string
  enumValues: string[]
  reverseRelationField?: Field
  relatedModel?: Model
  relation?: Relation
  permissions: RelayConnection<Permission>
}

export interface Relation {
  id: string
  modelA: Model
  modelB: Model
}

export type UserType = 'GUEST' | 'AUTHENTICATED' | 'RELATED'

export interface Permission {
  id: string
  userType: UserType
  userPath: string[]
  userRole: string
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
  description: string
}

export interface Model {
  id: string
  name: string
  namePlural: string
  fields: RelayConnection<Field>
  unconnectedReverseRelationFieldsFrom: Field[]
  itemCount: number
}

export type ActionTriggerType = 'MUTATION_MODEL' | 'MUTATION_RELATION'
export type ActionHandlerType = 'WEBHOOK'

export interface Action {
  id: string
  isActive: boolean
  description: string
  triggerType: ActionTriggerType
  handlerType: ActionHandlerType
  triggerMutationModel?: ActionTriggerMutationModel
  triggerMutationRelation?: ActionTriggerMutationRelation
  handlerWebhook?: ActionHandlerWebhook
}

export type ActionTriggerMutationModelMutationType = 'CREATE' | 'UPDATE' | 'DELETE'

export interface ActionTriggerMutationModel {
  id: string
  fragment: string
  model: Model
  mutationType: ActionTriggerMutationModelMutationType
}

export type ActionTriggerMutationRelationMutationType = 'ADD' | 'REMOVE'

export interface ActionTriggerMutationRelation {
  id: string
  fragment: string
  relation: Relation
  mutationType: ActionTriggerMutationRelationMutationType
}

export interface ActionHandlerWebhook {
  id: string
  url: string
}
