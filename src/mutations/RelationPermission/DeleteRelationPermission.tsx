import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  relationPermissionId: string
  relationId: string
}

const mutation = graphql`
  mutation DeleteRelationPermission($input: DeleteRelationPermissionInput!) {
    deleteRelationPermission(input: $input) {
      relation {
        id
      }
      deletedId
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      relationPermissionId: props.relationPermissionId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'relation',
      parentID: props.relationId,
      connectionName: 'permissions',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
