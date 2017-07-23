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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'seats',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
