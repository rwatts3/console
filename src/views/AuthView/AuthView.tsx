import * as React from 'react'
import Auth0LockWrapper from '../../components/Auth0LockWrapper/Auth0LockWrapper'
import { Response } from '../../mutations/AuthenticateCustomerMutation'
import { withRouter } from 'react-router'

interface Props {
  initialScreen: 'login' | 'signUp'
  router: any
}

class AuthView extends React.Component<Props, {}> {

  render() {
    const successCallback = (response: Response) => {
      if (new Date().getTime() - new Date(response.user.createdAt).getTime() < 60000) {
        this.props.router.push('/after-signup')
      } else {
        this.props.router.push('/')
      }
    }

    return (
      <Auth0LockWrapper
        initialScreen={this.props.initialScreen}
        successCallback={successCallback}
        renderInElement={false}
      />
    )
  }
}

export default withRouter(AuthView)
