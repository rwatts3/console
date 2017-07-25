import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  modelPermissionId: string
  modelId: string
}

const mutation = graphql`
  mutation DeleteModelPermissionMutation($input: DeleteModelPermissionInput!) {
    deleteModelPermission(input: $input) {
      deletedId
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
        modelPermissionId: input.modelPermissionId,
      },
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'model',
      parentID: input.modelId,
      connectionName: 'permissions',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
