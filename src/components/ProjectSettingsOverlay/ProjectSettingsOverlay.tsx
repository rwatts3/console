import * as React from 'react'
import * as Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import { Project } from '../../types/types'
import { ShowNotificationCallback } from '../../types/utils'
import { onFailureShowNotification } from '../../utils/relay'
import UpdateProjectMutation from '../../mutations/UpdateProjectMutation'
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation'
import ResetProjectSchemaMutation from '../../mutations/ResetProjectSchemaMutation'
import ResetProjectDataMutation from '../../mutations/ResetProjectDataMutation'

const classes: any = require('./ProjectSettingsOverlay.scss')

interface Props {
  params: any,
  project: Project,
  projectCount: number,
  hide?: () => void,
  viewer: any
}

interface State {
  projectName: string
}

export default class ProjectSettingsOverlay extends React.Component<Props, State> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    router: any,
    showNotification: ShowNotificationCallback
  }

  refs: {
    [key: string]: any
    projectId: Element
  }

  constructor (props: Props) {
    super(props)
    this._onClickResetProjectData = this._onClickResetProjectData.bind(this)
    this._onClickResetCompleteProject = this._onClickResetCompleteProject.bind(this)
    this._onClickDeleteProject = this._onClickDeleteProject.bind(this)
    this._save = this._save.bind(this)
    this._updateProjectName = this._updateProjectName.bind(this)
  }

  _onClickResetProjectData (): void {
    if (window.confirm('Do you really want to reset the project data?')) {
      Relay.Store.commitUpdate(
        new ResetProjectDataMutation({
          projectId: this.props.project.id,
        }),
        {
          onSuccess: () => {
            this.context.router.replace(`/${this.props.params.projectName}/playground`)
          },
        })
    }
  }

  _onClickResetCompleteProject (): void {
    if (window.confirm('Do you really want to reset the project data and models? ')) {
      Relay.Store.commitUpdate(
        new ResetProjectSchemaMutation({
          projectId: this.props.project.id,
        }),
        {
          onSuccess: () => {
            this.context.router.replace(`/${this.props.params.projectName}/playground`)
          },
        })
    }
  }

  _onClickDeleteProject (): void {
    if (this.props.projectCount === 1) {
      window.alert('You can\'t delete your last project!')
    } else if (window.confirm('Do you really want to delete this project?')) {
      Relay.Store.commitUpdate(
        new DeleteProjectMutation({
          projectId: this.props.project.id,
          userId: this.props.viewer.user.id,
        }),
        {
          onSuccess: () => {
            // TODO replace hard reload
            // was added because deleting the last project caused
            // a relay issue
            window.location.pathname = '/'
          },
        })
    }
  }

  _save (): void {
    Relay.Store.commitUpdate(
      new UpdateProjectMutation(
        {
          project: this.props.project,
          name: this.state.projectName,
        }),
      {
        onSuccess: () => {
            this.props.hide()
          },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.context.showNotification)
        },
      })
  }

  _updateProjectName(name: string): void {
    this.setState({
      projectName: name,
    } as State)
  }

  _selectProjectId (): void {
    const projectId = findDOMNode(this.refs.projectId)
    const range = document.createRange()
    range.setStartBefore(projectId)
    range.setEndAfter(projectId)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)

    analytics.track('header: projectid copied')
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Project settings</div>
          <div className={classes.copy} title='Project Id'>
            <div onClick={this._selectProjectId.bind(this)} className={classes.copyWrapper}>
              <span className={classes.projectId} ref='projectId'>
                {this.props.project.id}
              </span>
              <span className={classes.label}>
                Project Id
              </span>
            </div>
          </div>
          <input className={classes.input}
            type='text' placeholder='Name' defaultValue={this.props.project.name}
            onChange={(e) => this._updateProjectName((e.target as HTMLInputElement).value)}
          />
          <div className={classes.section}>
            <div className={classes.reset} onClick={this._onClickResetProjectData}>Reset Project Data</div>
            <div
              className={classes.delete}
              onClick={this._onClickResetCompleteProject}
            >
              Reset Project Data and Models
            </div>
            <div className={classes.delete} onClick={this._onClickDeleteProject}>Delete Project</div>
          </div>
          <div onClick={this.props.hide.bind(this)} className={classes.buttonCancel}>Cancel</div>
          <div onClick={this._save} className={classes.buttonSubmit}>Save</div>
        </div>
      </div>
    )
  }
}
