import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {RelationPermission} from '../../types/types'

const mutation = graphql`
  mutation UpdateRelationPermissionMutation($input: UpdateRelationPermissionInput!) {
    updateRelationPermission(input: $input) {
      relationPermission {
        id
      }
    }
  }
`

function commit(props: RelationPermission) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        relationPermission: props.id,
      },
    }],
  })
}

export default { commit }
