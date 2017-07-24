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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        projectId: input.projectId,
        email: input.email,
      },
    },
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: input.projectId,
      connectionName: 'seats',
      edgeName: 'seatEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
