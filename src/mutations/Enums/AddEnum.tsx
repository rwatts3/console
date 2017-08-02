import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
  name: string
  values: string[]
}

const mutation = graphql`
  mutation AddEnumMutation($input: AddEnumInput!) {
    addEnum(input: $input) {
      enumEdge {
        node {
          id
        }
      }
      project {
        id
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
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: input.projectId,
        connectionName: 'enums',
        edgeName: 'enumEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ],
  })
}

export default { commit }
