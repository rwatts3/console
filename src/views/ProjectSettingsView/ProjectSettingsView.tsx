import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'found'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Viewer, Project } from '../../types/types'
import { ShowNotificationCallback } from '../../types/utils'
import { connect } from 'react-redux'
import { showNotification } from '../../actions/notification'
import { bindActionCreators } from 'redux'
import ResetProjectDataMutation from '../../mutations/ResetProjectDataMutation'
import ResetProjectSchemaMutation from '../../mutations/ResetProjectSchemaMutation'
import DeleteProjectMutation from '../../mutations/Project/DeleteProjectMutation'
import UpdateProjectMutation from '../../mutations/Project/UpdateProjectMutation'
import { onFailureShowNotification } from '../../utils/relay'
import { findDOMNode } from 'react-dom'
import * as cn from 'classnames'
import PermanentAuthTokenRow from './PermanentAuthTokenRow'
import AddPermanentAuthTokenRow from './AddPermanentAuthTokenRow'
const classes = require('./ProjectSettingsView.scss')

interface Props {
  viewer: Viewer & { project: Project }
  params: any
  showNotification: ShowNotificationCallback
  router: any
}

interface State {
  projectName: string
  nameChanged: boolean
  idCopied: boolean
}

class ProjectSettingsView extends React.Component<Props, State> {
  projectIdRef: Element

  constructor(props) {
    super(props)

    this.state = {
      projectName: this.props.viewer.project.name,
      nameChanged: false,
      idCopied: false,
    }
  }

  render() {
    return (
      <div className={classes.root}>
        <div>
          <div className={classes.category}>
            <div className={classes.title}>Project Name</div>
            <span>
              <input
                className={classes.field}
                type="text"
                placeholder="Name"
                defaultValue={this.props.viewer.project.name}
                onChange={e =>
                  this.updateProjectName((e.target as HTMLInputElement).value)}
              />
              {this.state.nameChanged && (
                <div
                  onClick={this.saveSettings}
                  className={cn(classes.button, classes.green)}
                >
                  <span>Save</span>
                </div>
              )}
            </span>
          </div>
          <div className={classes.copy} title="Project Id">
            <div className={classes.copyWrapper}>
              <span className={classes.label}>Project Id</span>
              <span
                onClick={this.selectProjectId}
                className={classes.projectId}
                ref={this.setProjectIdRef}
              >
                {this.props.viewer.project.id}
              </span>

              <CopyToClipboard
                text={this.props.viewer.project.id}
                onCopy={() => this.setState({ idCopied: true } as State)}
              >
                <span className={classes.label}>
                  {this.state.idCopied ? 'Copied' : 'Copy'}
                </span>
              </CopyToClipboard>
            </div>
          </div>
          <div className={classes.category}>
            <div className={classes.title}>Permanent Auth Tokens</div>
            <div className={classes.tokens}>
              <AddPermanentAuthTokenRow
                projectId={this.props.viewer.project.id}
              />
              {this.props.viewer.project.permanentAuthTokens.edges
                .map(edge => edge.node)
                .map(token => (
                  <PermanentAuthTokenRow
                    key={token.id}
                    projectId={this.props.viewer.project.id}
                    permanentAuthToken={token}
                  />
                ))}
            </div>
          </div>
          <div className={classes.category}>
            <div
              className={cn(classes.button, classes.reset)}
              onClick={this.onClickResetProjectData}
            >
              Reset Project Data
            </div>
            <div
              className={classes.button}
              onClick={this.onClickResetCompleteProject}
            >
              Reset Project Data and Models
            </div>
            <div
              className={cn(classes.button, classes.red)}
              onClick={this.onClickDeleteProject}
            >
              Delete Project
            </div>
          </div>
        </div>
      </div>
    )
  }

  private setProjectIdRef = ref => {
    this.projectIdRef = ref
  }

  private onClickResetProjectData = (): void => {
    graphcoolConfirm('This will reset the project data.').then(() => {
      ResetProjectDataMutation.commit({
        projectId: this.props.viewer.project.id,
      }).then(() => {
        this.props.router.replace(
          `/${this.props.params.projectName}/playground`,
        )
      })
    })
  }

  private onClickResetCompleteProject = (): void => {
    graphcoolConfirm(
      'This will reset the projects data and schema.',
    ).then(() => {
      ResetProjectSchemaMutation.commit({
        projectId: this.props.viewer.project.id,
      }).then(() => {
        this.props.router.replace(
          `/${this.props.params.projectName}/playground`,
        )
      })
    })
  }

  private onClickDeleteProject = (): void => {
    if (this.props.viewer.user.projects.edges.length === 1) {
      this.props.showNotification({
        message: `Sorry. You can't delete your last project. This one is a keeper 😉.`,
        level: 'error',
      })
    }
    graphcoolConfirm('This action will delete this project.').then(() => {
      DeleteProjectMutation.commit({
        projectId: this.props.viewer.project.id,
        customerId: this.props.viewer.user.id,
      }).then(() => {
        // TODO replace hard reload
        // was added because deleting the last project caused
        // a relay issue
        window.location.pathname = '/'
      })
    })
  }

  private saveSettings = (): void => {
    UpdateProjectMutation.commit({
      id: this.props.viewer.project.id,
      name: this.state.projectName,
    })
      .then(() => {
        this.props.router.replace(`/${this.state.projectName}/`)
      })
      .catch(transaction => {
        onFailureShowNotification(transaction, this.props.showNotification)
      })
  }

  private updateProjectName = (name: string): void => {
    this.setState({
      projectName: name,
      nameChanged: name !== this.props.viewer.project.name,
    } as State)
  }

  private selectProjectId = (): void => {
    const projectId = findDOMNode(this.projectIdRef)
    const range = document.createRange()
    range.setStartBefore(projectId)
    range.setEndAfter(projectId)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ showNotification }, dispatch)
}

const MappedProjectSettingsView = connect(null, mapDispatchToProps)(
  withRouter(ProjectSettingsView),
)

export default createFragmentContainer(MappedProjectSettingsView, {
  viewer: graphql`
    fragment ProjectSettingsView_viewer on Viewer {
      project: projectByName(projectName: $projectName) {
        name
        id
        permanentAuthTokens(first: 1000) {
          edges {
            node {
              ...PermanentAuthTokenRow_permanentAuthToken
              id
              name
              token
            }
          }
        }
      }
      user {
        projects(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `,
})
