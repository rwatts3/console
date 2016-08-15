import * as Relay from 'react-relay'
import {SystemToken} from '../types/types'

interface Props {
  projectId: string
  systemToken: SystemToken
}

export default class AddSystemTokenMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{createSystemToken}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateSystemTokenPayload {
        systemTokenEdge
        project
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'systemTokens',
      edgeName: 'systemTokenEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables() {
    return this.props
  }
}
