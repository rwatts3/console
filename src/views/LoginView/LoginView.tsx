import * as React from 'react'
import * as Relay from 'react-relay'
import Loading from '../../components/Loading/Loading'
import { updateNetworkLayer } from '../../utils/relay'
import * as cookiestore from '../../utils/cookiestore'
import LoginMutation from '../../mutations/LoginMutation'
import Icon from '../../components/Icon/Icon'
import { Viewer } from '../../types/types'
const classes: any = require('./LoginView.scss')

interface Props {
  viewer: Viewer
}

interface State {
  loading: boolean
  email: string
  password: string
}

class LoginView extends React.Component<Props, State> {

  state = {
    loading: false,
    email: '',
    password: '',
  }

  componentDidMount () {
    analytics.track('login: viewed')
  }

  _login = () => {
    this.setState({ loading: true } as State)

    const { email, password } = this.state

    const payload = { email, password, viewer: this.props.viewer }
    const onSuccess = (response) => {
      cookiestore.set('graphcool_token', response.signinUser.token)
      cookiestore.set('graphcool_user_id', response.signinUser.viewer.user.id)
      updateNetworkLayer()

      analytics.track('login: logged in', () => {
        window.location.pathname = '/'
      })
    }
    const onFailure = () => {
      this.setState({ loading: false } as State)

      analytics.track('login: login failed', { email })
    }
    Relay.Store.commitUpdate(new LoginMutation(payload), {
      onSuccess,
      onFailure,
    })
  }

  _listenForEnter = (e) => {
    if (e.keyCode === 13) {
      this._login()
    }
  }

  render () {
    if (this.state.loading) {
      return (
        <div className={classes.root}>
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Loading color='#fff' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div className={classes.box}>
          <div className={classes.logo}>
            <Icon
              width={60} height={70}
              src={require('assets/icons/logo.svg')}
              color='#fff'
              />
          </div>
          <div className={classes.form}>
            <input
              autoFocus
              ref='email'
              type='text'
              placeholder='Email'
              onChange={(e) => this.setState({ email: e.target.value } as State)}
              onKeyUp={this._listenForEnter}
              />
            <input
              ref='password'
              type='password'
              placeholder='Password'
              onChange={(e) => this.setState({ password: e.target.value } as State)}
              onKeyUp={this._listenForEnter}
              />
            <button onClick={this._login}>Login</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(LoginView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  },
})
