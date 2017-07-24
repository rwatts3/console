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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input},
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: input.id,
      },
    }],
    optimisticResponse: {updateModel: {model: input}},
  })
}

export default { commit }
