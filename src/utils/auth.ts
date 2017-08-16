import * as cookiestore from 'cookiestore'
import { updateNetworkLayer } from '../relayEnvironment'
import { AuthTrigger } from '../views/CLIAuthView/types'

export const updateAuth = async (cliToken: string) => {
  await fetch(`${__CLI_AUTH_TOKEN_ENDPOINT__}/update`, {
    method: 'POST',
    body: JSON.stringify({
      authToken: cookiestore.get('graphcool_auth_token'),
      cliToken,
    }),
  })

  updateNetworkLayer()
}

// no need of after-signup here, because we can be sure that the person is logged in as
// the graphcool_auth_token cookie already exists
export const redirectURL = (authTrigger: AuthTrigger): string => {
  switch (authTrigger) {
    case 'auth':
      return `/cli/auth/success`
    case 'init':
      return `/cli/auth/success-init`
    case 'quickstart':
      return `https://www.graph.cool/docs/quickstart`
  }
}
