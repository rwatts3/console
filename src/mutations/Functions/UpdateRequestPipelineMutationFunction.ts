import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {FunctionBinding, FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  functionId: string
  name?: string
  binding?: FunctionBinding
  modelId?: string
  type?: FunctionType
  webhookUrl?: string
  webhookHeaders?: string
  inlineCode?: string
  auth0Id?: string
  operation?: string
  isActive?: boolean
}

const mutation = graphql`
  mutation UpdateRequestPipelineMutationFunctionMutation($input: UpdateRequestPipelineMutationFunctionInput!) {
    updateRequestPipelineMutationFunction(input: $input) {
      function {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: pick(props, [
      'name', 'isActive', 'binding', 'modelId', 'operation',
      'type', 'webhookUrl', 'webhookHeaders', 'inlineCode', 'auth0Id', 'functionId',
    ]).filterNullAndUndefined(),
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        function: props.functionId,
      },
    }],
  })
}

export default { commit }
