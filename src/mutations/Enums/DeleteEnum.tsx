import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  enumId: string
  projectId: string
}

const mutation = graphql`
  mutation DeleteEnumMutation($input: DeleteEnumInput!) {
    deleteEnum(input: $input) {
      enum {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        enumId: input.enumId,
      },
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: input.projectId,
      connectionName: 'enums',
      deletedIDFieldName: 'enum { id }',
    }],
  })
}

export default { commit }
