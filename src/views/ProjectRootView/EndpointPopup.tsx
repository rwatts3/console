import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ReduxAction} from '../../types/reducers'
import {closePopup} from '../../actions/popup'
import styled, { keyframes } from 'styled-components'
import {particles, variables, Icon} from 'graphcool-styles'
import CopyToClipboard from 'react-copy-to-clipboard'
import * as cx from 'classnames'
import tracker from '../../utils/metrics'
import {ConsoleEvents} from 'graphcool-metrics'

interface Props {
  id: string
  projectId: string
  closePopup: (id: string) => ReduxAction
}

interface State {
  endpoint: Endpoint
  copied: boolean
}

type Endpoint = 'simple/v1' | 'relay/v1' | 'file/v1'

class EndpointPopup extends React.Component<Props, State> {

  state = {
    endpoint: 'simple/v1' as Endpoint,
    copied: false,
  }

  componentDidMount() {
    tracker.track(ConsoleEvents.Endpoints.opened())
  }

  render() {

    const Popup = styled.div`
      width: 600px;
      max-width: 90%;
    `

    const Separator = styled.div`

      position: relative;
      display: flex;
      justify-content: center;

      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        top: 50%;
        background: ${variables.gray10};
      }
    `

    const activeEndpointType = `
      background: ${variables.green};
      padding: 12px;
      border-radius: 2px;
      cursor: default;
      color: ${variables.white};

      &:hover {
        color: ${variables.white};
        background: ${variables.green};
      }
    `

    const EndpointType = styled.div`
      background: ${variables.gray07};
      padding: ${variables.size10};
      color: ${variables.gray30};
      letter-spacing: 1px;
      cursor: pointer;
      transition: color ${variables.duration} linear, background ${variables.duration} linear;

      &:first-child {
        border-top-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      &:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      &:hover {
        background: ${variables.gray10};
        color: ${variables.gray50};
      }

     ${props => props.active && activeEndpointType}
    `

    const EndpointField = styled.div`
      &:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background: linear-gradient(to left, ${variables.white} 0%, rgba(255,255,255,0) 80%);
        width: 25px;
      }
    `

    const Copy = styled.div`
      i {
        transition: fill ${variables.duration} linear, background ${variables.duration} linear;
      }

      &:hover {
        i {
          background: ${variables.gray04};
          fill: ${variables.gray60};
        }
      }
    `

    const movingCopyIndicator = keyframes`
      0% {
        opacity: 0;
        transform: translate(-50%, 0);
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        transform: translate(-50%, -50px);
      }
    `

    const CopyIndicator = styled.div`
      top: -20px;
      left: 50%;
      transform: translate(-50%,0);
      animation: ${movingCopyIndicator} .7s linear

    `

    const { endpoint, copied } = this.state
    const { projectId } = this.props

    const url = `https://api.graph.cool/${endpoint}/${projectId}`

    return (
      <div
        className={cx(
          particles.flex,
          particles.bgBlack50,
          particles.w100,
          particles.h100,
          particles.justifyCenter,
          particles.itemsCenter,
        )}
      >
        <Popup className={cx(particles.bgWhite, particles.br2)} style={{pointerEvents: 'all'}}>
          <header className={cx(particles.relative, particles.pa60)}>
            <h1 className={cx(particles.fw3, particles.f38, particles.tc)}>
              API Endpoints
            </h1>
            <div
              className={cx(
                particles.absolute,
                particles.pa25,
                particles.top0,
                particles.right0,
                particles.pointer,
              )}
              onClick={() => this.props.closePopup(this.props.id)}
            >
              <Icon
                width={25}
                height={25}
                color={variables.gray30}
                stroke
                strokeWidth={3}
                src={require('graphcool-styles/icons/stroke/cross.svg')}
              />
            </div>
          </header>
          <Separator>
            <div
              className={cx(
                particles.relative,
                particles.ph16,
                particles.bgWhite,
                particles.f14,
                particles.fw6,
                particles.ttu,
                particles.flex,
                particles.itemsCenter,
              )}
            >
              <EndpointType
                active={endpoint === 'relay/v1'}
                onClick={() => this.selectEndpoint('relay/v1')}
              >
                Relay
              </EndpointType>
              <EndpointType
                active={endpoint === 'simple/v1'}
                onClick={() => this.selectEndpoint('simple/v1')}
              >
                Simple
              </EndpointType>
              <EndpointType
                active={endpoint === 'file/v1'}
                onClick={() => this.selectEndpoint('file/v1')}
              >
                File
              </EndpointType>
            </div>
          </Separator>
          <div className={cx(particles.flex, particles.ph38)}>
            <EndpointField
              className={cx(
                particles.flexAuto,
                particles.f16,
                particles.fw3,
                particles.pv38,
                particles.overflowHidden,
                particles.relative,
              )}
            >
              {url}
            </EndpointField>
            <CopyToClipboard text={url}
              onCopy={this.onCopy}>
              <Copy
                className={cx(
                  particles.relative,
                  particles.bgWhite,
                  particles.selfCenter,
                  particles.br2,
                  particles.buttonShadow,
                  particles.pointer,
                )}
              >
                {copied && (
                  <CopyIndicator
                    className={cx(
                      particles.o0,
                      particles.absolute,
                      particles.f14,
                      particles.fw6,
                      particles.blue,
                    )}
                  >
                    Copied
                  </CopyIndicator>
                )}
                <Icon
                  width={38}
                  height={38}
                  color={variables.gray50}
                  src={require('graphcool-styles/icons/fill/copy.svg')}
                />
              </Copy>
            </CopyToClipboard>
          </div>
          <p
            className={cx(
              particles.bt,
              particles.bBlack10,
              particles.pa38,
              particles.lhCopy,
              particles.black50,
            )}
          >
          {
            // tslint:disable-next-line
        }Please copy the endpoint URL and paste it into your app's GraphQL client code. You can <a className={particles.green} target='_blank' href='https://graph.cool/docs/reference/simple-api#differences-to-the-relay-api'>read about the differences between the Simple and Relay API here</a> or <a className={particles.green} target='_blank' href='https://graph.cool/docs/examples'>check out some code examples</a>.
          </p>
        </Popup>
      </div>
    )
  }

  private selectEndpoint = (endpoint: Endpoint) => {
    tracker.track(ConsoleEvents.Endpoints.selected())
    this.setState({ endpoint } as State)
  }

  private onCopy = () => {
    tracker.track(ConsoleEvents.Endpoints.copied())
    this.setState({ copied: true } as State)
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({closePopup}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EndpointPopup)
