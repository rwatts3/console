import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  description: string
}

const mutation = graphql`
  mutation UpdateModelDescriptionMutation($input: UpdateModelInput!) {
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
    variables: props,
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: props.id,
      },
    }],
    optimisticResponse: {
      model: {
        id: props.id,
        description: props.description,
      },
    }
  })
}

export default { commit }
