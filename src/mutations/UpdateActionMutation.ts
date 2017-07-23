import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { ActionTriggerType, ActionHandlerType, ActionTriggerMutationModelMutationType } from '../types/types'

interface Props {
  actionId: string
  isActive?: boolean
  description?: string
  triggerType?: ActionTriggerType
  handlerType?: ActionHandlerType
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
  mutation UpdateActionMutation($input: UpdateActionInput!) {
    updateAction(input: $input) {
      action {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      actionId: props.actionId,
      isActive: props.isActive,
      description: props.description,
      triggerType: props.triggerType,
      handlerType: props.handlerType,
      triggerMutationModel: props.triggerMutationModel,
      handlerWebhook: props.handlerWebhook,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        action: props.actionId,
      },
    }],
  })
}

export default { commit }
