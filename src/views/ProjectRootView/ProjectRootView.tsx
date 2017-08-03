import * as React from 'react'
import { withRouter } from 'found'
import * as fetch from 'isomorphic-fetch'
import { createFragmentContainer, graphql } from 'react-relay'
import * as cookiestore from 'cookiestore'
import { bindActionCreators } from 'redux'
import * as cx from 'classnames'
import mapProps from '../../components/MapProps/MapProps'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import { connect } from 'react-redux'
import { retryUntilDone } from '../../utils/utils'
import ProjectSelection from '../../components/ProjectSelection/ProjectSelection'
import SideNav from '../../views/ProjectRootView/SideNav'
import AuthView from '../AuthView/AuthView'
import {
  fetchGettingStartedState,
  skip,
  update,
} from '../../actions/gettingStarted'
import { Viewer, Customer, Project } from '../../types/types'
import { PopupState } from '../../types/popup'
import { GettingStartedState } from '../../types/gettingStarted'
import tracker from '../../utils/metrics'
import { ConsoleEvents } from 'graphcool-metrics'
import AddProjectPopup from './AddProjectPopup'
import { showNotification } from '../../actions/notification'
import { ShowNotificationCallback } from '../../types/utils'
import ResizableBox from '../../components/ResizableBox'
import * as Dropzone from 'react-dropzone'
import OnboardingBar from './Onboarding/OnboardingBar'
import IntroPopup from './Onboarding/IntroPopup'
import FinalPopup from './Onboarding/FinalPopup'
import { throttle } from 'lodash'
import heartbeat from '../../utils/heartbeat'
require('../../styles/core.scss')

interface State {
  showCreateProjectModal: boolean
  createProjectModalLoading: boolean
  sidebarExpanded: boolean
}

interface Props {
  location: any
  router: any
  children: Element
  isLoggedin: boolean
  viewer: Viewer
  user: Customer & { gettingStartedState: string }
  project: Project
  allProjects: Project[]
  params: any
  relay: any
  gettingStartedState: GettingStartedState
  popup: PopupState
  pollGettingStartedOnboarding: boolean
  update: (step: string, skipped: boolean, customerId: string) => void
  showNotification: ShowNotificationCallback
  skip: () => void
  fetchGettingStartedState: () => void
}

const MIN_SIDEBAR_WIDTH = 67

class ProjectRootView extends React.Component<Props, State> {

  private refreshInterval: any
  private stopHeartbeat: () => void

  private persistResize = throttle(size => {
    localStorage.setItem('sidenav-width', size.width)
  }, 300)

  constructor(props: Props) {
    super(props)

    this.updateForceFetching()

    if (typeof Stripe !== 'undefined') {
      Stripe.setPublishableKey(
        __STRIPE_PUBLISHABLE_KEY__,
      )
    }

    cookiestore.set('graphcool_last_used_project_id', props.project.id)

    this.stopHeartbeat = heartbeat()

    this.state = {
      showCreateProjectModal: false,
      createProjectModalLoading: false,
      sidebarExpanded: true,
    }
  }

  componentWillMount() {
    if (this.props.isLoggedin) {
      tracker.identify(this.props.user.id, this.props.project.id)

      retryUntilDone(done => {
        if (typeof Intercom !== 'undefined') {
          Intercom('boot', {
            app_id: __INTERCOM_ID__,
            user_id: this.props.user.id,
            email: this.props.user.crm.information.email,
            name: this.props.user.crm.information.name,
          })
        }
      })

      if (typeof Raven !== 'undefined') {
        Raven.setUserContext({
          userId: this.props.user.id,
          email: this.props.user.crm.information.email,
          name: this.props.user.crm.information.name,
          projectId: this.props.project.id,
        })
      }
      this.checkCliOnboarding()

      if (
        this.props.location.search.includes('chat') &&
        window &&
        (window as any).Intercom
      ) {
        ;(window as any).Intercom('showNewMessage')
      }
    } else {
      // TODO migrate to tracker
      // analytics.identify({
      //   'Product': 'Dashboard',
      // })
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval)
    this.stopHeartbeat()
  }

