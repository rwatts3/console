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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        relation: props.id,
      },
      optimisticResponse: props.filterNullAndUndefined(),
    }],
  })
}

export default { commit }
