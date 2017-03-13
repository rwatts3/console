import * as React from 'react'
import FieldItem from './FieldItem'
import {Field, Project, Model} from '../../../types/types'
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
import UpdateModelNameMutation from '../../../mutations/UpdateModelNameMutation'
import Loading from '../../../components/Loading/Loading'

interface State {
  modelName: string
  showError: boolean
  editing: boolean
  loading: boolean
}

interface Props {
  onRequestClose: () => void
  projectId: string
  model: Model
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
      modelName: props.model && props.model.name || '',
      showError: false,
      editing: Boolean(props.model),
      loading: false,
    }
  }
  render() {
    const {showError, editing, loading} = this.state

    return (
      <div className='add-type'>
        <style jsx>{`
          .add-type {
            @p: .mt16, .ml16, .mr16, .bgWhite, .br2, .relative;
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
          .loading {
            @p: .z2, .absolute, .top0, .left0, .bottom0, .right0, .bgWhite70, .flex, .itemsCenter, .justifyCenter;
          }
        `}</style>
        <div className='header'>
          {editing ? (
            <div className='badge update'>Update Type</div>
          ) : (
            <div className='badge'>New Type</div>
          )}
          <div className='input-wrapper'>
            <input
              type='text'
              className='name-input'
              placeholder='Choose a name...'
              autoFocus
              value={this.state.modelName}
              onChange={this.onModelNameChange}
              onKeyDown={this.handleKeyDown}
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
        {loading && (
          <div className='loading'>
            <Loading />
          </div>
        )}
      </div>
    )
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.save()
    }
  }

  private onModelNameChange = (e) => {
    this.setState({modelName: e.target.value} as State)
  }

  private save = () => {
    const {modelName, editing} = this.state
    if (modelName != null && !validateModelName(modelName)) {
      return this.setState({showError: true} as State)
    }

    this.setState({loading: true} as State, () => {
      if (editing) {
        this.editModel(modelName)
      } else {
        this.addModel(modelName)
      }
    })
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
            tracker.track(ConsoleEvents.Schema.Model.Popup.submitted({type: 'Create', name: modelName}))
            this.props.onRequestClose()
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
            this.setState({loading: false} as State)
          },
        },
      )
    }
  }

  private editModel = (modelName: string) => {
    Relay.Store.commitUpdate(
      new UpdateModelNameMutation({
        name: modelName,
        modelId: this.props.model.id,
      }),
      {
        onSuccess: () => {
          tracker.track(ConsoleEvents.Schema.Model.renamed({id: this.props.model.id}))
          this.props.onRequestClose()
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setState({loading: false} as State)
        },
      },
    )
  }
}

export default connect(
  state => ({gettingStartedState: state.gettingStarted.gettingStartedState}),
  {
    showNotification, nextStep, showDonePopup,
  },
)(AddType)