  checkCliOnboarding() {
    const { gettingStartedState } = this.props

    if (gettingStartedState.isActive) {
      const fromCli = localStorage.getItem('graphcool_from_cli')
      if (fromCli) {
        localStorage.removeItem('graphcool_from')
        this.props.skip()
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { step, skipped } = this.props.gettingStartedState
    const prevStep = prevProps.gettingStartedState.step

    if (
      this.props.params.projectName !== prevProps.params.projectName &&
      this.props.isLoggedin
    ) {
      tracker.identify(this.props.user.id, this.props.project.id)
    }

    if (step !== prevStep) {
      this.updateForceFetching()
      tracker.track(ConsoleEvents.Onboarding.gettingStarted({ step, skipped }))
    } else if (this.props.pollGettingStartedOnboarding) {
      this.updateForceFetching()
    }
  }

  render() {
    if (!this.props.isLoggedin) {
      return <AuthView initialScreen="login" location={this.props.location} />
    }

    const blur = this.props.popup.popups.reduce(
      (acc, p) => p.blurBackground || acc,
      false,
    )

    return (
      <div className="project-root-view">
        <style jsx>{`
          .project-root-view {
            @p: .vh100, .overflowHidden, .flex;
          }
          .project-wrapper {
            @p: .flex, .w100;
          }
          :global(.react-resizable) {
            @p: .relative;
          }
          .blur {
            filter: blur(5px);
          }
          .sidebar {
            @p: .flexFixed, .vh100, .flex, .flexColumn, .itemsStretch;
          }
          .content {
            @p: .vh100, .w100, .flex, .itemsStretch, .overflowAuto;
          }
          .inner-content {
            @p: .w100, .vh100;
          }
          .onboarding-nav {
            @p: .flexFixed, .z999, .vh100, .bgGreen, .flex;
          }
        `}</style>
        <Dropzone
          onDrop={this.onDrop}
          disableClick={true}
          multiple={false}
          style={{
            height: '100vh',
            width: '100vw',
          }}
        >
          <div className={cx('project-wrapper', { blur })}>
            <ResizableBox
              width={parseInt(localStorage.getItem('sidenav-width'), 10) || 290}
              height={window.innerHeight}
              minConstraints={[MIN_SIDEBAR_WIDTH, window.innerHeight]}
              maxConstraints={[290, window.innerHeight]}
              draggableOpts={{ grid: [226, 226] }}
              onResize={this.handleResize}
            >
              <div className="sidebar">
                <ProjectSelection
                  params={this.props.params}
                  projects={this.props.allProjects}
                  selectedProject={this.props.project}
                  add={this.handleShowProjectModal}
                  sidebarExpanded={this.state.sidebarExpanded}
                />
                <SideNav
                  params={this.props.params}
                  location={this.props.location}
                  project={this.props.project}
                  viewer={this.props.viewer}
                  projectCount={this.props.allProjects.length}
                  expanded={this.state.sidebarExpanded}
                />
              </div>
            </ResizableBox>
            <div className="content">
              <div className="inner-content">
                {this.props.children}
              </div>
              {this.props.gettingStartedState.isActive() &&
                <OnboardingBar params={this.props.params} />}
            </div>
          </div>
        </Dropzone>
        {this.props.popup.popups.map(popup =>
          <PopupWrapper key={popup.id} id={popup.id}>
            {popup.element}
          </PopupWrapper>,
        )}
        {/*<OnboardingPopup firstName={this.props.user.crm.information.name}/>*/}
        {this.props.gettingStartedState.isCurrentStep('STEP0_OVERVIEW') &&
          <IntroPopup />}
        {(this.props.gettingStartedState.isCurrentStep(
          'STEP5_SELECT_EXAMPLE',
        ) ||
          this.props.gettingStartedState.isCurrentStep('STEP5_WAITING') ||
          this.props.gettingStartedState.isCurrentStep('STEP5_DONE')) &&
          <FinalPopup projectId={this.props.project.id} />}
        {this.state.showCreateProjectModal &&
          <AddProjectPopup
            onRequestClose={this.handleCloseProjectModal}
            customerId={this.props.user.id}
          />}
      </div>
    )
  }

  private handleResize = (_, { size }) => {
    if (size.width === MIN_SIDEBAR_WIDTH) {
      this.setState({ sidebarExpanded: false } as State)
    } else {
      this.setState({ sidebarExpanded: true } as State)
    }
    this.persistResize(size)
  }

  private updateForceFetching() {
    if (this.props.pollGettingStartedOnboarding) {
      if (!this.refreshInterval) {
        this.refreshInterval = setInterval(() => {
          this.props.fetchGettingStartedState()
        }, 5000)
      }
    } else {
      clearInterval(this.refreshInterval)
    }
  }

  private handleShowProjectModal = () => {
    this.setState({ showCreateProjectModal: true } as State)
  }

  private handleCloseProjectModal = () => {
    this.setState({ showCreateProjectModal: false } as State)
  }

  private onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const fileEndpoint = `${__BACKEND_ADDR__}/file/v1/${this.props.viewer
        .project.id}`
      const data = new FormData()
      data.append('data', file)

      fetch(fileEndpoint, {
        method: 'POST',
        body: data,
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.props.showNotification({
              level: 'error',
              message: res.error,
            })
          } else {
            this.props.showNotification({
              level: 'success',
              message: `Successfuly uploaded the file ${res.name}. It's now available at ${res.url}.`,
            })
          }
        })
    }
  }
}

const mapStateToProps = state => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
    pollGettingStartedOnboarding: state.gettingStarted.poll,
    popup: state.popup,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { update, showNotification, skip, fetchGettingStartedState },
    dispatch,
  )
}

const ReduxContainer = connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ProjectRootView),
)

const MappedProjectRootView = mapProps({
  params: props => props.params,
  // TODO props.relay.* APIs do not exist on compat containers
  relay: props => props.relay,
  project: props => (props.viewer.user ? props.viewer.project : null),
  allProjects: props =>
    props.viewer.user
      ? props.viewer.user.projects.edges.map(edge => edge.node)
      : null,
  viewer: props => props.viewer,
  user: props => props.viewer.user,
  isLoggedin: props => props.viewer.user !== null,
})(ReduxContainer)

export default createFragmentContainer(MappedProjectRootView, {
  viewer: graphql`
    fragment ProjectRootView_viewer on Viewer {
      id
      project: projectByName(projectName: $projectName) {
        id
        name
        ...SideNav_project
        seats(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
      user {
        id
        crm {
          information {
            name
            email
            isBeta
          }
        }
        projects(first: 1000) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      ...SideNav_viewer
    }
  `,
})
