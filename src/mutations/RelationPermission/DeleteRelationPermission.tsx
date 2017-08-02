import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  relationPermissionId: string
  relationId: string
}

const mutation = graphql`
  mutation DeleteRelationPermissionMutation($input: DeleteRelationPermissionInput!) {
    deleteRelationPermission(input: $input) {
      relation {
        id
        permissions(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
      deletedId
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input: {
      relationPermissionId: input.relationPermissionId,
    }},
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'relation',
      parentID: input.relationId,
      connectionName: 'permissions',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
