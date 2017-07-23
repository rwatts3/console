import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string,
  customerId: string
}

const mutation = graphql`
  mutation DeleteProjectMutation($input: DeleteProjectInput!) {
    deleteProject(input: $input) {
      user {
        projects(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
      deletedId
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      projectId: props.projectId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'user',
      parentID: props.customerId,
      connectionName: 'projects',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }

