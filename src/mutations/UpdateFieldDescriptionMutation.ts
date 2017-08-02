import * as Relay from 'react-relay/classic'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  description: string
}

const mutation = graphql`
  mutation UpdateFieldDescriptionMutation($input: UpdateFieldInput!) {
    updateField(input: $input) {
      field {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          field: input.id,
        },
      },
    ],
  })
}

export default { commit }
