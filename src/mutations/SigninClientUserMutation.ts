import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  clientUserId: string
  projectId: string
}

const mutation = graphql`
  mutation SigninClientUserMutation($input: SigninClientUserInput!) {
    signinClientUser(input: $input) {
      token
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      clientUserId: props.clientUserId,
      projectId: props.projectId,
    },
    configs: [],
  })
}

export default { commit }
