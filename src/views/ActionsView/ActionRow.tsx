import * as React from 'react'
import * as Relay from 'react-relay'
import Toggle from 'react-toggle-button'
import { Action } from '../../types/types'
import Icon from '../../components/Icon/Icon'
import UpdateActionMutation from '../../mutations/UpdateActionMutation'
import DeleteActionMutation from '../../mutations/DeleteActionMutation'
const classes: any = require('./ActionRow.scss')

interface Props {
  action: Action
  projectId: string
  onClick: (e: React.MouseEvent<any>) => void
}

interface State {
  mouseOverToggle: boolean
}

class ActionRow extends React.Component<Props, State> {

  constructor() {
    super()
    this.state = {
      mouseOverToggle: false,
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
      <div className={classes.root} onClick={this.rootClick}>
        <div className={classes.row}>
          <div
            onMouseEnter={() => this.setState({mouseOverToggle: true})}
            onMouseLeave={() => this.setState({mouseOverToggle: false})}
          >
            <Toggle
              value={this.props.action.isActive}
              onClick={this.toggleIsActive}
            />
          </div>
          <div>When</div>
          {trigger}
          <div>run</div>
          {handler}

          <span onClick={this.deleteAction} className={classes.delete}>
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

  private rootClick = (e: React.MouseEvent<any>) => {
    if (!this.state.mouseOverToggle) {
      this.props.onClick(e)
    }
  }

  private toggleIsActive = (e: any) => {
    Relay.Store.commitUpdate(
      new UpdateActionMutation({
        actionId: this.props.action.id,
        isActive: !this.props.action.isActive,
      })
    )
  }

  private deleteAction = (e: React.MouseEvent<any>) => {
    e.stopPropagation()

    if (window.confirm('Do you really want to delete this Action?')) {
      Relay.Store.commitUpdate(
        new DeleteActionMutation({
          actionId: this.props.action.id,
          projectId: this.props.projectId,
        })
      )
    }
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
        isActive
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
