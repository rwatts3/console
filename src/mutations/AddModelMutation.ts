import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
  modelName: string
  description?: string
}

const mutation = graphql`
  mutation AddModelMutation($input: AddModelInput!) {
    addModel(input: $input) {
      modelEdge {
        node {
          ...NewRow_model
          ...ModelHeader_model
          ...SideNav_model
          ...TypeList_model
        }
      }
      project {
        models(first: 1000) {
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
        modelName: input.modelName,
        description: input.description,
      },
    },
    configs: [
      {
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: input.projectId,
        connectionName: 'models',
        edgeName: 'modelEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ],
  })
}

export default { commit }
