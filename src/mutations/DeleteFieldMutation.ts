import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  fieldId: string
  modelId: string
}

const mutation = graphql`
  mutation DeleteFieldMutation($input: DeleteFieldInput!) {
    deleteField(input: $input) {
      model {
        id
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
        deletedId: input.fieldId,
      },
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
