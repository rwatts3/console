import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
  tokenName: string
}

const mutation = graphql`
  mutation AddPermanentAuthTokenMutation($input: AddPermanentAuthTokenInput!) {
    addPermanentAuthToken(input: $input) {
      permanentAuthTokenEdge {
        node {
          id
          name
          token
        }
      }
      project {
        permanentAuthTokens(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        projectId: input.projectId,
        name: input.tokenName,
      },
    },
    configs: [
      {
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: input.projectId,
        connectionName: 'permanentAuthTokens',
        edgeName: 'permanentAuthTokenEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ],
  })
}

export default { commit }
