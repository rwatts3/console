import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
}

const mutation = graphql`
  mutation EjectProjectMutation($input: EjectProjectInput!) {
    ejectProject(input: $input) {
      project {
        id
        isEjected
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
          project: input.projectId,
        },
      },
    ],
    optimisticResponse: {
      updateProject: { project: { input } },
    },
  })
}

export default { commit }
