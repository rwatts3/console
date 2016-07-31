import * as React from 'react'
import * as Relay from 'react-relay'
import {
  Action,
  Project,
  ActionTriggerMutationModelMutationType,
  ActionTriggerType,
  ActionHandlerType,
} from '../../types/types'
import AddActionMutation from '../../mutations/AddActionMutation'
import UpdateActionMutation from '../../mutations/UpdateActionMutation'
const classes: any = require('./ActionRow.scss')

interface Props {
  action?: Action
  project: Project
  onSubmit?: () => void
}

interface State {
  triggerMutationModelMutationType: ActionTriggerMutationModelMutationType
  triggerMutationModelModelId: string
  triggerMutationModelFragment: string
  handlerWebhookUrl: string
  description: string
}

class ActionRow extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {
      triggerMutationModelMutationType: props.action ? props.action.triggerMutationModel.mutationType : 'CREATE',
      triggerMutationModelModelId: props.action
        ? props.action.triggerMutationModel.model.id
        : props.project.models.edges[0].node.id,
      triggerMutationModelFragment: props.action ? props.action.triggerMutationModel.fragment : '',
      handlerWebhookUrl: props.action ? props.action.handlerWebhook.url : '',
      description: props.action ? props.action.description : '',
    }
  }

  _submit () {
    if (this.props.action) {
      this._updateAction()
    } else {
      this._createAction()
    }
  }

  _createAction () {
    Relay.Store.commitUpdate(
      new AddActionMutation({
        projectId: this.props.project.id,
        isActive: true,
        description: '',
        triggerType: 'MUTATION_MODEL' as ActionTriggerType,
        handlerType: 'WEBHOOK' as ActionHandlerType,
        triggerMutationModel: {
          fragment: '',
          mutationType: this.state.triggerMutationModelMutationType,
          modelId: '',
        },
        handlerWebhook: {
          url: '',
        },
      }),
      {
        onSuccess: () => {
          this.props.onSubmit()
        },
      }
    )
  }

  _updateAction () {
    Relay.Store.commitUpdate(
      new UpdateActionMutation({
        actionId: this.props.action.id,
        isActive: this.state.isActive,
      })
    )
  }

  render () {

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
        <div className={classes.label}><div>Webhook</div></div>
      )
    }

    return (
      <div className={classes.root}>
        <input
          value={this.props.action.isActive}
          type='checkbox'
        />
        <div>When</div>
        {trigger}
        <div>run</div>
        {handler}
      </div>
    )
  }

  // render () {
  //   const buttonText = this.props.action ? 'Save' : 'Add'
  //
  //   return (
  //     <div className={classes.root}>
  //       <select
  //         value={this.state.triggerMutationModelModelId}
  //         onChange={(e) => {
  //           this.setState({ triggerMutationModelModelId: e.target.value } as State)
  //         }}
  //       >
  //         {this.props.project.models.edges.map((edge) => (
  //           <option
  //             value={edge.node.id}
  //             key={edge.node.id}
  //           >
  //             {edge.node.name}
  //           </option>
  //         ))}
  //       </select>
  //       <select
  //         value={this.state.triggerMutationModelMutationType}
  //         onChange={(e) => {
  //           this.setState({ triggerMutationModelMutationType: e.target.value } as State)
  //         }}
  //       >
  //         <option value='CREATE'>Create</option>
  //         <option value='UPDATE'>Update</option>
  //         <option value='DELETE'>Delete</option>
  //       </select>
  //       <textarea
  //         value={this.state.triggerMutationModelFragment}
  //         onChange={(e) => {
  //           this.setState({ triggerMutationModelFragment: e.target.value } as State)
  //         }}
  //       />
  //       <input
  //         type='text'
  //         placeholder='URL'
  //         value={this.state.handlerWebhookUrl}
  //         onChange={(e) => this.setState({ handlerWebhookUrl: e.target.value } as State)}
  //       />
  //       <input
  //         type='text'
  //         placeholder='Description'
  //         value={this.state.description}
  //         onChange={(e) => this.setState({ description: e.target.value } as State)}
  //       />
  //       <button onClick={this._submit.bind(this)}>{buttonText}</button>
  //     </div>
  //   )
  // }
}

export default Relay.createContainer(ActionRow, {
  fragments: {
    action: () => Relay.QL`
      fragment on Action {
        id
        triggerType
        handlerType
        triggerMutationModel {
          model {
            id
            name
          }
          mutationType
          fragment
        }
        handlerWebhook {
          url
        }
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        models(first: 1000) {
          edges {
            node {
              id
              name
            }
          }
        }
        relations(first: 1000) {
          edges {
            node {
              id
              modelA {
                id
                name
              }
              modelB {
                id
                name
              }
            }
          }
        }
      }
    `,
  },
})
