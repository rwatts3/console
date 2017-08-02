import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { User } from '../types/types'

interface Props {
  auth0IdToken: string
}

export interface Response {
  token: string
  user: User
}

const mutation = graphql`
  mutation AuthenticateCustomerMutation($input: AuthenticateCustomerInput!) {
    authenticateCustomer(input: $input) {
      token
      user {
        id
        createdAt
        crm {
          information {
            source
          }
        }
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        auth0IdToken: input.auth0IdToken,
      },
    },
    configs: [],
  })
}

export default { commit }
