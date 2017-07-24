import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  name?: string
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
    variables: props.filterNullAndUndefined(),
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: props.id,
      },
    }],
    optimisticResponse: {
      model: props.filterNullAndUndefined(),
    },
  })
}

export default { commit }
