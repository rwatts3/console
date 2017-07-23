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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: pick(props, ['modelId', 'indexName', 'fragment']),
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'searchProviderAlgolia',
      parentID: props.searchProviderAlgoliaId,
      connectionName: 'algoliaSyncQueries',
      edgeName: 'algoliaSyncQueryEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
