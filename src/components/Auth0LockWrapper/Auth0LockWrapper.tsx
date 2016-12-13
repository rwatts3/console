import * as React from 'react'
import { $p, $v } from 'graphcool-styles'
import * as Relay from 'react-relay'
import { Transaction } from 'react-relay'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showNotification } from '../../actions/notification'
import { ShowNotificationCallback } from '../../types/utils'
import { onFailureShowNotification } from '../../utils/relay'
import Auth0Lock from 'auth0-lock'
import * as cookiestore from 'cookiestore'
import AuthenticateCustomerMutation from '../../mutations/AuthenticateCustomerMutation'
import tracker from '../../utils/metrics'
import {ConsoleEvents} from 'graphcool-metrics'

interface Props {
  showNotification: ShowNotificationCallback
  initialScreen: 'login' | 'signUp'
}

interface State {
}

class Auth0LockWrapper extends React.Component<Props, State> {

  _lock: any

  constructor(props) {
    super(props)

    this._lock = new Auth0Lock(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, {
      closable: false,
      additionalSignUpFields: [{
        name: 'name',
        icon: 'http://i.imgur.com/JlNtkke.png',
        placeholder: 'enter your full name',
      }],
      theme: {
        logo: require('../../assets/graphics/logo-auth0.png'),
        primaryColor: $v.green,
      },
      languageDictionary: {
        title: 'Graphcool',
      },
      auth: {
        params: {scope: 'openid email name user_metadata'},
      },
      initialScreen: this.props.initialScreen,
    })

    this._lock.on('authenticated', (authResult) => {
      this._lock.hide()

      const onSuccess = async (response) => {
        cookiestore.set('graphcool_auth_token', response.authenticateCustomer.token)
        cookiestore.set('graphcool_customer_id', response.authenticateCustomer.user.id)

        await tracker.track(ConsoleEvents.Authentication.completed())

        if (new Date().getTime() - new Date(response.authenticateCustomer.user.createdAt).getTime() < 60000) {
          window.location.pathname = '/after-signup'
        } else {
          window.location.pathname = '/'
        }

      }
      const onFailure = (transaction: Transaction) => {
        this._lock.show()

        onFailureShowNotification(transaction, this.props.showNotification)

        tracker.track(ConsoleEvents.Authentication.failed({idToken: authResult.idToken}))
      }
      Relay.Store.commitUpdate(new AuthenticateCustomerMutation({auth0IdToken: authResult.idToken}), {
        onSuccess,
        onFailure,
      })
    })
  }

  componentDidMount() {
    this._lock.show()
  }

  componentWillUnmount() {
    this._lock.hide()
  }

  render() {
    return (
      <div className={$p.dn}/>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

export default connect(null, mapDispatchToProps)(Auth0LockWrapper)
