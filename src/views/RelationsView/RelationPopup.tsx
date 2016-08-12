import * as React from 'react'
import * as Relay from 'react-relay'
import Popup from '../../components/Popup/Popup'
import Icon from '../../components/Icon/Icon'
import ModelSelector from './ModelSelector'
import AddRelationMutation from '../../mutations/AddRelationMutation'
import {validateModelName, validateFieldName} from '../../utils/nameValidator'
import {classnames} from '../../utils/classnames'
import UpdateRelationMutation from '../../mutations/UpdateRelationMutation'
import {Relation} from '../../types/types'
import {ShowNotificationCallback} from '../../types/utils'
import {onFailureShowNotification} from '../../utils/relay'
import {Transaction} from 'react-relay'

const classes: any = require('./RelationPopup.scss')

interface Props {
  onCancel: () => void
  models: any
  projectId?: string
  create: boolean
  relation?: Relation
}

interface State {
  name: string
  description: string
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  leftModelId: string
  rightModelId: string
}

export default class RelationPopup extends React.Component<Props, State> {

  static contextTypes: React.ValidationMap<any> = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  refs: {
    [key: string]: any;
    input: HTMLInputElement
  }

  constructor(props: Props) {
    super(props)

    const {create, relation} = this.props

    this.state = {
      name: create ? '' : relation.name,
      description: create ? '' : relation.description,
      fieldOnLeftModelName: create ? '' : relation.fieldOnLeftModel.name,
      fieldOnRightModelName: create ? '' : relation.fieldOnRightModel.name,
      fieldOnLeftModelIsList: create ? false : relation.fieldOnLeftModel.isList,
      fieldOnRightModelIsList: create ? false : relation.fieldOnRightModel.isList,
      leftModelId: create ? null : relation.leftModel.id,
      rightModelId: create ? null : relation.rightModel.id,
    }
  }

  render(): JSX.Element {
    return (
      <Popup onClickOutside={this.props.onCancel} height={'60%'}>
        <div className={classes.root}>
          <div className={classes.header}>
            <div className={classes.name}>
              <input
                autoFocus={this.props.create}
                ref='input'
                type='text'
                placeholder='+ Add Relation Name'
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value } as State)}
              />
            </div>
            <div className={classes.description}>
              <input
                type='text'
                placeholder='+ Add Description'
                value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value } as State)}
              />
            </div>
          </div>
          <div className={classes.container}>
            <div className={classes.content}>
              <div className={classes.title}>
                Relation Schema
              </div>
              <div className={classes.settings}>
                <ModelSelector
                  isList={this.state.fieldOnRightModelIsList}
                  onListChange={
                    () => this.setState({fieldOnRightModelIsList: !this.state.fieldOnRightModelIsList} as State)
                  }
                  selectedModelId={this.state.leftModelId}
                  onModelChange={(id) => this.setState({leftModelId: id} as State)}
                  models={this.props.models}
                  fieldOnModelName={this.state.fieldOnLeftModelName}
                  onFieldNameChange={(name) => this.setState({fieldOnLeftModelName: name} as State)}
                />
                <span className={classes.iconContainer}>
                  <Icon
                    className={classes.icon}
                    width={18}
                    src={require('assets/new_icons/bidirectional.svg')}
                  />
                </span>
                <ModelSelector
                  isList={this.state.fieldOnLeftModelIsList}
                  onListChange={
                    () => this.setState({fieldOnLeftModelIsList: !this.state.fieldOnLeftModelIsList} as State)
                  }
                  selectedModelId={this.state.rightModelId}
                  onModelChange={(id) => this.setState({rightModelId: id} as State)}
                  models={this.props.models}
                  fieldOnModelName={this.state.fieldOnRightModelName}
                  onFieldNameChange={(name) => this.setState({fieldOnRightModelName: name} as State)}
                />
              </div>
            </div>
            <div className={classes.buttons}>
              <div onClick={this.props.onCancel}>
                Cancel
              </div>
              <div className={classnames(classes.submit, this.isValid() ? classes.valid : '')} onClick={this.submit}>
                {this.props.create ? 'Create' : 'Save'}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    )
  }

  private isValid = (): boolean => {
    const {name, fieldOnLeftModelName, fieldOnRightModelName, leftModelId, rightModelId} = this.state

    const nameIsValid = validateModelName(name)
    const fieldNamesAreValid = validateFieldName(fieldOnLeftModelName) && validateFieldName(fieldOnRightModelName)
    const modelsAreSelected = leftModelId !== null && rightModelId !== null

    return nameIsValid && fieldNamesAreValid && modelsAreSelected
  }

  private submit = (): void => {
    if (this.props.create) {
      this.create()
    } else {
      this.update()
    }
  }

  private create = (): void => {
    if (!this.isValid()) {
      return
    }

    if (this.props.projectId === null) {
      return
    }

    Relay.Store.commitUpdate(
      new AddRelationMutation({
        projectId: this.props.projectId,
        name: this.state.name,
        description: this.state.description === '' ? null : this.state.description,
        leftModelId: this.state.leftModelId,
        rightModelId: this.state.rightModelId,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.fieldOnLeftModelIsList,
        fieldOnRightModelIsList: this.state.fieldOnRightModelIsList,
      }),
      {
        onSuccess: this.props.onCancel,
        onFailure: (transaction: Transaction) => onFailureShowNotification(transaction, this.context.showNotification),
      }
    )
  }

  private update = (): void => {
    if (!this.isValid()) {
      return
    }

    if (this.props.relation === null) {
      return
    }

    Relay.Store.commitUpdate(
      new UpdateRelationMutation({
        relationId: this.props.relation.id,
        name: this.state.name,
        description: this.state.description === '' ? null : this.state.description,
        leftModelId: this.state.leftModelId,
        rightModelId: this.state.rightModelId,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.fieldOnLeftModelIsList,
        fieldOnRightModelIsList: this.state.fieldOnRightModelIsList,
      }),
      {
        onSuccess: this.props.onCancel,
        onFailure: (transaction: Transaction) => onFailureShowNotification(transaction, this.context.showNotification),
      }
    )
  }
}
