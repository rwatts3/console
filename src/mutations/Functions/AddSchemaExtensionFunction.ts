import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {FunctionBinding, FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  projectId: string
  name: string
  type?: FunctionType
  webhookUrl: string
  webhookHeaders?: string
  inlineCode?: string
  auth0Id?: string
  isActive: boolean
  schema: string
}

const mutation = graphql`
  mutation AddSchemaExtensionFunctionMutation($input: AddSchemaExtensionFunctionInput!) {
    addSchemaExtensionFunction(input: $input) {
      function {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: pick(props, [
      'projectId', 'name', 'isActive', 'schema',
      'type', 'webhookUrl', 'inlineCode', 'auth0Id', 'webhookHeaders',
    ]),
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'functions',
      edgeName: 'functionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default { commit }
