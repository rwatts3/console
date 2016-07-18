import * as React from 'react'
import { UserType } from '../../../types/types'
const classes: any = require('./PermissionType.scss')

interface Props {
  className?: string
  dataCallback?: (data: State) => void
  userType: UserType
  userPath: string
  userRole: string
  useUserRole: boolean
  availableUserRoles: string[]
}

interface State {
  userType: UserType
  userPath: string
  userRole: string
  useUserRole: boolean
}

export default class PermissionType extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {
      userType: props.userType,
      userPath: props.userPath,
      userRole: props.userRole,
      useUserRole: props.useUserRole,
    }
  }

  componentWillReceiveProps (props) {
    this.setState({
      userType: props.userType,
      userPath: props.userPath,
      userRole: props.userRole,
      useUserRole: props.useUserRole,
    })
  }

  _onChangeUserType (userType: UserType) {
    this.setState({ userType } as State, this._dataCallback)
  }

  _onChangeUserRole (userRole: string) {
    this.setState({ userRole, useUserRole: true } as State, this._dataCallback)
  }

  _toggleUseUserRole () {
    const useUserRole = !this.state.useUserRole
    const userRole = useUserRole && !this.state.userRole ? this.props.availableUserRoles[0] : this.state.userRole
    this.setState({ useUserRole, userRole } as State, this._dataCallback)
  }

  _dataCallback () {
    this.props.dataCallback(this.state)
  }

  _renderAuthenticated () {
    const emptyRoleToken = {}
    return (
      <div className={`${classes.authenticated} ${this.state.useUserRole ? '' : classes.inactive}`}>
        <input
          checked={this.state.useUserRole}
          onChange={() => this._toggleUseUserRole()}
          type='checkbox'
        />
        <span onClick={() => this._toggleUseUserRole()}>Limit to</span>
        <select
          value={this.state.userRole || emptyRoleToken}
          onChange={(e) => this._onChangeUserRole((e.target as HTMLInputElement).value)}
        >
          <option disabled value={emptyRoleToken}>Select Role...</option>
          {this.props.availableUserRoles.map((userRole) => (
            <option key={userRole} value={userRole}>{userRole}</option>
          ))}
        </select>
      </div>
    )
  }

  _renderRelated () {
    return (
      <div>
        <input type='text' placeholder='Path to field' />
      </div>
    )
  }

  render () {
    return (
      <div className={`${classes.root} ${this.props.className}`}>
        <div className={classes.container}>
          <select
            className={classes.userType}
            onChange={(e) => this._onChangeUserType((e.target as HTMLInputElement).value as UserType)}
            value={this.state.userType}
          >
            <option value='GUEST'>Guest</option>
            <option value='AUTHENTICATED'>Authenticated</option>
            <option value='RELATED'>Related</option>
          </select>
          {this.state.userType === 'AUTHENTICATED' && this._renderAuthenticated()}
          {this.state.userType === 'RELATED' && this._renderRelated()}
        </div>
      </div>
    )
  }
}
