import * as Relay from 'react-relay/classic'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  modelId: string
  projectId: string
}

export interface RelationData {
  relatedModelId: string
  reverseRelationFieldId: string
}

const mutation = graphql`
  mutation DeleteModelMutation($input: DeleteModelInput!) {
    deleteModel(input: $input) {
      project {
        id
      }
      deletedRelationFieldIds
      deletedId
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      modelId: props.modelId,
    },
    configs: [
      {
        type: 'NODE_DELETE',
        parentName: 'project',
        parentID: this.props.projectId,
        connectionName: 'models',
        deletedIDFieldName: 'deletedId',
      },
      {
        type: 'NODE_DELETE',
        parentName: 'project',
        parentID: this.props.projectId,
        connectionName: 'fields',
        deletedIDFieldName: 'deletedRelationFieldIds',
      },
    ],
  })
}

export default { commit }
