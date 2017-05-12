import * as React from 'react'
import Auth0LockWrapper from '../../../components/Auth0LockWrapper/Auth0LockWrapper'
import {ProjectType} from '../ExampleProject/ExampleProject'

interface Props {
  className?: string
  projectType: string
}

export default class AuthenticateRight extends React.Component<Props, {}> {

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
          successRedirect={this._redirectURL()}
          initialScreen='login'/>
      </div>
    )
  }

  _redirectURL = (): string => {
    const {projectType} = this.props
    if (projectType === 'instagram') {
      return '/cli/project?projectType=instagram'
    } else if (projectType === 'blank') {
      return '/cli/project?projectType=blank'
    }
    return '/cli/auth-success'
  }
}
