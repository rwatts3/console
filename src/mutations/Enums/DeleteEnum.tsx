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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      enumId: props.enumId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'enums',
      deletedIDFieldName: 'enum { id }',
    }],
  })
}

export default { commit }
