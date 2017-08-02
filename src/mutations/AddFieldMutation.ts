import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  modelId: string
  name: string
  typeIdentifier: string
  isRequired: boolean
  isUnique: boolean
  isList: boolean
  defaultValue?: string
  relationId?: string
  migrationValue?: string
  description: string
  enumId?: string
}

const mutation = graphql`
  mutation AddFieldMutation($input: AddFieldInput!) {
    addField(input: $input) {
      fieldEdge {
        node {
          id
        }
      }
      model {
        ...NewRow_model
        ...TypeList_model
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        modelId: input.modelId,
        name: input.name,
        typeIdentifier: input.typeIdentifier,
        isRequired: input.isRequired,
        isList: input.isList,
        isUnique: input.isUnique,
        defaultValue: input.defaultValue,
        relationId: input.relationId,
        migrationValue: input.migrationValue,
        description: input.description || null,
        enumId: input.enumId || null,
      },
    },
    configs: [
      {
        type: 'RANGE_ADD',
        parentName: 'model',
        parentID: input.modelId,
        connectionName: 'fields',
        edgeName: 'fieldEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ],
  })
}

export default { commit }
