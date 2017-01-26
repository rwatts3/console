import * as React from 'react'
import * as Relay from 'react-relay'
import ResetProjectDataMutation from '../../../mutations/ResetProjectDataMutation'
import ResetProjectSchemaMutation from '../../../mutations/ResetProjectSchemaMutation'
import DeleteProjectMutation from '../../../mutations/DeleteProjectMutation'
import {Viewer} from '../../../types/types'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {ShowNotificationCallback} from '../../../types/utils'

interface Props {
  viewer: Viewer
  params: any
  showNotification: ShowNotificationCallback
}

class DangerZone extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .mt38, .bt, .pt38, .ph60, .bgWhite;
            border-color: rgba(208,2,27,1);
          }

          .actionRow {
            @inherit: .flex, .justifyBetween, .itemsCenter, .pv25, .ph16, .bb;
            border-color: rgba( 229, 229, 229, 1);
          }

          .infoTitle {
            @inherit: .fw3, .black50, .f25;
          }

          .infoDescription {
            @inherit: .black50, .f16;
          }

          .actionButton {
            @inherit: .pv10, .ph16, .f16, .nowrap, .br2, .pointer;
            color: rgba(241,143,1,1);
            background-color: rgba(241,143,1,.2);
          }

          .deleteActionRow {
            @inherit: .flex, .justifyBetween, .itemsCenter, .pv25, .ph16;
          }

          .deleteInfoTitle {
            @inherit: .fw3, .f25;
            color: rgba(242,92,84,1);
          }

          .deleteInfoDescription {
            @inherit: .f16;
            color: rgba(242,92,84,1);
          }

          .deleteActionButton {
            @inherit: .pv10, .ph16, .f16, .nowrap, .br2, .pointer;
            color: rgba(242,92,84,1);
            background-color: rgba(242,92,84,.2);
          }
        `}</style>
        <div className='actionRow'>
          <div>
            <div className='infoTitle'>Delete Nodes</div>
            <div className='infoDescription'>Delete all nodes, but keep models and fields</div>
          </div>
          <div
            className='actionButton'
            onClick={this.onClickResetProjectData}
          >
            Delete Nodes
          </div>
        </div>
        <div className='actionRow'>
          <div>
            <div className='infoTitle'>Reset All Project Data</div>
            <div className='infoDescription'>Delete everything inside the project.</div>
          </div>
          <div
            className='actionButton'
            onClick={this.onClickResetCompleteProject}
          >
            Reset Everything
          </div>
        </div>
        <div className='deleteActionRow'>
          <div>
            <div className='deleteInfoTitle'>Delete this Project</div>
            <div className='deleteInfoDescription'>That's the point of no return.</div>
            </div>
            <div
              className='deleteActionButton'
              onClick={this.onClickDeleteProject}
            >
              Delete Project</div>
          </div>
        </div>
    )
}

  private onClickResetProjectData = (): void => {
    if (window.confirm('Do you really want to reset the project data?')) {
      Relay.Store.commitUpdate(
        new ResetProjectDataMutation({
          projectId: this.props.viewer.project.id,
        }),
        {
          onSuccess: () => {
            console.log('SUCCESS')
            // this.props.router.replace(`/${this.props.params.projectName}/playground`)
          },
          onFailure: () => {
            console.error('Couldn ot delete stuff')
            // this.props.router.replace(`/${this.props.params.projectName}/playground`)
          },
        })
    }
  }

  private onClickResetCompleteProject = (): void => {
    if (window.confirm('Do you really want to reset the project data and models? ')) {
      Relay.Store.commitUpdate(
        new ResetProjectSchemaMutation({
          projectId: this.props.viewer.project.id,
        }),
        {
          onSuccess: () => {
            // this.props.router.replace(`/${this.props.params.projectName}/playground`)
          },
        })
    }
  }

  private onClickDeleteProject = (): void => {
    if (this.props.viewer.user.projects.edges.length === 1) {
      this.props.showNotification({
        message: `Sorry. You can't delete your last project. This one is a keeper.`,
        level: 'error',
      })
    } else if (window.confirm('Do you really want to delete this project?')) {
      Relay.Store.commitUpdate(
        new DeleteProjectMutation({
          projectId: this.props.viewer.project.id,
          customerId: this.props.viewer.user.id,
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

}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedDangerZone = connect(null, mapDispatchToProps)(withRouter(DangerZone))

export default Relay.createContainer(MappedDangerZone, {
  initialVariables: {
    projectName: 'Test', // TODO
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
          name
        }
        user {
          id
          projects(first: 10) {
            edges
          }
        }
      }
    `,
  },
})
