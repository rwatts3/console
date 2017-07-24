import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  fieldId: string
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
    variables: {
      id: props.fieldId,
      isUnique: props.isUnique,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        field: props.fieldId,
      },
    }],
  })
}

export default { commit }
