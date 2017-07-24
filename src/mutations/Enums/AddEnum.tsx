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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'enums',
      edgeName: 'enumEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default { commit }
