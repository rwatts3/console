import * as React from 'react'
import * as Relay from 'react-relay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../actions/gettingStarted'
import {Link} from 'react-router'
import ModelDescription from './ModelDescription'
import Tether from '../../components/Tether/Tether'
import Header from '../../components/Header/Header'
import {Model, Viewer, Project} from '../../types/types'
import {GettingStartedState} from '../../types/gettingStarted'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import AuthProviderPopup from './AuthProviderPopup/AuthProviderPopup'
import {particles, Icon, variables} from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'
const classes: any = require('./ModelHeader.scss')

interface Props {
  children: Element
  params: any
  gettingStartedState: GettingStartedState
  model: Model
  nextStep: any
  viewer: Viewer
  project: Project
}

interface State {
  authProviderPopupVisible: boolean
}

class ModelHeader extends React.Component<Props, State> {

  state = {
    authProviderPopupVisible: false,
  }

  render() {

    const structureActive = location.pathname.endsWith('structure')
    const typeText = structureActive ? 'Structure' : 'Data'

    const SettingsLink = styled(Link)`
      padding: ${variables.size10};
      background: ${variables.gray10};
      font-size: ${variables.size14};
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
      color: ${variables.gray40};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 2px;
      transition: color ${variables.duration} linear, background ${variables.duration} linear;

      svg {
        fill: ${variables.gray40};
        stroke: ${variables.gray40};
        transition: fill ${variables.duration} linear;
      }

      > div {
        margin-left: 10px;
      }

      &:hover {
        color: ${variables.white};
        background: ${variables.gray20};

        svg, svg g {
          fill: ${variables.white} !important;
          stroke: ${variables.white} !important;
        }
      }
    `

    const BlueSettingsLink = styled(SettingsLink)`
      background: ${variables.blue};
      color: ${variables.white};

      svg {
        fill: ${variables.white};
        stroke: ${variables.white};
        transition: fill ${variables.duration} linear;
      }

      > div {
        margin-left: 10px;
      }

      &:hover {
        background: ${variables.blue80};
      }
    `

    return (
      <div className={classes.root}>
        {this.state.authProviderPopupVisible &&
        <PopupWrapper>
          <AuthProviderPopup
            project={this.props.project}
            close={() => this.setState({ authProviderPopupVisible: false } as State)}
          />
        </PopupWrapper>
        }
        <div className={classes.top}>
          <Header
            viewer={this.props.viewer}
            params={this.props.params}
            project={this.props.project}
            renderRight={() => (
              structureActive ? (
                <Tether
                  steps={[{
                    step: 'STEP3_CLICK_DATA_BROWSER',
                    title: 'Switch to the Data Browser',
                    description: 'In the Data Browser you can view and manage your data ("Post" nodes in our case).', // tslint:disable-line
                  }]}
                  width={280}
                  offsetX={-35}
                  offsetY={5}
                >
                  <BlueSettingsLink
                    to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/browser`}
                    onClick={this.dataViewOnClick}
                  >
                    <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/check.svg')}/>
                    <div>Done Editing Structure</div>
                  </BlueSettingsLink>
                </Tether>
              ) : (
                <SettingsLink
                  to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure`}
                >
                  <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/structure.svg')}/>
                  <div>Edit Structure</div>
                </SettingsLink>
              )
            )}
          >
            <div className={classes.info}>
              <div className={classes.title}>
                {this.props.model.name}
                <div className={classes.type}>{`(${typeText})`}</div>
                {this.props.model.isSystem &&
                  <span className={classes.system}>System</span>
                }
                <Icon
                  width={32}
                  height={32}
                  src={require('graphcool-styles/icons/fill/settings.svg')}
                  color={variables.gray10}
                  className={cx(
                    particles.ml6,
                    particles.mt6,
                    particles.pointer,
                  )}
                />
              </div>
              <div className={classes.titleDescription}>
                <ModelDescription model={this.props.model}/>
              </div>
            </div>
          </Header>
        </div>
        <div className={classes.bottom}>
          <div className={classes.tabs}>
            {this.props.model.name === 'User' &&
            <div
              className={cx(
                particles.f14,
                particles.pa10,
                particles.pointer,
                particles.ttu,
                particles.bgWhite,
                particles.black50,
                particles.lhSolid,
                particles.fw6,
                particles.buttonShadow,
                particles.tracked,
              )}
              onClick={() => this.setState({ authProviderPopupVisible: true } as State)}
            >
              Configure Auth Provider
            </div>
            }
          </div>
          <div className={classes.buttons}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }

  private dataViewOnClick = () => {
    if (this.props.gettingStartedState.isCurrentStep('STEP3_CLICK_DATA_BROWSER')) {
      this.props.nextStep()
    }
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({nextStep}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModelHeader)

export default Relay.createContainer(ReduxContainer, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${Header.getFragment('viewer')}
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${Header.getFragment('project')}
        ${AuthProviderPopup.getFragment('project')}
      }
    `,
    model: () => Relay.QL`
      fragment on Model {
        id
        name
        itemCount
        isSystem
        ${ModelDescription.getFragment('model')}
      }
    `,
  },
})
