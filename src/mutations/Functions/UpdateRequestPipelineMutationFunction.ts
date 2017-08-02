import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import { FunctionBinding, FunctionType } from '../../types/types'
import { pick } from 'lodash'

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
  mutation UpdateRequestPipelineMutationFunctionMutation(
    $input: UpdateRequestPipelineMutationFunctionInput!
  ) {
    updateRequestPipelineMutationFunction(input: $input) {
      function {
        ...FunctionPopup_function
        ...FunctionRow_fn
        ... on RequestPipelineMutationFunction {
          binding
          model {
            id
            name
          }
          operation
        }
      }
      project {
        id
        functions(first: 1000) {
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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: pick(input, [
        'name',
        'isActive',
        'binding',
        'modelId',
        'operation',
        'type',
        'webhookUrl',
        'webhookHeaders',
        'inlineCode',
        'auth0Id',
        'functionId',
      ]).filterNullAndUndefined(),
    },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          function: input.functionId,
        },
      },
    ],
  })
}

export default { commit }
