import * as React from 'react'
import * as Relay from 'react-relay'
import { Project, ActionTriggerMutationModelMutationType } from '../../types/types'
const { QueryEditor } = require('graphiql/dist/components/QueryEditor') as any
const classes: any = require('./ActionTriggerBox.scss')

interface Props {
  triggerMutationModelMutationType: ActionTriggerMutationModelMutationType
  triggerMutationModelModelId: string
  triggerMutationModelFragment: string
  schema: any | null
  valid: boolean
  project: Project
  update: (payload: UpdateTriggerPayload) => void
}

export interface UpdateTriggerPayload {
  triggerMutationModelMutationType?: ActionTriggerMutationModelMutationType
  triggerMutationModelModelId?: string
  triggerMutationModelFragment?: string
}

class ActionTriggerBox extends React.Component<Props, {}> {

  render() {

    let queryEditor = null
    if (this.props.schema) {
      queryEditor = (
        <QueryEditor
          schema={this.props.schema}
          value={this.props.triggerMutationModelFragment}
          onEdit={(query) => this.props.update({ triggerMutationModelFragment: query })}
        />
      )
    }

    return (
      <div className={classes.root}>

        <div className={classes.head}>
          1. Trigger
          <input
            type='checkbox'
            checked={this.props.valid}
          />
        </div>

        <div className={classes.trigger}>
          <select
            value={this.props.triggerMutationModelModelId}
            onChange={(e) => this.props.update({ triggerMutationModelModelId: e.target.value })}
          >
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
            value={this.props.triggerMutationModelMutationType}
            onChange={(e) => this.props.update({
              triggerMutationModelMutationType: e.target.value as ActionTriggerMutationModelMutationType,
            })}
          >
            <option value='CREATE'>Create</option>
            <option value='UPDATE'>Update</option>
            <option value='DELETE'>Delete</option>
          </select>
        </div>
        <div className={classes.query}>
          Specify a query for your action handler payload
          {queryEditor}
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(ActionTriggerBox, {
  fragments: {
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
      }
    `,
  },
})
