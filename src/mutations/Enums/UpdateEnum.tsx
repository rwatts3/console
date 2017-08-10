import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  enumId: string
  name: string
  values: string[]
}

const mutation = graphql`
  mutation UpdateEnumMutation($input: UpdateEnumInput!) {
    updateEnum(input: $input) {
      enum {
        id
        name
        values
      }
      project {
        schema
        enumSchema
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
          enum: input.enumId,
        },
      },
    ],
  })
}

export default { commit }
