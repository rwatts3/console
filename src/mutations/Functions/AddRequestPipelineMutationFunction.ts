import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import {FunctionBinding, FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  projectId: string
  name: string
  binding?: FunctionBinding
  modelId?: string
  type?: FunctionType
  webhookUrl: string
  webhookHeaders?: string
  inlineCode?: string
  auth0Id?: string
  operation?: string
  isActive: boolean
}

const mutation = graphql`
  mutation AddRequestPipelineMutationFunctionMutation($input: AddRequestPipelineMutationFunctionInput!) {
    addRequestPipelineMutationFunction(input: $input) {
      function {
        id
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
    variables: {input: pick(input, [
      'projectId', 'name', 'isActive', 'binding', 'modelId', 'operation',
      'type', 'webhookUrl', 'inlineCode', 'auth0Id', 'webhookHeaders',
    ])},
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: input.projectId,
      connectionName: 'functions',
      edgeName: 'functionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default { commit }
