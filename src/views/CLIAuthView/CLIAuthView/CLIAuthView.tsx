import * as React from 'react'
import { Icon, $v } from 'graphcool-styles'
import * as cookiestore from 'cookiestore'
import Left from './Left'
import Right from './Right'
import Loading from '../../../components/Loading/Loading'

interface State {
  loading: boolean
}

interface Props {
  location: any
}

export default class CLIAuthView extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      loading: props.location.hash.length > 1,
    }
  }

  // used from routes as `onEnter` hook
  static routeRedirectWhenAuthenticated = (nextState, replace) => {
    if (cookiestore.has('graphcool_auth_token')) {
      const {projectType, cliToken} = nextState.location.query
      const redirect = projectType
        ? `/cli/auth/success-init?cliToken=${cliToken}&projectType=${projectType}`
        : `/cli/auth/success?cliToken=${cliToken}`
      replace(redirect)
    }
  }

  render() {
    const {projectType, cliToken} = this.props.location.query

    return (
      <div className='cli-auth-view'>
        <style jsx={true}>{`

          .cli-auth-view {
            @p: .w100, .fixed, .top0, .left0, .right0, .bottom0, .flex, .itemsCenter, .justifyCenter, .white;
            background-image: radial-gradient(circle at 49% 49%, #172a3a, #0f202d);
          }

          .logo {
            @p: .absolute, .left0, .top0, .pl60, .pt60;
          }

        `}</style>
        <div className='logo'>
          <Icon
            color={$v.green}
            width={34}
            height={40}
            src={require('../../../assets/icons/logo.svg')}
          />
        </div>
        {this.state.loading &&
        <Loading color='#fff'/>
        }
        {!this.state.loading &&
        <Left className='mr60'/>
        }
        <Right loading={this.state.loading} projectType={projectType} cliToken={cliToken} className='ml60'/>
      </div>
    )
  }
}
