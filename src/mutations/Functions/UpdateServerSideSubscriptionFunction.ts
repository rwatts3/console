import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  id: string
  projectId: string
  name?: string
  type?: FunctionType
  webhookUrl?: string
  headers?: string
  inlineCode?: string
  auth0Id?: string
  isActive?: boolean
  functionId?: string
  query?: string
}

const mutation = graphql`
  mutation UpdateServerSideSubscriptionFunction($input: UpdateServerSideSubscriptionFunctionInput!) {
    updateServerSideSubscriptionFunction(input: $input) {
      function {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: pick(this.props, [
      'name', 'isActive', 'query',
      'type', 'webhookUrl', 'webhookHeaders', 'inlineCode', 'auth0Id', 'functionId',
    ]).filterNullAndUndefined(),
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        function: props.id,
      },
    }],
  })
}

export default { commit }
