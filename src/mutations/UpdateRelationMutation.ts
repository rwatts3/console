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
          ...TypeList_model
        }
        rightModel {
          id
          ...TypeList_model
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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          relation: input.id,
        },
      },
    ],
    optimisticResponse: {
      updateRelation: {
        relation: input.filterNullAndUndefined(),
      },
    },
  })
}

export default { commit }
