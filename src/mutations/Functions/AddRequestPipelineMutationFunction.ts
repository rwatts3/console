import * as Relay from 'react-relay'
import {FunctionBinding, FunctionType} from '../../types/types'

interface Props {
  projectId: string
  name: string
  binding: FunctionBinding
  modelId: string
  type: FunctionType
  url: string
  headers?: string
  inlineCode?: string
  auth0Id?: string
}

export default class AddRequestPipelineMutationFunction extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{addRequestPipelineMutationFunction}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddRequestPipelineMutationFunctionPayload {
        function
        project
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'functions',
      edgeName: 'function',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return this.props
  }
}
