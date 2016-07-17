import * as React from 'react'
import * as Relay from 'react-relay'
import { Permission, UserType } from '../../../types/types'
import PermissionType from './PermissionType'
import Loading from '../../../components/Loading/Loading'
import AddPermissionMutation from '../../../mutations/AddPermissionMutation'
import UpdatePermissionMutation from '../../../mutations/UpdatePermissionMutation'
import DeletePermissionMutation from '../../../mutations/DeletePermissionMutation'
import Icon from '../../../components/Icon/Icon'
const classes: any = require('./PermissionRow.scss')

interface Props {
  fieldId: string
  permission?: Permission
  hide?: () => void
}

interface State {
  saving: boolean
  editing: boolean
  editDescription: boolean
  userType: UserType
  userPath: string
  userRole: string
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
        userPath: '',
        userRole: '',
        allowRead: false,
        allowCreate: false,
        allowUpdate: false,
        allowDelete: false,
        description: null,
      }

    this.state = {
      saving: false,
      editing: !props.permission,
      editDescription: false,
      userType: permission.userType,
      userPath: permission.userPath,
      userRole: permission.userRole,
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
    this.setState({ description: description } as State)
  }

  _beginEditing () {
    this.setState({ editing: true } as State)
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
        userRole: this.state.userRole,
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
        userRole: this.state.userRole,
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
      this.setState({
        editing: false,
        saving: false,
        editDescription: false,
        userType: this.props.permission.userType,
        userPath: this.props.permission.userPath,
        userRole: this.props.permission.userRole,
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
          defaultValue={this.state.description}
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
      return <Loading color='#B9B9C8' />
    }

    if (this.state.editing) {
      return (
        <div>
          <span onClick={() => this._save()}>Save</span>
          <span onClick={() => this._cancel()}>Cancel</span>
        </div>
      )
    }

    return (
      <div>
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
