import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
  name: string
  customerId: string
  includeData: boolean
  includeMutationCallbacks: boolean
}

const mutation = graphql`
  mutation CloneProjectMutation($input: CloneProjectInput!) {
    cloneProject(input: $input) {
      projectEdge {
        node {
          id
        }
      }
      user {
        projects(first: 1000) {
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
        name: input.name,
        includeData: input.includeData,
        includeMutationCallbacks: input.includeMutationCallbacks,
      },
    },
    configs: [
      {
        type: 'RANGE_ADD',
        parentName: 'user',
        parentID: input.customerId,
        connectionName: 'projects',
        edgeName: 'projectEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ],
  })
}

export default { commit }
