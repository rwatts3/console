import * as React from 'react'
import Auth0LockWrapper from '../../../components/Auth0LockWrapper/Auth0LockWrapper'
import { withRouter } from 'react-router'
import { Response } from '../../../mutations/AuthenticateCustomerMutation'
import { ProjectType } from '../types'

interface Props {
  className?: string
  projectType: ProjectType
  cliToken: string
  loading: boolean
  router: any
}

class Right extends React.Component<Props, {}> {

  render() {
    const successCallback = async (response: Response) => {

      const redirect = this.redirectURL()
      this.props.router.push(redirect)
    }

    return (
      <div
        className={`authenticate-right ${this.props.className}`}
      >
        <style jsx={true}>{`
        .authenticate-right :global(.auth0-lock-header) {
          @p: .dn;
        }
      `}</style>
        <div style={{ display: this.props.loading ? 'none' : undefined }}>
          <Auth0LockWrapper
            renderInElement
            successCallback={successCallback}
            initialScreen='login'
          />
        </div>
      </div>
    )
  }

  private redirectURL = (): string => {
    if (this.props.projectType) {
      return `/cli/auth/success-init?cliToken=${this.props.cliToken}&projectType=${this.props.projectType}`
    }
    return `/cli/auth/success?cliToken=${this.props.cliToken}`
  }
}

export default withRouter(Right)
