import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  modelId: string
  name: string
  description?: string
}

const mutation = graphql`
  mutation UpdateModelMutation($input: UpdateModelInput!) {
    updateModel(input: $input) {
      model {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      id: props.modelId,
      name: props.name,
      description: props.description,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: props.modelId,
      },
    }],
    optimisticResponse: {
      model: {
        id: props.modelId,
        name: props.name,
        description: props.description,
      },
    },
  })
}

export default { commit }
