import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import { UserType, Operation, Rule } from '../../types/types'

interface Props {
  modelId: string
  operation: Operation
  userType: UserType
  fieldIds: string[]
  applyToWholeModel: boolean
  rule: Rule
  ruleName?: string
  ruleGraphQuery?: string
}

const mutation = graphql`
  mutation AddModelPermissionMutation($input: AddModelPermissionInput!) {
    addModelPermission(input: $input) {
      modelPermissionEdge {
        node {
          id
          ...ModelPermissionComponent_permission
        }
      }
      model {
        permissions(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
      mutation,
      variables: {
        input: {
          ...input,
          isActive: true,
        },
      },
      configs: [{
        type: 'RANGE_ADD',
        parentName: 'model',
        parentID: input.modelId,
        connectionName: 'permissions',
        edgeName: 'modelPermissionEdge',
        rangeBehaviors: {
          '': 'append',
        },
      }],
    },
  )
}

export default {commit}
