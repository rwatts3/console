import * as React from 'react'
import Auth0LockWrapper from '../../components/Auth0LockWrapper/Auth0LockWrapper'

interface Props {
}

interface State {
}

export default class LoginView extends React.Component<Props, State> {

  render () {
    return (
      <Auth0LockWrapper initialScreen='login'/>
    )
  }
}
