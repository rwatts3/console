import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  name: string
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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          project: input.id,
        },
      },
    ],
    optimisticResponse: {
      updateProject: { project: { input } },
    },
  })
}

export default { commit }
