import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import { RelationPermission } from '../../types/types'

type UserType = 'EVERYONE' | 'AUTHENTICATED'

interface UpdateRelationPermissionInput {
  id: string
  connect?: boolean
  disconnect?: boolean
  userType?: UserType
  rule?: Rule
  ruleName?: string
  ruleGraphQuery?: string
  ruleWebhookUrl?: string
  description?: string
  isActive?: boolean
  clientMutationId?: string
}

type Rule = 'NONE' | 'GRAPH' | 'WEBHOOK'

const mutation = graphql`
  mutation UpdateRelationPermissionMutation(
    $input: UpdateRelationPermissionInput!
  ) {
    updateRelationPermission(input: $input) {
      relationPermission {
        id
        ...RelationPermissionComponent_permission
      }
    }
  }
`

function commit(input: UpdateRelationPermissionInput) {
  return makeMutation({
    mutation,
    variables: { input: input.filterNullAndUndefined() },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          relationPermission: input.id,
        },
      },
    ],
  })
}

export default { commit }
