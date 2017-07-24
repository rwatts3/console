import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  name?: string
  type?: FunctionType
  webhookUrl?: string
  headers?: string
  inlineCode?: string
  auth0Id?: string
  isActive?: boolean
  functionId: string
  query?: string
}

const mutation = graphql`
  mutation UpdateServerSideSubscriptionFunctionMutation($input: UpdateServerSideSubscriptionFunctionInput!) {
    updateServerSideSubscriptionFunction(input: $input) {
      function {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input: pick(input, [
      'name', 'isActive', 'query',
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
