import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  algoliaSyncQueryId: string
  searchProviderAlgoliaId: string
}

const mutation = graphql`
  mutation DeleteAlgoliaSyncQueryMutation($input: DeleteAlgoliaSyncQueryInput!) {
    deleteAlgoliaSyncQuery(input: $input) {
      searchProviderAlgolia {
        id
      }
      deletedId
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        algoliaSyncQueryId: input.algoliaSyncQueryId,
      }
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'searchProviderAlgolia',
      parentID: input.searchProviderAlgoliaId,
      connectionName: 'algoliaSyncQueries',
      deletedIDFieldName: 'deletedId',
    }]
  })
}

export default { commit }
