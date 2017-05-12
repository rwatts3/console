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
        className={`authenticate-right ${this.props.className}`}
      ><style jsx={true}>{`
        .authenticate-right :global(.auth0-lock-header) {
          @p: .dn;
        }
      `}</style>
        <Auth0LockWrapper
          renderInElement
          successRedirect='/'
          initialScreen='login'/>
      </div>
    )
  }
}
