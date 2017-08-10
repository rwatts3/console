import { graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  relationId: string
  projectId: string
  leftModelId: string
  rightModelId: string
  fieldOnLeftModelId: string
  fieldOnRightModelId: string
}

const mutation = graphql`
  mutation DeleteRelationMutation($input: DeleteRelationInput!) {
    deleteRelation(input: $input) {
      project {
        id
        schema
        typeSchema
        relations(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
        fields(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
      deletedId
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        relationId: input.relationId,
      },
    },
    updater: store => {
      const leftModel = store.get(input.leftModelId)
      const rightModel = store.get(input.rightModelId)

      const leftModelFieldConnection = ConnectionHandler.getConnection(
        leftModel,
        'TypeBox_model_fields',
        {
          first: 1000,
        },
      )
      const rightModelFieldConnection = ConnectionHandler.getConnection(
        rightModel,
        'TypeBox_model_fields',
        {
          first: 1000,
        },
      )
      ConnectionHandler.deleteNode(
        leftModelFieldConnection,
        input.fieldOnLeftModelId,
      )
      ConnectionHandler.deleteNode(
        rightModelFieldConnection,
        input.fieldOnRightModelId,
      )
    },
    configs: [
      {
        type: 'NODE_DELETE',
        parentName: 'project',
        parentID: input.projectId,
        connectionName: 'relations',
        deletedIDFieldName: 'deletedId',
      },
    ],
  })
}

export default { commit }
