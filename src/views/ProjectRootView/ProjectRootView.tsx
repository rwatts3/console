import * as React from 'react'
import * as Relay from 'react-relay'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from '../../components/MapProps/MapProps'
import { connect } from 'react-redux'
import Smooch from 'smooch'
import { validateProjectName } from '../../utils/nameValidator'
import ProjectSelection from '../../components/ProjectSelection/ProjectSelection'
import Header from '../../components/Header/Header'
import SideNav from '../../views/ProjectRootView/SideNav'
import LoginView from '../../views/LoginView/LoginView'
import AddProjectMutation from '../../mutations/AddProjectMutation'
const update: any = (require('../../reducers/GettingStartedState') as any).update
import { Viewer, Client, Project} from '../../types/types'
const classes: any = require('./ProjectRootView.scss')

require('../../styles/core.scss')

interface Props {
  children: Element
  isLoggedin: boolean
  viewer: Viewer
  user: Client
  project: Project
  allProjects: Project[]
  params: any
  relay: any
  gettingStartedState: any
  checkStatus: boolean
  update: (step: string, userId: string) => void
}

class ProjectRootView extends React.Component<Props, {}> {

  _refreshInterval: any
  shouldComponentUpdate: any

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._updateForceFetching()
  }

  componentWillMount () {
    if (this.props.isLoggedin) {
      analytics.identify(this.props.user.id, {
        name: this.props.user.name,
        email: this.props.user.email,
        'Getting Started Status': this.props.gettingStartedState.step,
        'Product': 'Dashboard',
      })

      Smooch.init({
        appToken: __SMOOCH_TOKEN__,
        givenName: this.props.user.name,
        email: this.props.user.email,
        customText: {
          headerText: 'Can I help you? 🙌',
        },
      })
    } else {
      analytics.identify({
        'Product': 'Dashboard',
      })
    }
  }

  componentWillUnmount () {
    clearInterval(this._refreshInterval)
  }

  componentDidUpdate (prevProps) {
    const newStatus = this.props.user.gettingStartedStatus
    const prevStatus = prevProps.user.gettingStartedStatus

    const newCheckStatus = this.props.checkStatus
    const prevCheckStatus = prevProps.checkStatus

    if (newStatus !== prevStatus) {
      this._updateForceFetching()

      if (newStatus === 'STEP11_SKIPPED') {
        analytics.track(`getting-started: skipped at ${prevStatus}`)
      } else {
        analytics.track(`getting-started: finished ${prevStatus}`)
      }
      analytics.identify(this.props.user.id, {
        'Getting Started Status': this.props.user.gettingStartedStatus,
      })
    } else if (newCheckStatus !== prevCheckStatus) {
      this._updateForceFetching()
    }
  }

  _updateForceFetching () {
    if (this.props.checkStatus) {
      if (!this._refreshInterval) {
        this._refreshInterval = setInterval(
          () => {
            // ideally we would handle this with a Redux thunk, but somehow Relay does not support raw force fetches...
            this.props.relay.forceFetch({ }, () => {
              this.props.update(this.props.user.gettingStartedStatus, this.props.user.id)
            })
          },
          1500
        )
      }
    } else {
      clearInterval(this._refreshInterval)
    }
  }

  _addProject = () => {
    let projectName = window.prompt('Project name:')
    while (projectName != null && !validateProjectName(projectName)) {
      projectName = window.prompt('The inserted project name was invalid.' +
        ' Enter a valid project name, like "Project 2" or "My Project":')
    }
    if (projectName) {
      Relay.Store.commitUpdate(
        new AddProjectMutation({
          projectName,
          userId: this.props.viewer.user.id,
        }),
        {
          onSuccess: () => {
            analytics.track('sidenav: created project', {
              project: projectName,
            })
          },
        }
      )
    }
  }

  render () {
    if (!this.props.isLoggedin) {
      return (
        <LoginView viewer={this.props.viewer} />
      )
    }

    return (
      <div className={classes.root}>
        <header className={classes.header}>
          <div className={classes.headerLeft}>
            <ProjectSelection
              params={this.props.params}
              projects={this.props.allProjects}
              selectedProject={this.props.project}
              add={this._addProject}
            />
          </div>
          <div className={classes.headerRight}>
            <Header
              viewer={this.props.viewer}
              projectId={this.props.project.id}
              params={this.props.params}
            />
          </div>
        </header>
        <div className={classes.main}>
          <div className={classes.sidenav}>
            <SideNav
              params={this.props.params}
              project={this.props.project}
              viewer={this.props.viewer}
              projectCount={this.props.allProjects.length}
              />
          </div>
          <div className={classes.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStartedState,
    checkStatus: state.checkStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (step, userId) => {
      dispatch(update(step, userId))
    },
  }
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectRootView)

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
        }
        user {
          id
          email
          name
          gettingStartedStatus
          projects(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
        ${LoginView.getFragment('viewer')}
        ${SideNav.getFragment('viewer')}
        ${Header.getFragment('viewer')}
      }
    `,
  },
})
