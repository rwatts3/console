import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  fieldId: string
  modelId: string
  projectName: string
}

const mutation = graphql`
  mutation DeleteFieldMutation(
    $input: DeleteFieldInput!
    $projectName: String!
  ) {
    deleteField(input: $input) {
      model {
        fields(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
      deletedId
      viewer {
        projectByName(projectName: $projectName) {
          id
          schema
          typeSchema
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
        fieldId: input.fieldId,
      },
      projectName: input.projectName,
    },
    configs: [
      {
        type: 'NODE_DELETE',
        parentName: 'model',
        parentID: input.modelId,
        connectionName: 'fields',
        deletedIDFieldName: 'deletedId',
      },
    ],
  })
}

export default { commit }
