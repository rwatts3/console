import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {
  ActionTriggerType,
  ActionHandlerType,
  ActionTriggerMutationModelMutationType,
} from '../types/types'

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
        ...ActionBoxes_action
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input: input.filterNullAndUndefined() },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          action: input.actionId,
        },
      },
    ],
  })
}

export default { commit }
