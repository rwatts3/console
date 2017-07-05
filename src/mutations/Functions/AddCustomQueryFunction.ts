import * as Relay from 'react-relay'
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

export default class AddCustomQueryFunction extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{addCustomQueryFunction}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddCustomQueryFunctionPayload {
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
      edgeName: 'functionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return pick(this.props, [
      'projectId', 'name', 'isActive', 'schema',
      'type', 'webhookUrl', 'inlineCode', 'auth0Id', 'webhookHeaders',
    ])
  }
}
