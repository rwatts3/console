import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {AuthProviderDigits, AuthProviderAuth0} from '../types/types'

interface Props {
  authProviderId: string
  isEnabled: boolean
  digits: AuthProviderDigits | null
  auth0: AuthProviderAuth0 | null
}

interface Response {
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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      id: props.authProviderId,
      isEnabled: props.isEnabled,
      // this explicitness is needed because otherwise relay passes `__dataID__` along
      digits: !props.digits ? null : {
        consumerKey: props.digits.consumerKey,
        consumerSecret: props.digits.consumerSecret,
      },
      // this explicitness is needed because otherwise relay passes `__dataID__` along
      auth0: !props.auth0 ? null : {
        domain: props.auth0.domain,
        clientId: props.auth0.clientId,
        clientSecret: props.auth0.clientSecret,
      },
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        authProvider: props.authProviderId,
      },
    }],
  })
}

export default { commit }
