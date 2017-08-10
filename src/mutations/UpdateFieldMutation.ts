import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { omit } from 'lodash'

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
  projectName: string
}

const mutation = graphql`
  mutation UpdateFieldMutation(
    $input: UpdateFieldInput!
    $projectName: String!
  ) {
    updateField(input: $input) {
      field {
        id
        name
        isList
        isRequired
      }
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

function commit(input: UpdateFieldProps) {
  return makeMutation({
    mutation,
    variables: {
      input: omit(input, [
        'isSystem',
        'relation',
        'reverseRelationField',
        'enum',
        'projectName',
      ]),
      projectName: input.projectName,
    },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          field: input.id,
        },
      },
    ],
    optimisticResponse: {
      updateField: {
        field: {
          id: input.id,
          name: input.name,
          typeIdentifier: input.typeIdentifier,
          enumValues: input.enumValues,
          isRequired: input.isRequired,
          isList: input.isList,
          isUnique: input.isUnique,
          defaultValue: input.defaultValue,
          description: input.description || null,
          enumId: input.enumId,
        },
      },
    },
  })
}

export default { commit }
