import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  projectId?: string
  name?: string
  type?: FunctionType
  webhookUrl?: string
  headers?: string
  inlineCode?: string
  auth0Id?: string
  isActive?: boolean
  functionId: string
  schema?: string
}

const mutation = graphql`
  mutation UpdateSchemaExtensionFunctionMutation($input: UpdateSchemaExtensionFunctionInput!) {
    updateSchemaExtensionFunction(input: $input) {
      function {
        id
      }
      project {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input: pick(input, [
      'name', 'isActive', 'schema',
      'type', 'webhookUrl', 'webhookHeaders', 'inlineCode', 'auth0Id', 'functionId',
    ]).filterNullAndUndefined()},
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        function: input.functionId,
      },
    }],
  })
}

export default { commit }
