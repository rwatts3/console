import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {ModelPermission} from '../../types/types'

const mutation = graphql`
  mutation UpdateModelPermissionMutation($input: UpdateModelPermissionInput!) {
    updateModelPermission(input: $input) {
      modelPermission {
        id
      }
    }
  }
`

function commit(input: ModelPermission) {
  return makeMutation({
    mutation,
    variables: {input},
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        modelPermission: input.id,
      },
    }],
  })
}

export default { commit }
