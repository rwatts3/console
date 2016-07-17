import * as React from 'react'
import { UserType } from '../../../types/types'
const classes: any = require('./PermissionType.scss')

interface Props {
  className?: string
  dataCallback?: (data: any) => void
  userType: UserType
  userPath?: string
}

interface State {
  userType: UserType
  userPath?: string
}

export default class PermissionType extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {
      userType: props.userType,
      userPath: props.userPath,
    }
  }

  _onChangeUserType (userType: UserType) {
    this.setState({ userType }, () => {
      this.props.dataCallback(this.state)
    })
  }

  _renderAuthenticated () {
    return (
      <div>
        <input type='checkbox' />
        Limit to
        <select>
          <option value='GUEST'>Admin</option>
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
