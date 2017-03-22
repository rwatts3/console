import * as React from 'react'
import {withRouter} from 'react-router'
import * as Relay from 'react-relay'
import * as cookiestore from 'cookiestore'
import {bindActionCreators} from 'redux'
import * as cx from 'classnames'
import mapProps from '../../components/MapProps/MapProps'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import OnboardingPopup from '../../components/onboarding/OnboardingPopup/OnboardingPopup'
import PlaygroundCPopup from '../../components/onboarding/PlaygroundCPopup/PlaygroundCPopup'
import {connect} from 'react-redux'
import {validateProjectName} from '../../utils/nameValidator'
import {retryUntilDone} from '../../utils/utils'
import ProjectSelection from '../../components/ProjectSelection/ProjectSelection'
import SideNav from '../../views/ProjectRootView/SideNav'
import OnboardSideNav from './OnboardSideNav'
import LoginView from '../../views/LoginView/LoginView'
import AddProjectMutation from '../../mutations/AddProjectMutation'
import {update} from '../../actions/gettingStarted'
import {Viewer, Customer, Project} from '../../types/types'
import {PopupState} from '../../types/popup'
import {GettingStartedState} from '../../types/gettingStarted'
import tracker from '../../utils/metrics'
import {ConsoleEvents} from 'graphcool-metrics'
import drumstick from 'drumstick'
import Alert from '../../components/Window/Alert'
require('../../styles/core.scss')
import AddProjectPopup from './AddProjectPopup'
import {showNotification} from '../../actions/notification'
import {onFailureShowNotification} from '../../utils/relay'
import {ShowNotificationCallback} from '../../types/utils'

interface State {
  showCreateProjectModal: boolean
  projectName: string
  showError: boolean
  createProjectModalLoading: boolean
}

interface Props {
  router: ReactRouter.InjectedRouter
  children: Element
  isLoggedin: boolean
  viewer: Viewer
  user: Customer & {gettingStartedState: string}
  project: Project
  allProjects: Project[]
  params: any
  relay: any
  gettingStartedState: GettingStartedState
  popup: PopupState
  pollGettingStartedOnboarding: boolean
  update: (step: string, skipped: boolean, customerId: string) => void
  showNotification: ShowNotificationCallback
}

class ProjectRootView extends React.PureComponent<Props, State> {

  shouldComponentUpdate: any

  private refreshInterval: any

  constructor(props: Props) {
    super(props)

    this.updateForceFetching()

    Stripe.setPublishableKey(__STRIPE_PUBLISHABLE_KEY__)

    cookiestore.set('graphcool_last_used_project_id', props.project.id)

    let lastUsedProjectId = null
    let authToken = null

    if (cookiestore.has('graphcool_auth_token')) {
      authToken = cookiestore.get('graphcool_auth_token')
    }

    if (cookiestore.has('graphcool_last_used_project_id')) {
      lastUsedProjectId = cookiestore.get('graphcool_last_used_project_id')
    }

    if (__HEARTBEAT_ADDR__) {
      drumstick.start({
        endpoint: __HEARTBEAT_ADDR__,
        payload: () => ({
          resource: 'console',
          token: authToken,
          projectId: lastUsedProjectId,
        }),
        frequency: 60 * 1000,
      })
    }

    this.state = {
      showCreateProjectModal: false,
      createProjectModalLoading: false,
      showError: false,
      projectName: '',
    }
  }

  componentWillMount() {
    if (this.props.isLoggedin) {

      tracker.identify(this.props.user.id, this.props.project.id)

      retryUntilDone((done) => {
        if (window.Intercom) {
          Intercom('boot', {
            app_id: __INTERCOM_ID__,
            user_id: this.props.user.id,
            email: this.props.user.crm.information.email,
            name: this.props.user.crm.information.name,
          })

          // TODO adjusts events to Intercom
          // Smooch.on('message:sent', () => {
          //   tracker.track(ConsoleEvents.Smooch.messageWritten())
          // })

          // Smooch.on('widget:opened', () => {
          //   tracker.track(ConsoleEvents.Smooch.opened())
          // })

        }
      })
    } else {
      // TODO migrate to tracker
      // analytics.identify({
      //   'Product': 'Dashboard',
      // })
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval)
  }

  componentDidUpdate(prevProps: Props) {
    const {gettingStarted, gettingStartedSkipped} = this.props.user.crm.onboardingStatus
    const prevGettingStarted = prevProps.user.crm.onboardingStatus.gettingStarted

    if (this.props.params.projectName !== prevProps.params.projectName && this.props.isLoggedin) {
      tracker.identify(this.props.user.id, this.props.project.id)
    }

    if (gettingStarted !== prevGettingStarted) {
      this.updateForceFetching()

      tracker.track(ConsoleEvents.Onboarding.gettingStarted({step: gettingStarted, skipped: gettingStartedSkipped}))
    } else if (this.props.pollGettingStartedOnboarding !== prevProps.pollGettingStartedOnboarding) {
      this.updateForceFetching()
    }
  }

