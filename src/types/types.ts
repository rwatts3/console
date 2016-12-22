import {Step} from './gettingStarted'

export interface RelayConnection<T> {
  edges: RelayEdge<T>[]
}

interface RelayEdge<T> {
  node: T
}

export interface Viewer {
  id: string
  user: Customer
  model: Model
  project: Project
}

export interface Customer {
  id: string
  projects: RelayConnection<Project>
  crm: CrmSystemBridge
}

export interface CrmSystemBridge {
  id: string
  information: CrmCustomerInformation
  onboardingStatus: CrmOnboardingStatus
}

export interface CrmCustomerInformation {
  id: string
  name: string
  email: string
}

export type Environment = 'Node' | 'Browser'
export type GraphQLClient = 'fetch' | 'lokka' | 'relay' | 'apollo'

export type Example = 'ReactRelay' | 'ReactApollo' | 'AngularApollo'

export interface CrmOnboardingStatus {
  id: string
  gettingStarted: Step
  gettingStartedSkipped: boolean
  gettingStartedExample: Example | null
}

export interface Project {
  id: string
  name: string
  models: RelayConnection<Model>
  relations: RelayConnection<Relation>
  actions: RelayConnection<Action>
  permanentAuthTokens: RelayConnection<PermanentAuthToken>
  authProviders: RelayConnection<AuthProvider>
  integrations: RelayConnection<Integration>
  actionSchema: string
}

export interface Integration {
  id: string
  isEnabled: boolean
  name: IntegrationNameType
  type: IntegrationTypeType
}

export interface SearchProviderAlgolia extends Integration {
  applicationId: string
  apiKey: string
  algoliaSyncQueries: RelayConnection<AlgoliaSyncQuery>
  algoliaSchema: string
}

export interface AlgoliaSyncQuery {
  id: string
  indexName: string
  fragment: string
  isEnabled: boolean
  model: Model
}

export type IntegrationNameType =
    'AUTH_PROVIDER_AUTH0'
  | 'AUTH_PROVIDER_DIGITS'
  | 'AUTH_PROVIDER_EMAIL'
  | 'SEARCH_PROVIDER_ALGOLIA'

export type IntegrationTypeType = 'AUTH_PROVIDER' | 'SEARCH_PROVIDER'

export type FieldType =
    'Relation'
  | 'Int'
  | 'String'
  | 'Boolean'
  | 'Enum'
  | 'Float'
  | 'DateTime'
  | 'Password'
  | 'Json'
  | 'GraphQLID'

export interface Field {
  id: string
  name: string
  description: string
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  isSystem: boolean
  isReadonly: boolean
  typeIdentifier: FieldType
  defaultValue?: string
  enumValues: string[]
  reverseRelationField?: Field
  relatedModel?: Model
  relation?: Relation
  permissions: RelayConnection<Permission>
  model: Model
}

export interface Relation {
  id: string
  name: string
  description?: string
  leftModel: Model
  rightModel: Model
  fieldOnLeftModel: Field
  fieldOnRightModel: Field
}

export type UserType = 'EVERYONE' | 'AUTHENTICATED'

export type PermissionRuleType = 'NONE' | 'GRAPH' | 'WEBHOOK'

export interface Permission {
  id: string
  userType: UserType
  userPath: string[]
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
  description: string
  isSystem: boolean
  permissions: ModelPermission[]
  permissionSchema: string
}

export interface ModelPermission {
  id: string
  fieldIds?: string[]
  ruleWebhookUrl?: string
  rule: Rule
  ruleName?: string
  ruleGraphQuery?: string
  applyToWholeModel: boolean
  isActive: boolean
  operation: Operation
  userType: UserType
}

export type Rule = 'NONE' | 'GRAPH' | 'WEBHOOK'
export type Operation = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE'

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

export interface User {
  id: string
}

export interface Node {
  id: string
  [key: string]: any
}

export interface PermanentAuthToken {
  id: string
  name: string
  token: string
}

export interface AuthProvider {
  id: string
  type: AuthProviderType
  isEnabled: boolean
  digits: AuthProviderDigits | null
  auth0: AuthProviderAuth0 | null
}

export type AuthProviderType = 'AUTH_PROVIDER_EMAIL' | 'AUTH_PROVIDER_DIGITS' | 'AUTH_PROVIDER_AUTH0'

export interface AuthProviderAuth0 {
  domain: string
  clientId: string
  clientSecret: string
}

export interface AuthProviderDigits {
  consumerKey: string
  consumerSecret: string
}

export interface OrderBy {
  fieldName: string
  order: 'ASC' | 'DESC'
}

export type FieldWidths = { [key: string]: number }

declare global {
  interface Element {
    scrollIntoViewIfNeeded(centerIfNeeded: boolean): void
  }
}

export interface TetherStep {
  step: Step
  title: string
  description?: string
  buttonText?: string
  copyText?: string
}
