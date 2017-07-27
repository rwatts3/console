import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
  email: string
}

const mutation = graphql`
  mutation DeleteCollaboratorMutation($input: RemoveCollaboratorInput!) {
    removeCollaborator(input: $input) {
      deletedId
      project {
        name
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input},
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: input.projectId,
      connectionName: 'seats',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
