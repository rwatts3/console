import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
  functionId: string
}

const mutation = graphql`
  mutation DeleteFunctionMutation($input: DeleteFunctionInput!) {
    deleteFunction(input: $input) {
      deletedId
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        functionId: input.functionId,
      },
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: input.projectId,
      connectionName: 'functions',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
