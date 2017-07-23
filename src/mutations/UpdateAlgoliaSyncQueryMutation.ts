import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {pick} from 'lodash'

interface Props {
  algoliaSyncQueryId: string
  isEnabled: boolean
  indexName: string
  fragment: string
}

const mutation = graphql`
  mutation UpdateAlgoliaSyncQueryMutation($input: UpdateAlgoliaSyncQueryInput!) {
    updateAlgoliaSyncQuery(input: $input) {
      searchProviderAlgolia {
        id
      }
      algoliaSyncQuery {
        id
      }
    }
  }
`

function commit(props: Props) {
  const {algoliaSyncQueryId, isEnabled, indexName, fragment} = props
  return makeMutation({
    mutation,
    variables: pick(props, ['algoliaSyncQueryId', 'indexName', 'fragment', 'isEnabled']),
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        algoliaSyncQuery: props.algoliaSyncQueryId,
      },
    }],
    optimisticResponse: {
      algoliaSyncQuery: {
        id: algoliaSyncQueryId,
        isEnabled,
        indexName,
        fragment,
      },
    },
  })
}

export default { commit }
