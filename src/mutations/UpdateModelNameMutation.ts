import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  name: string
}

const mutation = graphql`
  mutation UpdateModelNameMutation($input: UpdateModelInput!) {
    updateModel(input: $input) {
      model {
        id
        name
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: props.id,
      },
    }],
    optimisticResponse: props,
  })
}

export default { commit }
