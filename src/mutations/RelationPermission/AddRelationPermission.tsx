import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {UserType, PermissionRuleType} from '../../types/types'

interface Props {
  relationId: string
  connect: boolean
  disconnect: boolean
  userType: UserType
  rule: PermissionRuleType
  ruleName: string
  ruleGraphQuery?: string
  ruleWebhookUrl?: string
}

const mutation = graphql`
  mutation AddRelationPermissionMutation($input: AddRelationPermissionInput!) {
    addRelationPermission(input: $input) {
      relationPermissionEdge {
        node {
          id
        }
      }
      relation {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input: {
      ...input,
      isActive: true,
    }},
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'relation',
      parentID: this.props.relationId,
      connectionName: 'permissions',
      edgeName: 'relationPermissionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default { commit }
