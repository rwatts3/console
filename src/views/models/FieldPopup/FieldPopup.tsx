import * as React from 'react'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../../utils/modalStyle'
import FieldPopupHeader from './FieldPopupHeader'
import FieldPopupFooter from './FieldPopupFooter'
import {Field, FieldType, Constraint, ConstraintType} from '../../../types/types'
import {ConsoleEvents, MutationType, FieldPopupSource} from 'graphcool-metrics'
import BaseSettings from './BaseSettings'
import AdvancedSettings from './AdvancedSettings'
import Constraints from './Constraints'
import {emptyField, mockConstraints} from './constants'
import mapProps from 'map-props'
import {connect} from 'react-redux'
import * as Relay from 'react-relay'
import {withRouter} from 'react-router'
import {
  toggleIsList,
  updateName,
  updateDescription,
  updateTypeIdentifier,
  toggleIsRequired,
  updateDefaultValue,
  toggleIsUnique,
  removeConstraint,
  addConstraint,
  editConstraint,
  getMigrationUI,
  isValid,
  updateEnumValues,
  didChange,
  isBreaking, updateMigrationValue,
} from './FieldPopupState'
import {showNotification} from '../../../actions/notification'
import {
  showDonePopup,
  nextStep,
} from '../../../actions/gettingStarted'
import UpdateFieldMutation from '../../../mutations/UpdateFieldMutation'
import {valueToString, stringToValue} from '../../../utils/valueparser'
import AddFieldMutation from '../../../mutations/AddFieldMutation'
import {onFailureShowNotification} from '../../../utils/relay'
import {ShowNotificationCallback} from '../../../types/utils'
import DeleteFieldMutation from '../../../mutations/DeleteFieldMutation'
import Loading from '../../../components/Loading/Loading'
import {GettingStartedState} from '../../../types/gettingStarted'
import tracker from '../../../utils/metrics'

interface Props {
  field?: Field
  nodeCount: number
  params: any
  router: ReactRouter.InjectedRouter
  modelId: string
  projectId: string
  showNotification: ShowNotificationCallback
  showDonePopup: () => void
  gettingStartedState: GettingStartedState
  nextStep: any
}

export interface State {
  // field attributes
  field: Field

  // non-field attributes
  activeTabIndex: number
  create: boolean
  showErrors: boolean
  deletePopupVisible: boolean
  deleting: boolean // needed for breaking changes to not show up, when relay already got the optimistic response
  loading: boolean
}

export interface MigrationUIState {
  migrationOptional: boolean
  showMigration: boolean
}

