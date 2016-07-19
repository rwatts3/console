import * as React from 'react'
import { UserType, Field } from '../../../types/types'
import Icon from '../../../components/Icon/Icon'
const calculateSize: any = require('calculate-size')
const classes: any = require('./PermissionType.scss')

interface Props {
  params: any
  dataCallback?: (data: State) => void
  userType: UserType
  userPath: string[]
  userRole: string
  useUserRole: boolean
  availableUserRoles: string[]
  possibleRelatedPermissionPaths: Field[][]
}

interface State {
  userType: UserType
  userPath: string[]
  isValid: boolean
  userRole: string
  useUserRole: boolean
}

const emptyRoleToken = '____EMPTY_ROLE_TOKEN'
const addRoleToken = '____ADD_ROLE_TOKEN'
const emptyStepToken = '____EMPTY_STEP_TOKEN'

export default class PermissionType extends React.Component<Props, State> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const userPath = props.userType === 'RELATED' ? (props.userPath || []) : null

    this.state = {
      userPath,
      userType: props.userType,
      isValid: this._isValid(userPath),
      userRole: props.userRole,
      useUserRole: props.useUserRole,
    }
  }

  componentWillReceiveProps (props) {
    const userPath = props.userType === 'RELATED' ? (props.userPath || []) : null

    this.setState({
      userPath,
      userType: props.userType,
      isValid: this._isValid(userPath),
      userRole: props.userRole,
      useUserRole: props.useUserRole,
    })
  }

  _onChangeUserType (userType: UserType) {
    this.setState(
      {
        userType,
        userPath: userType === 'RELATED' ? (this.state.userPath || []) : null,
      } as State,
      this._dataCallback
    )
  }

  _onChangeUserRole (userRole: string) {
    if (userRole === addRoleToken) {
      (this.context as any).router.push(`/${this.props.params.projectName}/models/User/structure/edit/roles`)

      return
    }
    this.setState({ userRole, useUserRole: true } as State, this._dataCallback)
  }

  _isValid (userPath: string[]): boolean {
    return this.props.possibleRelatedPermissionPaths.findIndex((arr) => arr.map((f) => f.id).equals(userPath)) > -1
  }

  _updateUserPath (level: number, stepValue: string) {
    const newUserPath = this.state.userPath.slice(0, level)
    newUserPath.push(stepValue)
    this.setState(
      {
        userPath: newUserPath,
        isValid: this._isValid(newUserPath),
      } as State,
      this._dataCallback
    )
  }

  _resetUserPath (level: number) {
    const newUserPath = this.state.userPath.slice(0, level)
    this.setState(
      {
        userPath: newUserPath,
        isValid: this._isValid(newUserPath),
      } as State,
      this._dataCallback
    )
  }

  _disableUserRole () {
    this.setState({ useUserRole: false, userRole: null } as State, this._dataCallback)
  }

  _dataCallback () {
    this.props.dataCallback(this.state)
  }

  _renderAuthenticated () {
    const fontOptions = {
      font: 'Open Sans',
      fontSize: '13px',
    }

    const selectedText = this.state.userRole || 'Select Role...'
    const selectWidth = calculateSize(selectedText, fontOptions).width

    return (
      <div className={`${classes.authenticated} ${this.state.useUserRole ? '' : classes.inactive}`}>
        <span>Limit to</span>
        <select
          style={{ width: selectWidth }}
          value={this.state.userRole || emptyRoleToken}
          onChange={(e) => this._onChangeUserRole((e.target as HTMLInputElement).value)}
        >
          <option disabled value={emptyRoleToken}>Select Role...</option>
          {this.props.availableUserRoles.map((userRole) => (
            <option key={userRole} value={userRole}>{userRole}</option>
          ))}
          <optgroup label='Actions'>
            <option value={addRoleToken}>Create a new role...</option>
          </optgroup>
        </select>
        {this.state.useUserRole &&
          <div className={classes.delete} onClick={() => this._disableUserRole()}>
            <Icon
              width={15}
              height={15}
              src={require('assets/icons/close.svg')}
            />
          </div>
        }
      </div>
    )
  }

  _renderRelatedLevel (level: number) {
    const fields = this.props.possibleRelatedPermissionPaths
      .filter((arr) => arr.slice(0, level).map((f) => f.id).equals(this.state.userPath.slice(0, level)))
      .filter((arr) => arr.length - 1 >= level)
      .map((arr) => arr[level])
      .filter((item, index, arr) => arr.findIndex((i) => i.id === item.id) === index)

    const isOptional = this.state.isValid
      && this.state.userPath.length === level
    const addText = isOptional ? 'Add Step...' : 'Select Field...'
    const hasBeenSelected = this.state.userPath.length > level
    const selectedValue = hasBeenSelected
      ? this.state.userPath[level]
      : emptyStepToken
    const selectedText = hasBeenSelected
      ? fields.find((f) => f.id === this.state.userPath[level]).name
      : addText

    const fontWeight = hasBeenSelected ? 400 : 600
    const fontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
      fontWeight,
    }

    const width = calculateSize(selectedText, fontOptions).width

    return (
      <div className={classes.relatedStep}>
        <select
          style={{ width, fontWeight }}
          value={selectedValue}
          className={isOptional ? classes.isOptional : ''}
          onChange={(e) => this._updateUserPath(level, (e.target as HTMLInputElement).value)}
        >
          <option disabled value={emptyStepToken}>{addText}</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>{field.name}: {field.typeIdentifier}</option>
          ))}
        </select>
        {selectedValue !== emptyStepToken &&
          <div className={classes.relatedDelete} onClick={() => this._resetUserPath(level)}>
            <Icon
              width={15}
              height={15}
              src={require('assets/icons/close.svg')}
            />
          </div>
        }
      </div>
    )
  }

  _renderRelated () {
    const currentDepth = this.state.userPath.length
    const arrow = (
      <Icon
        width={11}
        height={6}
        src={require('assets/icons/arrow.svg')}
        color='#B9B9C8'
        rotate={-90}
      />
    )

    return (
      <div className={`${classes.related} ${this.state.isValid ? '' : classes.incomplete}`}>
        {this._renderRelatedLevel(0)}
        {currentDepth >= 1 && arrow}
        {currentDepth >= 1 && this._renderRelatedLevel(1)}
        {currentDepth >= 2 && arrow}
        {currentDepth >= 2 && this._renderRelatedLevel(2)}
        {!this.state.isValid &&
          <div className={classes.warning}>
            <Icon
              width={4}
              height={16}
              src={require('assets/icons/warning.svg')}
              />
          </div>
        }
      </div>
    )
  }

  render () {
    return (
      <div className={classes.root}>
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
