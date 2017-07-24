import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Project {
  id: string
}

interface Props {
  name: string,
  id: string
  alias?: string
}

const mutation = graphql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        id
        name
        alias
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
        project: props.id,
      },
    }],
    optimisticResponse: props,
  })
}

export default { commit }
