import * as React from 'react'
import * as Relay from 'react-relay'
import {Project} from '../../../types/types'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {$p, $v} from 'graphcool-styles'
import UpdateProjectMutation from '../../../mutations/UpdateProjectMutation'
import {ShowNotificationCallback} from '../../../types/utils'
import {onFailureShowNotification} from '../../../utils/relay'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import CopyToClipboard from 'react-copy-to-clipboard'
import * as cx from 'classnames'

interface Props {
  project: Project
  showNotification: ShowNotificationCallback
}

interface State {
  isEnteringProjectName: boolean
  newProjectName: string
  isHoveringProjectName: boolean
  projectIdCopied: boolean
}

class ProjectInfo extends React.Component<Props, State> {

  state = {
    isEnteringProjectName: false,
    newProjectName: '',
    isHoveringProjectName: false,
    projectIdCopied: false,
  }

  copyTimer: number

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
            @inherit: .f25, .fw3, .w100, .pt6;
            max-width: 300px;
            color: rgba(42,127,211,1);
          }

          .saveButton {
            @inherit: .ph10, .pv6, .fw6, .ttu, .f14, .buttonShadow, .pointer;
            color: rgba(42,127,211,1);
          }

          .resetButton {
            @inherit: .underline, .pl6, .f14, .fw6, .pointer;
            color: rgba(241,143,1,1);
          }

        `}</style>

        {this.state.isEnteringProjectName ?
          (
            <div className='infoBox'>
              <div className='centeredRow'>
                <div className='title'>Project Name</div>
                <div
                  className='resetButton'
                  onClick={() => this.setState({isEnteringProjectName: false} as State)}
                >
                  Reset
                </div>
              </div>
              <div className='centeredRow'>
                <input
                  autoFocus={true}
                  className='inputField'
                  placeholder={this.props.project.name}
                  value={this.state.newProjectName}
                  onKeyDown={this.handleKeyDown}
                  onChange={(e: any) => this.setState({newProjectName: e.target.value} as State)}
                />
                <div
                  className='saveButton'
                  onClick={this.saveSettings}
                >
                  Save
                </div>
              </div>
            </div>

          )
          :
          (
            <div className='infoBox'>
              <div className='title'>Project Name</div>
              <div
                className='centeredRow editable'
                onMouseEnter={() => this.setState({isHoveringProjectName: true} as State)}
                onMouseLeave={() => this.setState({isHoveringProjectName: false} as State)}
                onClick={() => this.setState({
                    isEnteringProjectName: true,
                    isHoveringProjectName: false,
                  } as State)}
              >
                <div
                  className='value'
                >
                  {this.props.project.name}
                </div>
                {this.state.isHoveringProjectName && (<Icon
                  className={$p.ml6}
                  src={require('../../../assets/icons/edit_project_name.svg')}
                  width={20}
                  height={20}
                />)}
              </div>
            </div>

          )
        }
        <div className='infoBox'>
          <div className='centeredRow'>
            <Icon
              className={$p.mr6}
              src={require('../../../assets/icons/lock.svg')}
              width={14}
              height={20}
            />
            <div className='title'>Project ID</div>
          </div>
          <div className='centeredRow'>
            <div className='value'>{this.props.project.id}</div>
            <CopyToClipboard
              text={this.props.project.id}
              onCopy={() => this.setState({projectIdCopied: true} as State)}
            >
              <Icon
                className={cx($p.ml10, $p.pointer, $p.buttonShadow)}
                color={'rgba(0,0,0,.5)'}
                src={require('../../../assets/icons/copy.svg')}
                width={34}
                height={34}
              />
            </CopyToClipboard>
          </div>
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
          onFailureShowNotification(transaction, this.props.showNotification)
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const mappedProjectInfo = connect(null, mapDispatchToProps)(ProjectInfo)

export default Relay.createContainer(mappedProjectInfo, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        name
      }
    `,
  },
})
