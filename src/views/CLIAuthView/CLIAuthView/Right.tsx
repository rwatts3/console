import * as React from 'react'
import Auth0LockWrapper from '../../../components/Auth0LockWrapper/Auth0LockWrapper'
import {withRouter} from 'react-router'
import {AuthTrigger} from '../types'
import {Response} from '../../../mutations/AuthenticateCustomerMutation'

interface Props {
  updateAuth: (cliToken: string) => Promise<void>
  cliToken: string
  loading: boolean
  router: any
  authTrigger: AuthTrigger
}

const redirectURL = (authTrigger: AuthTrigger, showAfterSignup: boolean): string => {
  switch (authTrigger) {
    case 'auth':
      return `/cli/auth/success${showAfterSignup ? '?afterSignup=1' : ''}`
    case 'init':
      return `/cli/auth/success-init`
    case 'quickstart':
      return `https://www.graph.cool/docs/quickstart`
  }
}

class Right extends React.Component<Props, {}> {

  render() {
    const successCallback = async (response: Response) => {
      await this.props.updateAuth(this.props.cliToken)

      const showAfterSignup = (new Date().getTime() - new Date(response.user.createdAt).getTime()) < 60000


      const redirectUrl = redirectURL(this.props.authTrigger, showAfterSignup)

      // window.location.href = redirectURL(this.props.authTrigger, showAfterSignup)
    }

    return (
      <div
        className={`authenticate-right ml60`}
      >
        <style jsx>{`
          .authenticate-right :global(.auth0-lock-header) {
            @p: .dn;
          }
        `}</style>
        <div style={{display: this.props.loading ? 'none' : undefined}}>
          <Auth0LockWrapper
            renderInElement
            successCallback={successCallback}
            initialScreen='signUp'
          />
        </div>
      </div>
    )
  }

}

export default withRouter(Right)
