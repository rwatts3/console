import * as React from 'react'
import * as Relay from 'react-relay'
import { Action } from '../../types/types'
import Icon from '../../components/Icon/Icon'
import UpdateActionMutation from '../../mutations/UpdateActionMutation'
import DeleteActionMutation from '../../mutations/DeleteActionMutation'
const classes: any = require('./ActionRow.scss')

interface Props {
  action: Action
  projectId: string
}

class ActionRow extends React.Component<Props, {}> {

  _toggleIsActive = () => {
    Relay.Store.commitUpdate(
      new UpdateActionMutation({
        actionId: this.props.action.id,
        isActive: !this.props.action.isActive,
      })
    )
  }

  _delete = () => {
    if (window.confirm('Do you really want to delete this Action?')) {
      Relay.Store.commitUpdate(
        new DeleteActionMutation({
          actionId: this.props.action.id,
          projectId: this.props.projectId,
        })
      )
    }
  }

  render() {

    let trigger
    if (this.props.action.triggerType === 'MUTATION_MODEL') {
      const verb = {
        'CREATE': 'created',
        'UPDATE': 'updated',
        'DELETE': 'deleted',
      }[this.props.action.triggerMutationModel.mutationType]

      const color = {
        'CREATE': 'green',
        'UPDATE': 'blue',
        'DELETE': 'red',
      }[this.props.action.triggerMutationModel.mutationType]

      trigger = (
        <div>
          <div className={classes.label}>
            <div>{this.props.action.triggerMutationModel.model.name}</div>
            <div className={classes[color]}>is {verb}</div>
          </div>
        </div>
      )
    }

    let handler
    if (this.props.action.handlerType === 'WEBHOOK') {
      handler = (
        <div className={classes.label}>
          <div>Webhook</div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <input
            value={this.props.action.isActive}
            onChange={this._toggleIsActive}
            type='checkbox'
          />
          <div>When</div>
          {trigger}
          <div>run</div>
          {handler}

          <span onClick={this._delete} className={classes.delete}>
            <Icon
              width={20}
              height={20}
              src={require('assets/icons/delete.svg')}
            />
          </span>
        </div>
        {this.props.action.description &&
          <div className={classes.description}>{this.props.action.description}</div>
        }
      </div>
    )
  }
}

export default Relay.createContainer(ActionRow, {
  fragments: {
    action: () => Relay.QL`
      fragment on Action {
        id
        triggerType
        handlerType
        description
        triggerMutationModel {
          model {
            name
          }
          mutationType
        }
      }
    `,
  },
})
