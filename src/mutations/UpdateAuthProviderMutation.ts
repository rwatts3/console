import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { AuthProviderDigits, AuthProviderAuth0 } from '../types/types'

interface Props {
  authProviderId: string
  isEnabled: boolean
  digits: AuthProviderDigits | null
  auth0: AuthProviderAuth0 | null
}

const mutation = graphql`
  mutation UpdateAuthProviderMutation($input: UpdateAuthProviderInput!) {
    updateAuthProvider(input: $input) {
      authProvider {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        id: input.authProviderId,
        isEnabled: input.isEnabled,
        // this explicitness is needed because otherwise relay passes `__dataID__` along
        digits: !input.digits
          ? null
          : {
              consumerKey: input.digits.consumerKey,
              consumerSecret: input.digits.consumerSecret,
            },
        // this explicitness is needed because otherwise relay passes `__dataID__` along
        auth0: !input.auth0
          ? null
          : {
              domain: input.auth0.domain,
              clientId: input.auth0.clientId,
              clientSecret: input.auth0.clientSecret,
            },
      },
    },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          authProvider: input.authProviderId,
        },
      },
    ],
  })
}

export default { commit }
