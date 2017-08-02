import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  description: string
}

const mutation = graphql`
  mutation UpdateRelationDescriptionMutation($input: UpdateRelationInput!) {
    updateRelation(input: $input) {
      relation {
        id
        description
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
        relation: input.id,
      },
    }],
  })
}

export default { commit }
