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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      deletedId: props.tokenId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'permanentAuthTokens',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
