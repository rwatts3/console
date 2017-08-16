import * as React from 'react'
import { Icon, $v } from 'graphcool-styles'
import * as cookiestore from 'cookiestore'
import Left from './Left'
import Right from './Right'
import Loading from '../../../components/Loading/Loading'
import { updateAuth } from '../../../utils/auth'

interface State {
  loading: boolean
}

interface Props {
  location: any
}

export default class CLIAuthView extends React.Component<Props, State> {
  // used from routes as `onEnter` hook
  static renderRoute = ({ Component, match, props }) => {
    if (cookiestore.has('graphcool_auth_token')) {
      const { authTrigger, cliToken } = match.location.query
      match.router.replace(
        `/cli/auth/authorize?authTrigger=${authTrigger}&cliToken=${cliToken}`,
      )
    }

    return <Component {...props} />
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: props.location.hash.length > 1,
    }
  }

  render() {
    const { authTrigger, cliToken } = this.props.location.query

    return (
      <div className="cli-auth-view">
        <style jsx={true}>{`
          .cli-auth-view {
            @p: .w100, .fixed, .top0, .left0, .right0, .bottom0, .flex,
              .itemsCenter, .justifyCenter, .white;
            background-image: radial-gradient(
              circle at 49% 49%,
              #172a3a,
              #0f202d
            );
          }

          .logo {
            @p: .absolute, .left0, .top0, .pl60, .pt60;
          }
        `}</style>
        <div className="logo">
          <Icon
            color={$v.green}
            width={34}
            height={40}
            src={require('../../../assets/icons/logo.svg')}
          />
        </div>
        {this.state.loading && <Loading color="#fff" />}
        {!this.state.loading && <Left className="mr60" />}
        <Right
          loading={this.state.loading}
          updateAuth={updateAuth}
          authTrigger={authTrigger}
          cliToken={cliToken}
          location={this.props.location}
        />
      </div>
    )
  }
}
