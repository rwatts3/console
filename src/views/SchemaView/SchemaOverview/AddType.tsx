import * as React from 'react'
import FieldItem from './FieldItem'
import {Field, Project} from '../../../types/types'
import * as Relay from 'react-relay'
import {connect} from 'react-redux'
import {showDonePopup, nextStep} from '../../../actions/gettingStarted'
import {showNotification} from '../../../actions/notification'
import {ShowNotificationCallback} from '../../../types/utils'
import {GettingStartedState} from '../../../types/gettingStarted'
import {validateModelName} from '../../../utils/nameValidator'
import {onFailureShowNotification} from '../../../utils/relay'
import tracker from '../../../utils/metrics'
import AddModelMutation from '../../../mutations/AddModelMutation'
import {ConsoleEvents} from 'graphcool-metrics'

interface State {
  modelName: string
  showError: boolean
}

interface Props {
  onRequestClose: () => void
  projectId: string
  // injected by redux
  showNotification: ShowNotificationCallback
  showDonePopup: () => void
  nextStep: () => Promise<any>
  gettingStartedState: GettingStartedState
}

const idField = {
  'id': 'dummy',
  'name': 'id',
  'typeIdentifier': 'GraphQLID',
  'isList': false,
  'isRequired': true,
  'isSystem': true,
  'isUnique': true,
  'isReadonly': true,
  'relation': null,
  'relatedModel': null,
}

class AddType extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      modelName: '',
      showError: false,
    }
  }
  render() {
    const {showError} = this.state
    return (
      <div className='add-type'>
        <style jsx>{`
          .add-type {
            @p: .mt16, .ml16, .mr16, .bgWhite, .br2;
            box-shadow: 0 1px 10px $gray30;
          }
          .header {
            @p: .pv16, .flex, .itemsCenter, .bb, .bBlack10, .nowrap;
          }
          .badge {
            @p: .bgGreen, .white, .relative, .f12, .fw6, .ttu, .top0, .br2;
            padding: 2px 4px;
            left: -4px;
          }
          .badge.update {
            @p: .bgBlue;
          }
          .input-wrapper {
            @p: .flexAuto;
          }
          .name-input {
            @p: .blue, .f20, .fw6, .ml10;
            width: calc(100% - 20px);
            line-height: 1.3;
            letter-spacing: 0.53px;
          }
          .fields {
            @p: .w100;
          }
          .footer {
            @p: .flex, .justifyBetween, .bgBlack04, .pa16, .bt, .bBlack10;
          }
          .button {
            @p: .f14, .pointer, .br2;
            padding: 2px 9px 3px 9px;
          }
          .button.save {
            @p: .bgGreen, .white;
          }
          .button.cancel {
            @p: .black60;
          }
          .error {
            @p: .orange, .f14, .ml10;
          }
        `}</style>
        <div className='header'>
          <div className='badge'>New Type</div>
          <div className='input-wrapper'>
            <input
              type='text'
              className='name-input'
              placeholder='Choose a name...'
              autoFocus
              value={this.state.modelName}
              onChange={this.onModelNameChange}
            />
            {showError && (
              <div className='error'>
                Models must begin with an uppercase letter and only contain letters and numbers
              </div>
            )}
          </div>
        </div>
        <div className='fields'>
           <FieldItem
             key={idField.id}
             field={idField as Field}
             permissions={[]}
             hideBorder={true}
             create
          />
        </div>
        <div className='footer'>
          <div className='button cancel' onClick={this.props.onRequestClose}>Cancel</div>
          <div className='button save' onClick={this.save}>Save</div>
        </div>
      </div>
    )
  }

  private onModelNameChange = (e) => {
    this.setState({modelName: e.target.value} as State)
  }

  private save = () => {
    const {modelName} = this.state
    if (modelName != null && !validateModelName(modelName)) {
      this.setState({showError: true} as State)
      return
    }

    this.addModel(modelName)
    this.props.onRequestClose()
    tracker.track(ConsoleEvents.Schema.Model.Popup.submitted({type: 'Create', name: modelName}))
  }

  private addModel = (modelName: string) => {
    if (modelName) {
      Relay.Store.commitUpdate(
        new AddModelMutation({
          modelName,
          projectId: this.props.projectId,
        }),
        {
          onSuccess: () => {
            tracker.track(ConsoleEvents.Schema.Model.created({modelName}))
            if (
              modelName === 'Post' &&
              this.props.gettingStartedState.isCurrentStep('STEP1_CREATE_POST_MODEL')
            ) {
              this.props.showDonePopup()
              this.props.nextStep()
            }
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        },
      )
    }
  }
}

export default connect(
  state => ({gettingStartedState: state.gettingStarted.gettingStartedState}),
  {
    showNotification, nextStep, showDonePopup,
  },
)(AddType)
