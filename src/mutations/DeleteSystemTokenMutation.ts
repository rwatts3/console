import * as Relay from 'react-relay'

interface Props {
  projectId: string
  tokenId: string
}

export default class DeleteSystemTokenMutation extends Relay.Mutation<Props, {}> {

  getMutation() {
    return Relay.QL`mutation{revokeSystemToken}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RevokeSystemTokenPayload {
        deletedId
        project
      }
    `
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'systemTokens',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables() {
    return {
      tokenId: this.props.tokenId,
    }
  }

  getOptimisticResponse() {
    return {
      deletedId: this.props.tokenId,
    }
  }
}
