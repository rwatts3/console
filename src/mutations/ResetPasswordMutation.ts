import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  resetPasswordToken: string
  newPassword: string
}

interface Response {
  token: string
}

const mutation = graphql`
  mutation ResetPasswordMutation($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      token
      user {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'REQUIRED_CHILDREN',
      children: [graphql`
        fragment ResetPasswordMutationChildren on ResetPasswordPayload {
          token
          user { id }
        }
      `],
    }],
  })
}

export default { commit }
