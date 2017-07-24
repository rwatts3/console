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
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      modelPermissionId: props.modelPermissionId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'model',
      parentID: props.modelId,
      connectionName: 'permissions',
      deletedIDFieldName: 'deletedId',
    }],
    optimisticResponse: {
      deletedId: props.modelPermissionId,
    }
  })
}

export default { commit }
