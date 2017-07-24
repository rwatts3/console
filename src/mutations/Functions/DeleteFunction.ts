import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
  functionId: string
}

const mutation = graphql`
  mutation DeleteFunction($input: DeleteFunctionInput!) {
    deleteFunction(input: $input) {
      deletedId
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      functionId: props.functionId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'functions',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
