import * as React from 'react'
import * as Relay from 'react-relay'
import AuthProviderSidePanel from './AuthProviderSidePanel'
import {Icon} from 'graphcool-styles'
import { $p } from 'graphcool-styles'
import * as cx from 'classnames'
import { Project, AuthProviderType } from '../../../types/types'
import tracker from '../../../utils/metrics'
import {ConsoleEvents} from 'graphcool-metrics'

interface Props {
  project: Project
  close: () => void
  forceFetchRoot: () => void
}

interface State {
  selectedType: AuthProviderType
}

class AuthProviderPopup extends React.Component<Props, State> {

  state: State = {
    selectedType: 'AUTH_PROVIDER_EMAIL',
  }

  componentDidMount() {
    tracker.track(ConsoleEvents.AuthProvider.Popup.opened({source: 'user-model'}))
  }

  render() {
    const authProviders = this.props.project.authProviders.edges.map(edge => edge.node)
    return (
      <div
        className={cx($p.flex, $p.justifyCenter, $p.itemsCenter, $p.h100, $p.w100, $p.bgWhite50)}
        style={{ pointerEvents: 'all' }}
      >
        <div
          className={cx($p.bgWhite, $p.br2, $p.buttonShadow, $p.overflowYScroll)}
          style={{ width: 900, maxHeight: '100vh' }}
        >
          <div className={cx($p.bgGreen, $p.flex, $p.justifyBetween, $p.itemsCenter, $p.white, $p.pa25)}>
            <div className={cx($p.f38, $p.fw3)}>
              Authentication Methods
            </div>
            <div className={$p.pointer} onClick={this.props.close}>
              <Icon
                src={require('assets/icons/close.svg')}
                width={40}
                height={40}
                color='white'
              />
            </div>
          </div>
          <div className={cx($p.flex, $p.justifyBetween)}>
            <div className={cx($p.flex, $p.flexColumn, $p.br, $p.bBlack10)} style={{ flex: '0 0 270px' }}>
              <div
                className={cx(
                  $p.flex, $p.pa25, $p.bb, $p.bBlack10, $p.itemsCenter, $p.pointer, $p.justifyBetween,
                  this.state.selectedType === 'AUTH_PROVIDER_EMAIL' && $p.bgBlack04
                )}
                onClick={() => {
                  this.setState({ selectedType: 'AUTH_PROVIDER_EMAIL' })
                  tracker.track(ConsoleEvents.AuthProvider.Popup.providerSelected())
                }}
              >
                <div className={cx($p.flex, $p.itemsCenter)}>
                  <Icon
                    src={require('assets/icons/logo.svg')}
                    width={40}
                    height={40}
                    color='#00B861'
                  />
                  <div className={cx($p.fw3, $p.f25, $p.ml16)}>
                    Email
                  </div>
                </div>
                <div>
                  {authProviders.find(a => a.type === 'AUTH_PROVIDER_EMAIL' && a.isEnabled) &&
                  <Icon src={require('assets/new_icons/check.svg')} color='#7ED321'/>
                  }
                </div>
              </div>
              <div
                className={cx(
                  $p.flex, $p.pa25, $p.bb, $p.bBlack10, $p.itemsCenter, $p.pointer, $p.justifyBetween,
                  this.state.selectedType === 'AUTH_PROVIDER_DIGITS' && $p.bgBlack04
                )}
                onClick={() => {
                  this.setState({ selectedType: 'AUTH_PROVIDER_DIGITS' })
                  tracker.track(ConsoleEvents.AuthProvider.Popup.providerSelected())
                }}
              >
                <img src={require('assets/graphics/digits.png')}/>
                <div>
                  {authProviders.find(a => a.type === 'AUTH_PROVIDER_DIGITS' && a.isEnabled) &&
                  <Icon src={require('assets/new_icons/check.svg')} color='#7ED321'/>
                  }
                </div>
              </div>
              <div
                className={cx(
                  $p.flex, $p.pa25, $p.bb, $p.bBlack10, $p.itemsCenter, $p.pointer, $p.justifyBetween,
                  this.state.selectedType === 'AUTH_PROVIDER_AUTH0' && $p.bgBlack04
                )}
                onClick={() => {
                  this.setState({ selectedType: 'AUTH_PROVIDER_AUTH0' })
                  tracker.track(ConsoleEvents.AuthProvider.Popup.providerSelected())
                }}
              >
                <img src={require('assets/graphics/auth0.png')}/>
                <div>
                  {authProviders.find(a => a.type === 'AUTH_PROVIDER_AUTH0' && a.isEnabled) &&
                  <Icon src={require('assets/new_icons/check.svg')} color='#7ED321'/>
                  }
                </div>
              </div>
            </div>
            <AuthProviderSidePanel
              project={this.props.project}
              selectedType={this.state.selectedType}
              forceFetchRoot={location.reload.bind(location)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(AuthProviderPopup, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        authProviders(first: 100) {
          edges {
            node {
              type
              isEnabled
            }
          }
        }
        ${AuthProviderSidePanel.getFragment('project')}
      }
    `,
  },
})
