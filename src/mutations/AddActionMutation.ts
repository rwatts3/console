import * as Relay from 'react-relay/classic'
import {graphql} from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { ActionTriggerType, ActionHandlerType, ActionTriggerMutationModelMutationType } from '../types/types'

interface Props {
  projectId: string
  isActive: boolean
  description: string
  triggerType: ActionTriggerType
  handlerType: ActionHandlerType
  triggerMutationModel?: TriggerMutationModelProps
  handlerWebhook?: HandlerWebhookProps
}

interface TriggerMutationModelProps {
  fragment: string
  mutationType: ActionTriggerMutationModelMutationType
  modelId: string
}

interface HandlerWebhookProps {
  url: string
}

const mutation = graphql`
  mutation AddActionMutation($input: AddActionInput!) {
    addAction(input: $input) {
      actionEdge {
        node {
          id
        }
      }
      project {
        actions(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'actions',
      edgeName: 'actionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}

