import * as React from 'react'
import * as Relay from 'react-relay'
import {Project} from '../../../types/types'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {$p} from 'graphcool-styles'
import UpdateProjectMutation from '../../../mutations/UpdateProjectMutation'

interface Props {
  project: Project
}

interface State {
  isEnteringProjectName: boolean
  newProjectName: string
}

class ProjectInfo extends React.Component<Props, State> {

  state = {
    isEnteringProjectName: false,
    newProjectName: '',
  }

  render() {
    return (

      <div className='container'>
        <style jsx={true}>{`

          .container {
            @inherit: .flex, .flexColumn, .pt38, .pl60;
          }

          .infoBox {
            @inherit: .flex, .flexColumn, .pl16, .pt16, .pb25;
          }

          .title {
            @inherit: .black, .o40, .f14;
          }

          .value {
            @inherit: .fw3, .f25, .pt6;
          }

          .editable {
            @inherit: .pointer;
          }

          .centeredRow {
            @inherit: .flex, .itemsCenter;
          }

          .inputField {
            @inherit: .f25, .fw3, .w100;
            color: rgba(42,127,211,1);
          }

        `}</style>
        <div className='infoBox'>
          <div className='title'>Project Name</div>
          {this.state.isEnteringProjectName ?
            (
              <div className='centeredRow'>
                <input
                  className='inputField'
                  placeholder='Define a name for the token ...'
                  value={this.state.newProjectName}
                  onKeyDown={this.handleKeyDown}
                  onChange={(e: any) => this.setState({newProjectName: e.target.value} as State)}
                />
                <Icon
                  className={$p.ml6}
                  src={require('../../../assets/icons/edit_project_name.svg')}
                  width={20}
                  height={20}
                />
              </div>
            )
            :
            (
              <div className='centeredRow'>
                <div
                  className='value editable'
                  onClick={() => this.setState({isEnteringProjectName: true} as State)}
                >
                  {this.props.project.name}
                </div>
                <Icon
                  className={$p.ml6}
                  src={require('../../../assets/icons/edit_project_name.svg')}
                  width={20}
                  height={20}
                />
              </div>
            )
          }
        </div>
        <div className='infoBox'>
          <div className='centeredRow'>
            <Icon
              className={$p.mr6}
              src={require('../../../assets/icons/lock.svg')}
              width={10}
              height={13}
            />
            <div className='title'>Project Id</div>
          </div>
          <div className='value'>{this.props.project.id}</div>
        </div>
      </div>
    )
  }

  private saveSettings = (): void => {
    Relay.Store.commitUpdate(
      new UpdateProjectMutation(
        {
          project: this.props.project,
          name: this.state.newProjectName,
        }),
      {
        onSuccess: () => {
          // this.props.router.replace(`/${this.state.projectName}/`)
        },
        onFailure: (transaction) => {
          // onFailureShowNotification(transaction, this.props.showNotification)
        },
      })
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.saveSettings()
    } else if (e.keyCode === 27) {
      this.setState({
        isEnteringProjectName: false,
      } as State)
    }
  }

}

export default Relay.createContainer(ProjectInfo, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        name
      }
    `,
  },
})
