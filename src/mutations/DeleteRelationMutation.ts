import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  relationId: string
  projectId: string
  leftModelId: string
  rightModelId: string
}

const mutation = graphql`
  mutation DeleteRelationMutation($input: DeleteRelationInput!) {
    deleteRelation(input: $input) {
      project {
        id
      }
      deletedId
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        relationId: input.relationId,
      },
    },
    configs: [
      {
        type: 'NODE_DELETE',
        parentName: 'project',
        parentID: input.projectId,
        connectionName: 'relations',
        deletedIDFieldName: 'deletedId',
      },
    ],
  })
}

export default { commit }