  render() {
    if (!this.props.isLoggedin) {
      return (
        <LoginView/>
      )
    }

    const blur = this.props.popup.popups.reduce((acc, p) => p.blurBackground || acc, false)
    const error = !validateProjectName(this.state.projectName)

    return (
      <div className='project-root-view'>
        <style jsx>{`
          .project-root-view {
            @p: .h100, .overflowHidden, .flex;
          }
          .project-wrapper {
            @p: .flex, .w100;
          }
          .blur {
            filter: blur(5px);
          }
          .sidebar {
            @p: .flexFixed, .h100, .flex, .flexColumn;
          }
          .content {
            @p: .h100, .w100, .flex;
          }
        `}</style>
        <div className={cx('project-wrapper', {blur})}>
          <div className='sidebar'>
            <ProjectSelection
              params={this.props.params}
              projects={this.props.allProjects}
              selectedProject={this.props.project}
              add={this.handleShowProjectModal}
            />
            <SideNav
              params={this.props.params}
              project={this.props.project}
              viewer={this.props.viewer}
              projectCount={this.props.allProjects.length}
            />
          </div>
          <div className='content'>
            <div
              className='overflow-auto'
              style={{
                flex: `0 0 calc(100%${this.props.gettingStartedState.isActive() ? ' - 266px' : ''})`,
              }}>
              {this.props.children}
            </div>
            {this.props.gettingStartedState.isActive() &&
            <div className='flex bg-accent' style={{ flex: '0 0 266px', zIndex: 1000, height: '100vh' }}>
              <OnboardSideNav params={this.props.params}/>
            </div>
            }
          </div>
        </div>
        {this.props.popup.popups.map(popup =>
          <PopupWrapper key={popup.id} id={popup.id}>
            {popup.element}
          </PopupWrapper>,
        )}
        {this.props.gettingStartedState.isCurrentStep('STEP0_OVERVIEW') &&
          <PopupWrapper>
            <OnboardingPopup firstName={this.props.user.crm.information.name}/>
          </PopupWrapper>
        }
        {(this.props.gettingStartedState.isCurrentStep('STEP4_CLICK_TEASER_STEP5') ||
        this.props.gettingStartedState.isCurrentStep('STEP5_SELECT_EXAMPLE') ||
        this.props.gettingStartedState.isCurrentStep('STEP5_WAITING') ||
        this.props.gettingStartedState.isCurrentStep('STEP5_DONE')) &&
          <PopupWrapper>
            <PlaygroundCPopup projectId={this.props.project.id} />
          </PopupWrapper>
        }
        <Alert />
        {this.state.showCreateProjectModal && (
          <AddProjectPopup
            projectName={this.state.projectName}
            isOpen={this.state.showCreateProjectModal}
            onRequestClose={this.handleCloseProjectModal}
            onSubmit={this.addProject}
            onChangeProjectName={this.handleChangeProjectName}
            error={error}
            showError={this.state.showError}
            loading={this.state.createProjectModalLoading}
          />
        )}
      </div>
    )
  }

  private updateForceFetching() {
    if (this.props.pollGettingStartedOnboarding) {
      if (!this.refreshInterval) {
        this.refreshInterval = setInterval(
          () => {
            // ideally we would handle this with a Redux thunk, but somehow Relay does not support raw force fetches...
            this.props.relay.forceFetch({}, () => {
              this.props.update(
                this.props.user.crm.onboardingStatus.gettingStarted,
                this.props.user.crm.onboardingStatus.gettingStartedSkipped,
                this.props.user.id,
              )
            })
          },
          1500,
        )
      }
    } else {
      clearInterval(this.refreshInterval)
    }
  }

  private handleShowProjectModal = () => {
    this.setState({showCreateProjectModal: true} as State)
  }

  private handleCloseProjectModal = () => {
    this.setState({showCreateProjectModal: false} as State)
  }

  private handleChangeProjectName = (e: any) => {
    this.setState({projectName: e.target.value} as State)
  }

  private addProject = () => {
    const {projectName} = this.state
    if (!validateProjectName(projectName)) {
      return this.setState({showError: true} as State)
    }
    this.setState(
      {createProjectModalLoading: true} as State,
      () => {
        if (projectName) {
          Relay.Store.commitUpdate(
            new AddProjectMutation({
              projectName,
              customerId: this.props.viewer.user.id,
            }),
            {
              onSuccess: () => {
                tracker.track(ConsoleEvents.Project.created({name: projectName}))
                this.setState({showCreateProjectModal: false, createProjectModalLoading: false} as State)
                this.props.router.replace(`${projectName}`)
              },
              onFailure: (transaction) => {
                this.setState({createProjectModalLoading: false} as State)
                onFailureShowNotification(transaction, this.props.showNotification)
              },
            },
          )
        }
      },
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
    pollGettingStartedOnboarding: state.gettingStarted.poll,
    popup: state.popup,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({update, showNotification}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ProjectRootView))

const MappedProjectRootView = mapProps({
  params: (props) => props.params,
  relay: (props) => props.relay,
  project: (props) => props.viewer.user ? props.viewer.project : null,
  allProjects: (props) => (
    props.viewer.user
      ? props.viewer.user.projects.edges.map((edge) => edge.node)
      : null
  ),
  viewer: (props) => props.viewer,
  user: (props) => props.viewer.user,
  isLoggedin: (props) => props.viewer.user !== null,
})(ReduxContainer)

export default Relay.createContainer(MappedProjectRootView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project: projectByName(projectName: $projectName) {
          id
          name
          ${SideNav.getFragment('project')}
          seats(first: 100) {
            edges
          }
        }
        user {
          id
          crm {
            onboardingStatus {
              gettingStarted
              gettingStartedSkipped
            }
            information {
              name
              email
            }
          }
          projects(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
        ${SideNav.getFragment('viewer')}
      }
    `,
  },
})
