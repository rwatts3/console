import * as React from 'react'
import { showNotification } from '../../actions/notification'
import { createFragmentContainer, graphql } from 'react-relay'
import { connect } from 'react-redux'
import { nextStep } from '../../actions/gettingStarted'
import { Link, withRouter } from 'found'
import ModelDescription from './ModelDescription'
import Tether from '../../components/Tether/Tether'
import Header from '../../components/Header/Header'
import { Model, Viewer, Project } from '../../types/types'
import { GettingStartedState } from '../../types/gettingStarted'
import { Icon, particles, variables } from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'
import { ShowNotificationCallback } from '../../types/utils'
import { Popup } from '../../types/popup'
import { showPopup } from '../../actions/popup'
import { SYSTEM_MODELS } from '../../constants/system'

const classes: any = require('./ModelHeader.scss')
const headerClasses: any = require('../../components/Header/Header.scss')

interface Props {
  children: Element
  params: any
  gettingStartedState: GettingStartedState
  model: Model
  nextStep: any
  viewer: Viewer
  project: Project
  router: any
  showNotification: ShowNotificationCallback
  showPopup: (popup: Popup) => void
  buttonsClass?: string
}

interface State {
  authProviderPopupVisible: boolean
  editModelModalOpen: boolean
}

class ModelHeader extends React.Component<Props, State> {
  state = {
    authProviderPopupVisible: false,
    editModelModalOpen: false,
  }

  render() {
    const schemaActive = location.pathname.includes('schema')
    const schemaTypeText = schemaActive ? 'Schema' : 'Data'
    const { model } = this.props
    const isSystem =
      model && (model.isSystem || SYSTEM_MODELS.includes(model.name))

    const SettingsLink = styled<Link>(Link)`
      padding: ${variables.size10};
      background: ${variables.gray04};
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
        fill: ${variables.gray40} !important;
        stroke: ${variables.gray40};
        transition: fill ${variables.duration} linear;
        path {
          fill: ${variables.gray40} !important;
          stroke: ${variables.gray40} !important;
        }
      }

      > div {
        margin-left: 10px;
      }

      &:hover {
        color: ${variables.white};
        background: ${variables.gray20};

        svg, svg path {
          fill: ${variables.white} !important;
          stroke: ${variables.white} !important;
        }
      }
    `

    const BlueSettingsLink = styled<Link>(SettingsLink)`
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
        <div className={classes.top}>
          <Header
            viewer={this.props.viewer}
            params={this.props.params}
            project={this.props.project}
            left={false}
          >
            <div className={headerClasses.left}>
              <div className={classes.info}>
                <div className={classes.title}>
                  {this.props.model.name}
                  <div className={classes.type}>{`(${schemaTypeText})`}</div>
                  {isSystem && <span className={classes.system}>System</span>}
                </div>
                <div className={classes.titleDescription}>
                  <ModelDescription model={this.props.model} />
                </div>
              </div>
            </div>
            <div className={headerClasses.right}>
              {schemaActive
                ? <BlueSettingsLink
                    to={`/${this.props.params.projectName}/models/${this.props
                      .params.modelName}/databrowser`}
                  >
                    <Icon
                      width={20}
                      height={20}
                      src={require('graphcool-styles/icons/fill/check.svg')}
                    />
                    <Tether
                      steps={[
                        {
                          step: 'STEP3_CLICK_DATA_BROWSER',
                          title: 'Switch to the Data Browser',
                          description:
                            'In the Data Browser you can view and manage your data ("Post" nodes in our case).', // tslint:disable-line
                        },
                      ]}
                      width={280}
                      offsetX={-50}
                      offsetY={5}
                      zIndex={2000}
                    >
                      <div>Done Editing Schema</div>
                    </Tether>
                  </BlueSettingsLink>
                : <SettingsLink
                    to={`/${this.props.params
                      .projectName}/schema?selectedModel=${this.props.params
                      .modelName}`}
                  >
                    <Icon
                      width={20}
                      height={20}
                      src={require('assets/icons/schema.svg')}
                    />
                    <div>Edit Schema</div>
                  </SettingsLink>}
            </div>
          </Header>
        </div>
        <div className={classes.bottom}>
          <div
            className={cx(
              schemaActive ? classes.buttons_schema : classes.buttons,
              particles.z5,
              {
                [this.props.buttonsClass]:
                  this.props.buttonsClass && this.props.buttonsClass.length > 0,
              },
            )}
          >
            {this.props.model.name === 'User' &&
              !schemaActive &&
              <Link
                className={cx(
                  particles.ml10,
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
                to={{
                  pathname: `/${this.props.params
                    .projectName}/integrations/authentication/email`,
                  state: {
                    returnTo: location.pathname,
                  },
                }}
              >
                Configure Auth Provider
              </Link>}
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

const ReduxContainer = connect(
  state => ({
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }),
  {
    nextStep,
    showNotification,
    showPopup,
  },
)(withRouter(ModelHeader))

export default createFragmentContainer(ReduxContainer, {
  viewer: graphql`
    fragment ModelHeader_viewer on Viewer {
      ...Header_viewer
    }
  `,
  project: graphql`
    fragment ModelHeader_project on Project {
      ...Header_project
    }
  `,
  model: graphql`
    fragment ModelHeader_model on Model {
      id
      name
      itemCount
      isSystem
      fields(first: 1000) {
        edges {
          node {
            id
            name
            typeIdentifier
            relatedModel {
              id
            }
            reverseRelationField {
              name
              id
            }
          }
        }
      }
      ...ModelDescription_model
    }
  `,
})
