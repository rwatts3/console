import * as Relay from 'react-relay/classic'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  fieldId: string
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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      id: props.fieldId,
      description: props.description,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        field: this.props.fieldId,
      },
    }],
  })
}

export default { commit }
