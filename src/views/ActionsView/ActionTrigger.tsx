import * as React from 'react'
import * as Relay from 'react-relay'
import { classnames } from '../../utils/classnames'
import { Project, ActionTriggerMutationModelMutationType } from '../../types/types'
const classes = require('./ActionTrigger.scss')

interface Props {
  project: Project
  triggerMutationModelModelId: string
  triggerMutationModelMutationType: ActionTriggerMutationModelMutationType
  update: (obj: any) => void
}

class ActionTrigger extends React.Component<Props, {}> {

  render() {
    const modelSelected = !!this.props.triggerMutationModelModelId
    const mutationSelected = !!this.props.triggerMutationModelMutationType

    let triggerClass = classnames(classes.selector, classes.typeselector)
    if (mutationSelected) {
      triggerClass = classnames(triggerClass, this.getMutationClass())
    } else if (modelSelected) {
      triggerClass = classnames(triggerClass, classes.selecting)
    }

    return (
      <div>
        <select
          className={classnames(classes.selector, classes.modelselector)}
          value={this.props.triggerMutationModelModelId
            ? this.props.triggerMutationModelModelId
            : 'default value'}
          onChange={(e) => this.props.update({ triggerMutationModelModelId: e.target.value })}
        >
          <option value={'default value'} disabled>Select a Model/Relation...</option>
          {this.props.project.models.edges.map((edge) => (
            <option
              value={edge.node.id}
              key={edge.node.id}
            >
              {edge.node.name}
            </option>
          ))}
        </select>
        <select
          disabled={!modelSelected}
          className={triggerClass}
          value={this.props.triggerMutationModelMutationType
            ? this.props.triggerMutationModelMutationType
            : 'default value'}
          onChange={(e) => this.props.update({
            triggerMutationModelMutationType: e.target.value as ActionTriggerMutationModelMutationType,
          })}
        >
          <option value={'default value'} disabled>Select a Mutation...</option>
          <option value='CREATE'>is created</option>
          <option value='UPDATE'>is updated</option>
          <option value='DELETE'>is deleted</option>
        </select>
      </div>
    )
  }

  private getMutationClass() {
    switch (this.props.triggerMutationModelMutationType) {
      case 'CREATE':
        return classes.green
      case 'UPDATE':
        return classes.blue
      case 'DELETE':
        return classes.red
      default:
        return ''
    }
  }
}

export default Relay.createContainer(ActionTrigger, {
    fragments: {
      project: () => Relay.QL`
        fragment on Project {
          models (first: 1000) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `,
    },
  },
)