class FieldPopup extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    const {field} = props

    if (field) {
      // if there's a field, just passthrough the field to the stateG
      if (field.isSystem) {
        this.props.router.goBack()
        this.props.showNotification({
          message: 'You cannot edit system fields',
          level: 'warning',
        })
      }
      this.state = {
        field: {
          ...field,
          // if null, put it to undefined
          defaultValue: field.defaultValue === null ? undefined : stringToValue(field.defaultValue, field),
        },

        activeTabIndex: 0,
        create: false,
        showErrors: false,
        deletePopupVisible: false,
        deleting: false,
        loading: false,
      }
    } else {
      this.state = {
        field: emptyField,

        activeTabIndex: 0,
        create: true,
        showErrors: false,
        deletePopupVisible: false,
        deleting: false,
        loading: false,
      }
    }
    global['f'] = this
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
    tracker.track(ConsoleEvents.Schema.Field.Popup.opened({
      type: this.state.create ? 'Create' : 'Update',
      source: 'databrowser',
    }))
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
    tracker.track(ConsoleEvents.Schema.Field.Popup.canceled({
      type: this.state.create ? 'Create' : 'Update',
    }))
  }

  componentDidUpdate() {
    if (this.state.field.name.toLowerCase() === 'imageUrl'.toLowerCase() &&
      this.props.gettingStartedState.isCurrentStep('STEP2_ENTER_FIELD_NAME_IMAGEURL')) {
      this.props.nextStep()
    }

    if (this.state.field.typeIdentifier === 'String' &&
      this.props.gettingStartedState.isCurrentStep('STEP2_SELECT_TYPE_IMAGEURL')) {
      this.props.nextStep()
    }
  }

  render() {
    const {
      field: {
        name,
        description,
        typeIdentifier,
        isRequired,
        isList,
        enumValues,
        defaultValue,
        migrationValue,
        isUnique,
        constraints,
      },

      showErrors,
      create,
      activeTabIndex,
      deletePopupVisible,
      deleting,
      loading,
    } = this.state

    const {nodeCount, projectId} = this.props

    const migrationUI = getMigrationUI(nodeCount, this.state.field, this.props.field)
    const errors = isValid(nodeCount, this.state.field, this.props.field)
    // if there is an error, it's not valid
    const valid = !Object.keys(errors).reduce((acc, curr) => acc || errors[curr], false)
    const changed = didChange(this.state.field, this.props.field)
    const breaking = isBreaking(this.state.field, this.props.field) && !deleting

    let modalStyling = fieldModalStyle
    if (breaking || deletePopupVisible) {
      modalStyling = {
        ...fieldModalStyle,
        content: {
          ...fieldModalStyle.content,
          marginBottom: '120px',
        },
      }
    }

    return (
      <Modal
        isOpen={true}
        onRequestClose={this.close}
        contentLabel='Field Popup'
        style={modalStyling}
      >
        <style jsx>{`
          .field-popup {
            @p: .bgWhite;
          }
          .popup-body {
            @p: .overflowXHidden;
            transition: .1s linear height;
            max-height: calc(100vh - 200px);
          }
          .loading {
            @p: .fixed, .top0, .left0, .right0, .bottom0, .bgWhite50, .flex, .justifyCenter, .itemsCenter;
          }
        `}</style>
        <div
          className='field-popup'
        >
          <FieldPopupHeader
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onSelectTab={this.handleSelectTab}
            onRequestClose={this.close}
            errors={errors}
            showErrors={showErrors}
            create={create}
          />
          <div
            className='popup-body'
          >
            {activeTabIndex === 0 ? (
                <BaseSettings
                  name={name}
                  typeIdentifier={typeIdentifier || ''}
                  description={description || ''}
                  isList={isList}
                  enumValues={enumValues}
                  onChangeName={this.updateField(updateName)}
                  onChangeDescription={this.updateField(updateDescription)}
                  onToggleIsList={this.updateField(toggleIsList)}
                  onChangeTypeIdentifier={this.updateField(updateTypeIdentifier)}
                  onChangeEnumValues={this.updateField(updateEnumValues)}
                  errors={errors}
                  showErrors={showErrors}
                  showNotification={this.props.showNotification}
                />
              ) : activeTabIndex === 1 ? (
                  <AdvancedSettings
                    isRequired={isRequired}
                    onToggleIsRequired={this.updateField(toggleIsRequired)}
                    defaultValue={defaultValue}
                    migrationValue={migrationValue}
                    onChangeDefaultValue={this.updateField(updateDefaultValue)}
                    onChangeMigrationValue={this.updateField(updateMigrationValue)}
                    showMigration={migrationUI.showMigration}
                    migrationOptional={migrationUI.migrationOptional}
                    showErrors={showErrors}
                    errors={errors}
                    projectId={projectId}
                    field={this.state.field}
                  />
                ) : activeTabIndex === 2 && (
                  <Constraints
                    isUnique={isUnique}
                    onToggleIsUnique={this.updateField(toggleIsUnique)}
                    constraints={constraints || []}
                    onRemoveConstraint={this.updateField(removeConstraint)}
                    onAddConstraint={this.updateField(addConstraint)}
                    onEditConstraint={this.updateField(editConstraint)}
                  />
                )}
          </div>
          <FieldPopupFooter
            create={create}
            valid={valid}
            activeTabIndex={activeTabIndex}
            tabs={tabs}
            onSelectIndex={this.handleSelectTab}
            onSubmit={this.handleSubmit}
            changed={changed}
            needsMigrationIndex={errors.migrationValueMissing ? 1 : -1}
            breaking={breaking}
            name={name}
            onReset={this.handleReset}
            onConfirmBreakingChanges={this.handleSubmit}
            onDelete={this.handleDelete}
            onDeletePopupVisibilityChange={this.handleDeletePopupVisibilityChange}
            onCancel={this.close}
            initialField={this.props.field}
            mutatedField={this.state.field}
          />
        </div>
        {loading && (
          <div className='loading'>
            <Loading />
          </div>
        )}
      </Modal>
    )
  }

  private onKeyDown = (e: any) => {
    if (e.keyCode === 27 && (e.target instanceof HTMLInputElement)) {
      this.close()
    }
    // if it is an input, only if it has the enter-event class
    if (e.keyCode === 13 && (
      e.target instanceof HTMLInputElement ? [].includes.call(e.target.classList, 'enter-event') : true)
    ) {
      this.handleSubmit()
    }
  }

  private handleDeletePopupVisibilityChange = (deletePopupVisible: boolean) => {
    this.setState({
      deletePopupVisible,
    } as State)
  }

  private handleDelete = () => {
    this.setState({deleting: true, loading: true} as State, () => {
      Relay.Store.commitUpdate(
        new DeleteFieldMutation({
          fieldId: this.state.field.id,
          modelId: this.props.modelId,
        }),
        {
          onSuccess: () => {
            this.close()
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
            // this.setState({loading: false} as State)
          },
        },
      )
    })
  }

  private handleReset = () => {
    this.setState({field: this.props.field || emptyField} as State)
  }

  private updateField = (fn: Function, done?: Function) => {
    return (...params) => {
      this.setState(
        ({field, ...state}) => {
          return {
            ...state,
            field: fn(field, ...params),
          }
        },
        () => {
          if (typeof done === 'function') {
            done()
          }
        },
      )
    }
  }

  private handleSelectTab = (activeTabIndex: number) => {
    if (!this.state.field.typeIdentifier && activeTabIndex === 1) {
      this.setState({
        showErrors: true,
      } as State)
      return
    }
    this.setState({
      activeTabIndex,
    } as State)
  }

  private handleSubmit = () => {
    const errors = isValid(this.props.nodeCount, this.state.field, this.props.field)
    // if there is an error, it's not valid
    const valid = !Object.keys(errors).reduce((acc, curr) => acc || errors[curr], false)
    tracker.track(ConsoleEvents.Schema.Field.Popup.submitted({type: this.state.create ? 'Create' : 'Update'}))

    if (!valid) {
      this.setState({
        showErrors: true,
      } as State)
    } else {
      if (this.state.create) {
        this.create()
      } else {
        this.update()
      }
    }
  }

  private patchDefaultAndMigrationValue(field: Field) {
    let patchedField = field

    if (typeof field.defaultValue !== 'undefined') {
      patchedField = {
        ...patchedField,
        defaultValue: field.defaultValue === null ? null : valueToString(field.defaultValue, field, true, true),
      }
    }

    if (typeof field.migrationValue !== 'undefined') {
      patchedField = {
        ...patchedField,
        migrationValue: field.migrationValue === null ? null : valueToString(field.migrationValue, field, true, true),
      }
    }

    return patchedField
  }

  private create() {
    const _create = () => {
      this.setState({loading: true} as State)

      const {modelId} = this.props
      const {field} = this.state

      let input: any = this.patchDefaultAndMigrationValue(field)
      // let input = field

      input = {
        ...input,
        modelId,
      }

      Relay.Store.commitUpdate(
        new AddFieldMutation(input),
        {
          onSuccess: () => {
            this.close()
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
            this.setState({loading: false} as State)
          },
        },
      )
    }

    if (this.props.gettingStartedState.isCurrentStep('STEP2_CLICK_CONFIRM_IMAGEURL')) {
      if (this.state.field.name.toLowerCase() === 'imageUrl'.toLowerCase()
        && this.state.field.typeIdentifier === 'String') {
        // correct the field name to imageUrl, because many people type in imageurl or imageURL and get stuck here
        // seconds argument of updateField is a callback which gets executed AFTER the state has been mutated
        // by setState
        this.updateField(updateName, () => {
          this.props.showDonePopup()
          this.props.nextStep()
          _create()
        })('imageUrl')
      } else {
        this.props.showNotification({
          level: 'warning',
          message: 'Make sure that the name is "imageUrl" and the type is "String".',
        })
        return
      }
    } else {
      if (this.props.gettingStartedState.isCurrentStep('STEP2_CREATE_FIELD_DESCRIPTION')) {
        if (this.state.field.name === 'description' && this.state.field.typeIdentifier === 'String') {
          this.props.showDonePopup()
          this.props.nextStep()
        } else {
          this.props.showNotification({
            level: 'warning',
            message: 'Make sure that the name is "description" and the type is "String".',
          })
          return
        }
      }
      _create()
    }

  }

  private update() {
    const {field} = this.state
    let updatedField: any = this.patchDefaultAndMigrationValue(field)
    // TODO: proper typing
    this.setState({loading: true} as State)

    Relay.Store.commitUpdate(
      new UpdateFieldMutation(updatedField),
      {
        onSuccess: () => {
          this.close()
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setState({loading: false} as State)
        },
      },
    )
  }

  private close = () => {
    this.props.router.goBack()
  }
}

