import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
  email: string
}

const mutation = graphql`
  mutation AddCollaboratorMutation($input: InviteCollaboratorInput!) {
    inviteCollaborator(input: $input) {
      project {
        id
      }
      seat {
        email
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      projectId: props.projectId,
      email: props.email,
    },
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'seats',
      edgeName: 'seatEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
