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

function commit(props: ModelPermission) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        modelPermission: props.id,
      },
    }],
  })
}

export default { commit }
