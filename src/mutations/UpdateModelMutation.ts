import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  name?: string
  description?: string
}

const mutation = graphql`
  mutation UpdateModelMutation($input: UpdateModelInput!) {
    updateModel(input: $input) {
      model {
        id
      }
      project {
        schema
        typeSchema
        enumSchema
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input: input.filterNullAndUndefined() },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          model: input.id,
        },
      },
    ],
  })
}

export default { commit }
