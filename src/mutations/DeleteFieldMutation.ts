import * as Relay from 'react-relay/classic'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  fieldId: string
  modelId: string
}

const mutation = graphql`
  mutation DeleteFieldMutation($input: DeleteFieldInput!) {
    deleteField(input: $input) {
      model {
        id
      }
      deletedId
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      deletedId: props.fieldId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'model',
      parentID: props.modelId,
      connectionName: 'fields',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }

