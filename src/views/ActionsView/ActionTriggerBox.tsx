import * as React from 'react'
import * as Relay from 'react-relay'
import { Project, ActionTriggerMutationModelMutationType } from '../../types/types'
import Icon from '../../components/Icon/Icon'
import {QueryEditor} from 'graphiql/dist/components/QueryEditor'
const classes: any = require('./ActionTriggerBox.scss')
const sharedClasses: any = require('./ActionBox.scss')

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
          <div className={classes.title}>Trigger</div>
          <Icon
            width={24}
            height={24}
            src={require(`assets/new_icons/${this.props.valid ? 'check' : 'warning'}.svg`)}
            color={this.props.valid ? '#7ED321' : '#F5A623'}
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
            <option value='CREATE'>is created</option>
            <option value='UPDATE'>is updated</option>
            <option value='DELETE'>is deleted</option>
          </select>
        </div>
        <div className={sharedClasses.info}>
          Specify a query for your action handler payload
        </div>
        <div className={classes.query}>
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
