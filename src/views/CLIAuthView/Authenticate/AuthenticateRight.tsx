import * as React from 'react'
import Auth0LockWrapper from '../../../components/Auth0LockWrapper/Auth0LockWrapper'

interface Props {
  className?: string
}

export default class AuthenticateRight extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={this.props.className}
      >
        <Auth0LockWrapper renderInElement={true} initialScreen='login'/>

      </div>
    )
  }
}
