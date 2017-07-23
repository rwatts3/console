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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      projectId: props.projectId,
      name: props.tokenName,
    },
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'permanentAuthTokens',
      edgeName: 'permanentAuthTokenEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
