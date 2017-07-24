import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

export interface UpdateFieldProps {
  id: string
  name: string
  typeIdentifier?: string
  enumValues: string[]
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  defaultValue?: string
  relationId?: string
  migrationValue?: string
  description?: string
  enumId?: string
}

const mutation = graphql`
  mutation UpdateFieldMutation($input: UpdateFieldInput!) {
    updateField(input: $input) {
      field {
        id
      }
    }
  }
`

function commit(props: UpdateFieldProps) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        field: props.id,
      },
    }],
    optimisticResponse: {
      field: {
        id: props.id,
        name: props.name,
        typeIdentifier: props.typeIdentifier,
        enumValues: props.enumValues,
        isRequired: props.isRequired,
        isList: props.isList,
        isUnique: props.isUnique,
        defaultValue: props.defaultValue,
        description: props.description || null,
        enumId: props.enumId,
      },
    },
  })
}

export default { commit }