const tabs = [
  'Base Settings',
  'Advanced Options',
  'Constraints',
]

const ReduxContainer = connect(
  state => ({
    gettingStartedState: state.gettingStarted.gettingStartedState,
    source: state.popupSources.fieldPopup,
  }),
  {
    nextStep, showDonePopup, showNotification,
  },
)(withRouter(FieldPopup))

const MappedFieldPopup = mapProps({
  params: props => props.params,
  field: props => props.viewer.field,
  nodeCount: props => props.viewer.model.itemCount,
  modelId: props => props.viewer.model.id,
  projectId: props => props.viewer.project.id,
})(ReduxContainer)

export default Relay.createContainer(MappedFieldPopup, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
    fieldName: null, // injected from router
    fieldExists: false,
  },
  prepareVariables: (prevVariables: any) => (Object.assign({}, prevVariables, {
    fieldExists: !!prevVariables.fieldName,
  })),
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          id
          itemCount
        }
        field: fieldByName(
          projectName: $projectName
          modelName: $modelName
          fieldName: $fieldName
        ) @include(if: $fieldExists) {
          id
          name
          typeIdentifier
          isRequired
          isList
          isUnique
          isSystem
          enumValues
          defaultValue
          relation {
            id
          }
          reverseRelationField {
            name
          }
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
