import * as React from 'react'
import * as Relay from 'react-relay'
import { withRouter } from 'react-router'
import {$p, $v, Icon} from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'
import UpdateCustomerSourceMutation from '../../mutations/UpdateCustomerSourceMutation'
import Timer = NodeJS.Timer

const Container = styled.div`
  max-width: 750px;
`

const CustomInput = styled.input`
  text-shadow: 0px 0px 0px #000;
  -webkit-text-fill-color: transparent;
 
  &::-webkit-input-placeholder {
    color: ${$v.gray30};
    text-shadow: none;
    -webkit-text-fill-color: initial;
  }
`

const CommunicationIcon = styled(Icon)`
  g g path:first-child {
    fill: ${$v.gray30};
  }
`

interface Props {
  viewer: any
  router: ReactRouter.InjectedRouter
}

interface State {
  buttonActive: boolean
  source: string
}

class AfterSignUpView extends React.Component<Props, State> {

  activateTimeout: Timer

  constructor(props) {
    super(props)

    this.state = {
      buttonActive: false,
      source: props.viewer.user.crm.information.source,
    }
  }

  componentWillMount() {

    const {user: {crm: {information: {source}}}} = this.props.viewer
    if (source && source.length > 0) {
      // redirect to console, replace because customers shouldn't go back to this screen
      this.props.router.replace('/')
    }

  }

  componentDidMount() {
    this.activateTimeout = setTimeout(this.activateButton, 10000)
  }

  componentWillUnmount() {
    clearTimeout(this.activateTimeout)
  }

  render() {
    const {buttonActive, source} = this.state
    const {user: {name}} = this.props.viewer

    return (
      <div className={cx($p.flex, $p.itemsCenter, $p.justifyCenter)}>
        <Container className={cx($p.mt25)}>
          <div className={cx($p.f60, $p.tc)}>👋</div>
          <h1 className={cx($p.f38, $p.fw3, $p.tc)}>Hi {name.split(/\s/)[0]}!</h1>
          <p className={cx($p.fw3, $p.mt25, $p.tc)}>
            We appreciate you taking your time to get to know Graphcool.
            As frontend developers on our own, it’s the tool we always wanted for our self
            and therefore are very excited to have come this far.
          </p>
          <p className={cx($p.fw3, $p.mt25, $p.tc)}>
            As we are eager to learn and improve constantly we are depended on your feedback.
            If you ever get stuck or feel like there is room for improvement
            - shoot us a mail, hit us on slack or use the integrated chat,
            we will get back to you immediately.
          </p>
          <div className={cx($p.mv25, $p.w100, $p.flex, $p.justifyCenter)}>
            <CommunicationIcon
              src={require('graphcool-styles/icons/fill/communicationIcons.svg')}
              width={264}
              height={47}
              color='rgba(0,0,0,.3)'
            />
          </div>
          <div className={cx($p.w100, $p.bb, $p.bBlack10, $p.mv38)}></div>
          <div className={cx($p.f16, $p.fw3, $p.tc, $p.mt25)}>ONE LAST THING BEFORE WE GET STARTED</div>
          <CustomInput
            className={cx($p.green, $p.f38, $p.fw3, $p.w100, $p.tc, $p.mt25)}
            placeholder='Would you tell us how you got here?'
            autoFocus
            value={source || ''}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            type='text'
          />
          <div className={cx($p.flex, $p.itemsCenter, $p.justifyCenter)}>
            <div
              className={cx(
                $p.white,
                $p.ttu,
                $p.f25,
                $p.pv16,
                $p.ph96,
                $p.tc,
                $p.mt60,
                $p.pointer,
                {
                  [`${$p.pointer} ${$p.bgGreen}`]: buttonActive,
                  [$p.bgBlack10]: !buttonActive,
                },
              )}
              onClick={this.gotoConsole}
            >
              Open Console
            </div>
          </div>
        </Container>
      </div>
    )
  }

  private gotoConsole = () => {
    const {source} = this.state

    if (!this.state.buttonActive) {
      return
    }

    Relay.Store.commitUpdate(
      new UpdateCustomerSourceMutation({
        customerInformationId: this.props.viewer.user.crm.information.id,
        source: source,
      }),
      {
        onSuccess: () => {
          this.props.router.push('/')
        },
        onFailure: () => {
          this.props.router.push('/')
        },
      },
    )

  }

  private onChange = (e: any) => {
    this.setState({source: e.target.value} as State)

    if (!this.state.buttonActive) {
      this.activateButton()
    }
  }

  private onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.gotoConsole()
    }
  }

  private activateButton = () => {
    this.setState({buttonActive: true} as State)
  }
}

export default Relay.createContainer(withRouter(AfterSignUpView), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          name
          crm {
            information {
              id
              name
              source
            }
          }
        }
      }
    `,
  },
})
