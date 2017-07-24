import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  id: string
  name: string
  description?: string
  leftModelId: string
  rightModelId: string
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  fieldOnLeftModelIsRequired: boolean
  fieldOnRightModelIsRequired: boolean
}

const mutation = graphql`
  mutation UpdateRelationMutation($input: UpdateRelationInput!) {
    updateRelation(input: $input) {
      relation {
        id
        name
        description
        leftModel {
          id
        }
        rightModel {
          id
        }
        fieldOnLeftModel {
          id
        }
        fieldOnRightModel {
          id
        }
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
    }],
    optimisticResponse: props.filterNullAndUndefined(),
  })
}

export default { commit }
