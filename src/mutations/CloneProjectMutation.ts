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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      projectId: props.projectId,
      name: props.name,
      includeData: props.includeData,
      includeMutationCallbacks: props.includeMutationCallbacks,
    },
    configs: [
      {
        type: 'RANGE_ADD',
        parentName: 'user',
        parentID: this.props.customerId,
        connectionName: 'projects',
        edgeName: 'projectEdge',
        rangeBehaviors: {
          '': 'append',
        },
      }
    ]
  })
}

export default {commit}
