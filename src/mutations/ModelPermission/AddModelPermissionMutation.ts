import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {UserType, Operation, Rule} from '../../types/types'

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
        }
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      ...props,
      isActive: true,
    },
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'model',
      parentID: props.modelId,
      connectionName: 'permissions',
      edgeName: 'modelPermissionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
    optimisticResponse: {
      ...props,
      isActive: true,
    },
  })
}

export default { commit }
