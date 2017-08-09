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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input },
    configs: [],
  })
}

export default { commit }
