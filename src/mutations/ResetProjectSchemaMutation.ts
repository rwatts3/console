import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectId: string
}

const mutation = graphql`
  mutation ResetProjectSchemaMutation($input: ResetProjectSchemaInput!) {
    resetProjectSchema(input: $input) {
      viewer {
        id
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
        viewer: 'cryptic',
      },
    }],
  })
}

export default { commit }
