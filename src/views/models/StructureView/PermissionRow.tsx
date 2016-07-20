import * as React from 'react'
import * as Relay from 'react-relay'
import { Permission, UserType, Field } from '../../../types/types'
import { DataCallbackProps } from './PermissionType'
import PermissionType from './PermissionType'
import Loading from '../../../components/Loading/Loading'
import AddPermissionMutation from '../../../mutations/AddPermissionMutation'
import UpdatePermissionMutation from '../../../mutations/UpdatePermissionMutation'
import DeletePermissionMutation from '../../../mutations/DeletePermissionMutation'
import Icon from '../../../components/Icon/Icon'
const classes: any = require('./PermissionRow.scss')

interface Props {
  params: any
  fieldId: string
  permission?: Permission
  hide?: () => void
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
}

interface State {
  saving: boolean
  editing: boolean
  isValid: boolean
  editDescription: boolean
  userType: UserType
  userPath: string[]
  userRole: string
  useUserRole: boolean
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
  description: string
}

class PermissionRow extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)

    const permission = props.permission || {
        userType: 'GUEST' as UserType,
        userPath: null,
        userRole: null,
        allowRead: false,
        allowCreate: false,
        allowUpdate: false,
        allowDelete: false,
        description: null,
      }

    const userPath = permission.userType === 'RELATED' ? (permission.userPath || []) : null

    this.state = {
      saving: false,
      editing: !props.permission,
      isValid: this._isValid(permission.userType, userPath),
      editDescription: false,
      userType: permission.userType,
      userPath,
      userRole: permission.userRole,
      useUserRole: !!permission.userRole,
      allowRead: permission.allowRead,
      allowCreate: permission.allowCreate,
      allowUpdate: permission.allowUpdate,
      allowDelete: permission.allowDelete,
      description: permission.description,
    }
  }

  _toggleAllowRead () {
    this._beginEditing()
    this.setState({ allowRead: !this.state.allowRead } as State)
  }

  _toggleAllowCreate () {
    this._beginEditing()
    this.setState({ allowCreate: !this.state.allowCreate } as State)
  }

  _toggleAllowUpdate () {
    this._beginEditing()
    this.setState({ allowUpdate: !this.state.allowUpdate } as State)
  }

  _toggleAllowDelete () {
    this._beginEditing()
    this.setState({ allowDelete: !this.state.allowDelete } as State)
  }

  _updateDescription (description: string) {
    this._beginEditing()
    this.setState({
      editDescription: true,
      description: description,
    } as State)
  }

  _beginEditing () {
    this.setState({ editing: true } as State)
  }

  _onPermissionTypeDataCallback (data: DataCallbackProps) {
    let partialState = Object.assign({ editing: true }, data) as State

    if (data.hasOwnProperty('userPath')) {
      partialState.isValid = this._isValid(data.userType, data.userPath)
    }

    this.setState(partialState)
  }

  _isValid (userType: UserType, userPath: string[]): boolean {
    return userType !== 'RELATED' ||
      this.props.possibleRelatedPermissionPaths.findIndex((arr) => arr.map((f) => f.id).equals(userPath)) > -1
  }

  _save () {
    this.setState({ saving: true } as State)

    if (this.props.permission) {
      this._update()
    } else {
      this._create()
    }
  }

  _create () {
    Relay.Store.commitUpdate(
      new AddPermissionMutation({
        fieldId: this.props.fieldId,
        userType: this.state.userType,
        userPath: this.state.userPath,
        userRole: this.state.useUserRole ? this.state.userRole : null,
        description: this.state.description,
        allowRead: this.state.allowRead,
        allowCreate: this.state.allowCreate,
        allowUpdate: this.state.allowUpdate,
        allowDelete: this.state.allowDelete,
      }),
      {
        onSuccess: () => {
          this.setState({
            editing: false,
            saving: false,
          } as State)

          this.props.hide()
        },
      }
    )
  }

  _update () {
    Relay.Store.commitUpdate(
      new UpdatePermissionMutation({
        permissionId: this.props.permission.id,
        userType: this.state.userType,
        userPath: this.state.userPath,
        userRole: this.state.useUserRole ? this.state.userRole : null,
        description: this.state.description,
        allowRead: this.state.allowRead,
        allowCreate: this.state.allowCreate,
        allowUpdate: this.state.allowUpdate,
        allowDelete: this.state.allowDelete,
      }),
      {
        onSuccess: () => {
          this.setState({
            editing: false,
            saving: false,
          } as State)
        },
      }
    )
  }

  _cancel () {
    if (this.props.hide) {
      this.props.hide()
    }

    if (this.props.permission) {
      const userPath = this.props.permission.userType === 'RELATED' ? (this.props.permission.userPath || []) : null

      this.setState({
        editing: false,
        saving: false,
        isValid: this._isValid(this.props.permission.userType, userPath),
        editDescription: false,
        userType: this.props.permission.userType,
        userPath,
        userRole: this.props.permission.userRole,
        useUserRole: !!this.props.permission.userRole,
        allowRead: this.props.permission.allowRead,
        allowCreate: this.props.permission.allowCreate,
        allowUpdate: this.props.permission.allowUpdate,
        allowDelete: this.props.permission.allowDelete,
        description: this.props.permission.description,
      })
    }
  }

  _delete () {
    if (window.confirm('Do you really want to delete this permission')) {
      Relay.Store.commitUpdate(
        new DeletePermissionMutation({
          fieldId: this.props.fieldId,
          permissionId: this.props.permission.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/fields: deleted permission')
          },
        }
      )
    }
  }

  _onKeyDown (e: __React.KeyboardEvent) {
    if (e.keyCode === 13) {
      (e.target as HTMLInputElement).blur()
      this._save()
    }
  }

  _renderDescription () {
    if (this.state.description || this.state.editDescription) {
      return (
        <input
          autoFocus={this.state.editDescription}
          type='text'
          placeholder='Description'
          value={this.state.description}
          onChange={(e) => this._updateDescription((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => this._onKeyDown(e)}
          />
        )
      }

    return (
      <span
        className={classes.addDescription}
        onClick={() => this.setState({ editDescription: true } as State)}
      >
        Add description
      </span>
    )
  }

  _renderControls () {
    if (this.state.saving) {
      return (
        <div className={classes.controls}>
          <Loading color='#B9B9C8' />
        </div>
      )
    }

    if (this.state.editing) {
      return (
        <div className={classes.controls}>
          {this.state.isValid &&
            <span onClick={() => this._save()}>Save</span>
          }
          <span onClick={() => this._cancel()}>Cancel</span>
        </div>
      )
    }

    return (
      <div className={classes.controls}>
        <span className={classes.delete} onClick={() => this._delete()}>
          <Icon
            width={20}
            height={20}
            src={require('assets/icons/delete.svg')}
          />
        </span>
      </div>
    )
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.permissionType}>
          <PermissionType
            userType={this.state.userType}
            userPath={this.state.userPath}
            userRole={this.state.userRole}
            isValid={this.state.isValid}
            useUserRole={this.state.useUserRole}
            dataCallback={(data) => this._onPermissionTypeDataCallback(data)}
            possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
            availableUserRoles={this.props.availableUserRoles}
            params={this.props.params}
          />
        </div>
        <div className={classes.allow}>
          <div>
            <input
              onChange={() => this._toggleAllowRead()}
              checked={this.state.allowRead}
              type='checkbox'
            />
          </div>
          <div>
            <input
              onChange={() => this._toggleAllowCreate()}
              checked={this.state.allowCreate}
              type='checkbox'
            />
          </div>
          <div>
            <input
              onChange={() => this._toggleAllowUpdate()}
              checked={this.state.allowUpdate}
              type='checkbox'
            />
          </div>
          <div>
            <input
              onChange={() => this._toggleAllowDelete()}
              checked={this.state.allowDelete}
              type='checkbox'
            />
          </div>
        </div>
        <div className={classes.description}>{this._renderDescription()}</div>
        <div className={classes.controls}>{this._renderControls()}</div>
      </div>
    )
  }
}

export default Relay.createContainer(PermissionRow, {
  fragments: {
    permission: () => Relay.QL`
      fragment on Permission {
        id
        userType
        userPath
        userRole
        description
        allowRead
        allowCreate
        allowUpdate
        allowDelete
      }
    `,
  },
})
