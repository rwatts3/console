import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  isUnique: boolean
}

const mutation = graphql`
  mutation UpdateFieldIsUniqueMutation($input: UpdateFieldInput!) {
    updateField(input: $input) {
      field {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {input},
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        field: props.id,
      },
    }],
  })
}

export default { commit }
