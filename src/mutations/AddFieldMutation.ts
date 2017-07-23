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
        fields(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      modelId: props.modelId,
      name: props.name,
      typeIdentifier: props.typeIdentifier,
      isRequired: props.isRequired,
      isList: props.isList,
      isUnique: props.isUnique,
      defaultValue: props.defaultValue,
      relationId: props.relationId,
      migrationValue: props.migrationValue,
      description: props.description || null,
      enumId: props.enumId || null,
    },
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'model',
      parentID: props.modelId,
      connectionName: 'fields',
      edgeName: 'fieldEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
