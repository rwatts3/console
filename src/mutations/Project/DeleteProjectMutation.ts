import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        projectId: input.projectId,
      },
    },
    configs: [
      // {
      //   type: 'NODE_DELETE',
      //   parentName: 'user',
      //   parentID: input.customerId,
      //   connectionName: 'projects',
      //   deletedIDFieldName: 'deletedId',
      // },
    ],
  })
}

export default { commit }
