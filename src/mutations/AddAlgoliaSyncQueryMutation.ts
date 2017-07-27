import {pick} from 'lodash'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  modelId: string
  indexName: string
  fragment: string
  searchProviderAlgoliaId: string
}

const mutation = graphql`
  mutation AddAlgoliaSyncQueryMutation($input: AddAlgoliaSyncQueryInput!) {
    addAlgoliaSyncQuery(input: $input) {
      searchProviderAlgolia {
        id
        algoliaSyncQueries(first: 1000) {
          edges {
            node {
              id
              indexName
              isEnabled
              fragment
              model {
                itemCount
                id
                name
              }
            }
          }
        }
      }
      algoliaSyncQueryEdge {
        node {
          id
        }
      }
      algoliaSyncQueryConnection(first: 1000) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input: pick(input, ['modelId', 'indexName', 'fragment'])},
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'searchProviderAlgolia',
      parentID: input.searchProviderAlgoliaId,
      connectionName: 'algoliaSyncQueries',
      edgeName: 'algoliaSyncQueryEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
