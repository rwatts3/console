import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
  tokenId: string
}

const mutation = graphql`
  mutation DeletePermanentAuthTokenMutation($input: DeletePermanentAuthTokenInput!) {
    deletePermanentAuthToken(input: $input) {
      deletedId
      project {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        deletedId: input.tokenId,
      },
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: input.projectId,
      connectionName: 'permanentAuthTokens',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
