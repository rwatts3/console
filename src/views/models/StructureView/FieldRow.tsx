import * as React from 'react'
import * as Relay from 'react-relay'
import { Link } from 'react-router'
import Loading from '../../../components/Loading/Loading'
import UpdateFieldDescriptionMutation from '../../../mutations/UpdateFieldDescriptionMutation'
import DeleteFieldMutation from 'mutations/DeleteFieldMutation'
import { Field, Model } from '../../../types/types'
import Permissions from './Permissions'
import Constraints from './Constraints'
import Icon from '../../../components/Icon/Icon'
const classes: any = require('./FieldRow.scss')

type DetailsState = 'PERMISSIONS' | 'CONSTRAINTS' | null

interface Props {
  field: Field
  allModels: Model[]
  params: any
  model: Model
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
}

interface State {
  editDescription: boolean
  editDescriptionPending: boolean
  detailsState: DetailsState
}

class FieldRow extends React.Component<Props, State> {

  state = {
    editDescription: false,
    editDescriptionPending: false,
    detailsState: null,
  }

  _delete () {
    if (window.confirm(`Do you really want to delete "${this.props.field.name}"?`)) {
      Relay.Store.commitUpdate(
        new DeleteFieldMutation({
          fieldId: this.props.field.id,
          modelId: this.props.model.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/structure: deleted field', {
              project: this.props.params.projectName,
              model: this.props.params.modelName,
              field: this.props.field.name,
            })
          },
        }
      )
    }
  }

  _saveDescription (e) {
    const description = e.target.value
    if (this.props.field.description === description) {
      this.setState({ editDescription: false } as State)
      return
    }

    this.setState({ editDescriptionPending: true } as State)

    Relay.Store.commitUpdate(
      new UpdateFieldDescriptionMutation({
        fieldId: this.props.field.id,
        description,
      }),
      {
        onFailure: () => {
          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          } as State)
        },
        onSuccess: () => {
          analytics.track('models/structure: edited description')

          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          } as State)
        },
      }
    )
  }

  _togglePermissions () {
    const detailsState = this.state.detailsState === 'PERMISSIONS' ? null : 'PERMISSIONS' as DetailsState
    this.setState({ detailsState } as State)
  }

  _toggleConstraints () {
    const detailsState = this.state.detailsState === 'CONSTRAINTS' ? null : 'CONSTRAINTS' as DetailsState
    this.setState({ detailsState } as State)
  }

  _renderDescription () {
    if (this.state.editDescriptionPending) {
      return (
        <Loading color='#B9B9C8' />
      )
    }

    if (this.state.editDescription) {
      return (
        <input
          autoFocus
          type='text'
          placeholder='Description'
          defaultValue={this.props.field.description}
          onBlur={(e) => this._saveDescription(e)}
          onKeyDown={(e) => e.keyCode === 13 ? (e.target as HTMLInputElement).blur() : null}
        />
      )
    }

    if (!this.props.field.description) {
      return (
        <span
          className={classes.addDescription}
          onClick={() => this.setState({ editDescription: true } as State)}
        >
          Add description
        </span>
      )
    }

    return (
      <span
        className={classes.descriptionText}
        onClick={() => this.setState({ editDescription: true } as State)}
      >
        {this.props.field.description}
      </span>
    )
  }

  render () {
    const { field } = this.props

    let type = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    const editLink = `/${this.props.params.projectName}/models/${this.props.params.modelName}/structure/edit/${this.props.field.name}` // tslint:disable-line

    return (
      <div className={classes.root}>
        <div className={`${classes.row} ${this.state.detailsState ? classes.active : ''}`}>
          <Link className={classes.fieldName} to={editLink}>
            <span className={classes.name}>{field.name}</span>
            {field.isSystem &&
              <span className={classes.system}>System</span>
            }
          </Link>
          <Link className={classes.type} to={editLink}>
            <span>{type}</span>
          </Link>
          <div className={classes.description}>
            {this._renderDescription()}
          </div>
          <div
            className={`${classes.constraints} ${this.state.detailsState === 'CONSTRAINTS' ? classes.active : '' }`}
            onClick={() => this._toggleConstraints()}
          >
            {field.isUnique &&
              <span className={classes.label}>Unique</span>
            }
            {!field.isUnique &&
              <span className={`${classes.label} ${classes.add}`}>
                Add Constraint
              </span>
            }
          </div>
          <div
            className={`${classes.permissions} ${this.state.detailsState === 'PERMISSIONS' ? classes.active : '' }`}
            onClick={() => this._togglePermissions()}
          >
            {field.permissions.edges.length === 0 &&
              <span className={`${classes.label} ${classes.add}`}>
                Add Permission
              </span>
            }
            {field.permissions.edges.map((permissionEdge) => (
              <span
                key={permissionEdge.node.id}
                className={classes.label}
              >
                {permissionEdge.node.userType}
              </span>
            ))}
          </div>
          <div className={classes.controls}>
            <Link to={editLink}>
              <Icon
                width={20}
                height={20}
                src={require('assets/icons/edit.svg')}
              />
            </Link>
            {!field.isSystem &&
              <span onClick={() => this._delete()}>
                <Icon
                  width={20}
                  height={20}
                  src={require('assets/icons/delete.svg')}
                />
              </span>
            }
          </div>
        </div>
        {this.state.detailsState === 'PERMISSIONS' &&
          <Permissions
            field={field}
            params={this.props.params}
            possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
            availableUserRoles={this.props.availableUserRoles}
          />
        }
        {this.state.detailsState === 'CONSTRAINTS' &&
          <Constraints
            field={field}
          />
        }
      </div>
    )
  }
}

export default Relay.createContainer(FieldRow, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        name
        typeIdentifier
        isSystem
        isRequired
        isUnique
        isList
        description
        permissions(first: 100) {
          edges {
            node {
              id
              userType
            }
          }
        }
        ${Permissions.getFragment('field')}
      }
    `,
  },
})
