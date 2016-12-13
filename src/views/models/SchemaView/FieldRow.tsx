import * as React from 'react'
import * as Relay from 'react-relay'
import {Link} from 'react-router'
import Loading from '../../../components/Loading/Loading'
import UpdateFieldDescriptionMutation from '../../../mutations/UpdateFieldDescriptionMutation'
import DeleteFieldMutation from '../../../mutations/DeleteFieldMutation'
import {onFailureShowNotification} from '../../../utils/relay'
import {ShowNotificationCallback} from '../../../types/utils'
import {Field, Model} from '../../../types/types'
import Constraints from './Constraints'
import {isScalar} from '../../../utils/graphql'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import * as cx from 'classnames'
import {Icon, particles} from 'graphcool-styles'
const classes: any = require('./FieldRow.scss')
import {ConsoleEvents} from 'graphcool-metrics'
import tracker from '../../../utils/metrics'
import DeleteRelationMutation from '../../../mutations/DeleteRelationMutation'

type DetailsState = 'PERMISSIONS' | 'CONSTRAINTS'

interface Props {
  route: any
  field: Field
  allModels: Model[]
  params: any
  model: Model
  possibleRelatedPermissionPaths: Field[][]
  showNotification: ShowNotificationCallback
  projectId: string
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

  render() {
    const {field} = this.props

    if (!isScalar(field.typeIdentifier) && !field.relation) {
      return null
    }

    let type: string = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    let suffix
    if (isScalar(field.typeIdentifier)) {
      suffix = `/models/${this.props.params.modelName}/schema/edit/${this.props.field.name}`
    } else {
      suffix = `/relations/edit/${this.props.field.relation.name}`
    }

    const editLink = `/${this.props.params.projectName}${suffix}` // tslint:disable-line

    if (!isScalar(field.typeIdentifier) && !field.relatedModel) {
      return null
    }

    return (
      <div className={classes.root}>
        <div className={`${classes.row} ${this.state.detailsState ? classes.active : ''}`}>
          <Link className={classes.fieldName} to={editLink}>
            <span className={classes.name}>{field.name}</span>
            {field.isSystem &&
              <span className={classes.system}>System</span>
            }
            { !isScalar(field.typeIdentifier) &&
              <span className={classes.relation}>Relation</span>
            }
          </Link>
          <Link className={classes.type} to={editLink}>
            {!isScalar(field.typeIdentifier) ?
              (
                <span>
                  <div className={cx(particles.flex)}>
                    <Icon
                      className={cx(
                        particles.mr4,
                      )}
                      width={16}
                      height={16}
                      src={require('graphcool-styles/icons/stroke/link.svg')}
                    />
                    {field && field.relatedModel !== null && field.relatedModel.hasOwnProperty('name') && (
                      field.relatedModel.name
                    )}
                  </div>
                </span>
              )
              : (
                <span>{type}</span>
              )
            }
          </Link>
          <div className={classes.description}>
            {this.renderDescription()}
          </div>
          <div
            className={`${classes.constraints} ${this.state.detailsState === 'CONSTRAINTS' ? classes.active : '' }`}
            onClick={() => this.toggleConstraints()}
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
          <div className={classes.controls}>
            {(!field.isSystem || (field.isSystem && field.name === 'roles')) &&
            <Link to={editLink}>
              <Icon
                width={20}
                height={20}
                src={require('assets/icons/edit.svg')}
              />
            </Link>
            }
            {field.isSystem &&
            <Icon
              width={20}
              height={20}
              src={require('graphcool-styles/icons/stroke/lock.svg')}
            />
            }
            <span
              onClick={() => isScalar(field.typeIdentifier) ? this.deleteField() : this.deleteRelation()}
            >
                <Icon
                  width={20}
                  height={20}
                  src={require('assets/icons/delete.svg')}
                />
              </span>
          </div>
        </div>
        {this.state.detailsState === 'CONSTRAINTS' &&
        <Constraints
          field={field}
        />
        }
      </div>
    )
  }

  private deleteField() {
    if (window.confirm(`Do you really want to delete "${this.props.field.name}"?`)) {
      Relay.Store.commitUpdate(
        new DeleteFieldMutation({
          fieldId: this.props.field.id,
          modelId: this.props.model.id,
        }),
        {
          onSuccess: () => {
            tracker.track(ConsoleEvents.Schema.Field.Delete.completed({id: this.props.field.id}))
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        },
      )
    }
  }

  private deleteRelation() {
    if (window.confirm(`Do you really want to delete the relation "${this.props.field.relation.name}"?`)) {
      const {projectId} = this.props
      Relay.Store.commitUpdate(
        new DeleteRelationMutation({
          relationId: this.props.field.relation.id,
          projectId,
          leftModelId: this.props.field.model.id,
          rightModelId: this.props.field.relatedModel.id,
        }),
        {
          onSuccess: () => {
            tracker.track(ConsoleEvents.Relations.deleted())
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        },
      )
    }
  }

  private saveDescription(e) {
    const description = e.target.value
    if (this.props.field.description === description) {
      this.setState({editDescription: false} as State)
      return
    }

    this.setState({editDescriptionPending: true} as State)

    Relay.Store.commitUpdate(
      new UpdateFieldDescriptionMutation({
        fieldId: this.props.field.id,
        description,
      }),
      {
        onSuccess: () => {
          tracker.track(ConsoleEvents.Schema.Field.Description.changed())

          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          } as State)
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          } as State)
        },
      },
    )
  }

  private togglePermissions() {
    const detailsState = this.state.detailsState === 'PERMISSIONS' ? null : 'PERMISSIONS' as DetailsState
    this.setState({detailsState} as State)
  }

  private toggleConstraints() {
    const detailsState = this.state.detailsState === 'CONSTRAINTS' ? null : 'CONSTRAINTS' as DetailsState
    this.setState({detailsState} as State)
  }

  private renderDescription() {
    if (this.props.field.relation) {
      return
    }
    if (this.state.editDescriptionPending) {
      return (
        <Loading color='#B9B9C8'/>
      )
    }

    if (this.state.editDescription) {
      return (
        <input
          autoFocus
          type='text'
          placeholder='Description'
          defaultValue={this.props.field.description}
          onBlur={(e) => this.saveDescription(e)}
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

}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedFieldRow = connect(null, mapDispatchToProps)(FieldRow)

export default Relay.createContainer(MappedFieldRow, {
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
        model {
          id
        }
        relatedModel {
          id
          name
        }
        relation {
          id
          name
        }
      }
    `,
  },
})
