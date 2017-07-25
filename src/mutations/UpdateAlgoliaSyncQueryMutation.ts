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
        algoliaSyncQueries(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
      algoliaSyncQuery {
        id
        isEnabled
        indexName
        fragment
      }
    }
  }
`

function commit(input: Props) {
  const {algoliaSyncQueryId, isEnabled, indexName, fragment} = input
  return makeMutation({
    mutation,
    variables: {input: pick(input, ['algoliaSyncQueryId', 'indexName', 'fragment', 'isEnabled'])},
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        algoliaSyncQuery: input.algoliaSyncQueryId,
      },
    }],
    optimisticResponse: {
      updateAlgoliaSyncQuery: {
        algoliaSyncQuery: {
          id: algoliaSyncQueryId,
          isEnabled,
          indexName,
          fragment,
        },
      }
    },
  })
}

export default { commit }
